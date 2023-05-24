package njt.paketnik

import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.os.Bundle
import android.util.Base64
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.zxing.integration.android.IntentIntegrator
import com.google.zxing.integration.android.IntentResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import njt.paketnik.databinding.ActivityQrScannerBinding
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONException
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.util.zip.GZIPInputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream


class QrScannerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityQrScannerBinding
    private var mediaPlayer: MediaPlayer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQrScannerBinding.inflate(layoutInflater)
        val view = binding.root
        setContentView(view)

        binding.openScanner.setOnClickListener {
            startQRScanner()
        }
    }

    private val qrScannerActivityResultLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        val intentResult: IntentResult? = IntentIntegrator.parseActivityResult(result.resultCode, result.data)
        if (intentResult != null) {
            if (intentResult.contents.isNullOrEmpty()) {
                Toast.makeText(this, "Cancelled", Toast.LENGTH_LONG).show()
            } else {
                val boxId = getNumberFromUrl(intentResult.contents)
                binding.result.text = boxId?.toString() ?: "Invalid URL"

                if (boxId != null) {
                    val format = 2
                    val apiUrl = "https://api-d4me-stage.direct4.me/sandbox/v1/Access/openbox"
                    val jsonData =
                        "{\"deliveryId\":0,\"boxId\":$boxId,\"tokenFormat\":$format,\"terminalSeed\":0,\"isMultibox\":false,\"addAccessLog\":false}"

                    lifecycleScope.launch {
                        val resJson: JSONObject
                        val response = sendPostRequest(apiUrl, jsonData)

                        try {
                            resJson = JSONObject(response)

                            if (resJson["errorNumber"] != 0) {
                                binding.resultFormat.text = "napaka"
                            } else {
                                binding.resultFormat.text = "uspeh"
                                convertB64ToSound(resJson["data"].toString(), format)
                            }
                        } catch (e: JSONException) {
                            if (response == "") {
                                binding.resultFormat.text = "unexpected response"
                            } else {
                                binding.resultFormat.text = "pasring error"
                            }
                        }
                    }
                } else {
                    binding.resultFormat.text = "did not get number"
                }
            }
        }
    }

    private fun getNumberFromUrl(url: String): Int? {
        val pattern = """/\d+/(\d+)/""".toRegex()
        val matchResult = pattern.find(url)
        return matchResult?.groupValues?.get(1)?.toInt()
    }

    private fun startQRScanner() {
        val integrator = IntentIntegrator(this)
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE)
        integrator.setPrompt("Scan a QR Code")
        integrator.setCameraId(0) // Use the rear camera by default
        integrator.setBeepEnabled(false) // Disable beep sound
        integrator.setOrientationLocked(false) // Allow rotation
        qrScannerActivityResultLauncher.launch(integrator.createScanIntent())
    }

    private suspend fun sendPostRequest(apiUrl: String, jsonBody: String): String {
        val mediaType = "application/json".toMediaType()
        val requestBody = jsonBody.toRequestBody(mediaType)
        val request = Request.Builder()
            .url(apiUrl)
            .header("Authorization", "Bearer 9ea96945-3a37-4638-a5d4-22e89fbc998f") //daj v .env
            .post(requestBody)
            .build()
        val client = OkHttpClient()
        return withContext(Dispatchers.IO) {
            try {
                val response = client.newCall(request).execute()
                return@withContext response.body?.string() ?: ""
                //return@withContext response.code.toString()
            } catch (e: IOException) {
                e.printStackTrace()
                return@withContext ""
            }
        }
    }

    private fun convertB64ToSound(base64String: String, format: Int) {
        try {
            val byteArray = Base64.decode(base64String, Base64.DEFAULT)

            when (format) {
                1, 3 -> {
                    val gzipInputStream = GZIPInputStream(ByteArrayInputStream(byteArray))
                    val outputStream = ByteArrayOutputStream()
                    val buffer = ByteArray(1024)
                    var length: Int

                    while (gzipInputStream.read(buffer).also { length = it } > 0) {
                        outputStream.write(buffer, 0, length)
                    }

                    val soundBytes = outputStream.toByteArray()
                    playSoundFile(soundBytes, format)
                    gzipInputStream.close()
                }

                2, 4 -> {
                    val zipInputStream = ZipInputStream(ByteArrayInputStream(byteArray))
                    var zipEntry: ZipEntry? = zipInputStream.nextEntry

                    while (zipEntry != null) {
                        if (!zipEntry.isDirectory && zipEntry.name.endsWith(".wav")) {
                            val outputStream = ByteArrayOutputStream()
                            val buffer = ByteArray(1024)
                            var length: Int

                            while (zipInputStream.read(buffer).also { length = it } > 0) {
                                outputStream.write(buffer, 0, length)
                            }

                            val soundBytes = outputStream.toByteArray()
                            playSoundFile(soundBytes, format)

                            break
                        }
                        zipEntry = zipInputStream.nextEntry
                    }
                    zipInputStream.close()
                }

                5, 6 -> {
                    playSoundFile(byteArray, format)
                }

                else -> throw IllegalArgumentException("Wrong format given: $format")
            }
        } catch (e: IllegalArgumentException) {
            e.printStackTrace()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    private fun saveSoundFile(soundBytes: ByteArray, format: Int): File {
        val tempDir = cacheDir

        val tempFile = when (format) {
            in 1..4 -> {
                File.createTempFile("temp", ".wav", tempDir)
            }

            5, 6 -> {
                File.createTempFile("temp", ".mp3", tempDir)
            }

            else -> throw IllegalArgumentException("Wrong format given: $format")
        }

        val outputStream = FileOutputStream(tempFile)
        outputStream.write(soundBytes)
        outputStream.close()
        return tempFile
    }

    private fun playSoundFile(soundBytes: ByteArray, format: Int) {
        releaseMediaPlayer()

        try {
            val soundFile = saveSoundFile(soundBytes, format)

            mediaPlayer = MediaPlayer()
            mediaPlayer?.setAudioAttributes(
                AudioAttributes.Builder()
                    .setLegacyStreamType(AudioManager.STREAM_MUSIC)
                    .build()
            )
            mediaPlayer?.setDataSource(soundFile.path)
            mediaPlayer?.prepare()
            mediaPlayer?.start()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    private fun releaseMediaPlayer() {
        val filesToDelete = cacheDir.listFiles { file ->
            file.name.matches(Regex("^temp.*\\.(wav|mp3)$"))
        }

        filesToDelete?.forEach { file ->
            file.delete()
        }

        mediaPlayer?.release()
        mediaPlayer = null
    }

    override fun onDestroy() {
        super.onDestroy()
        releaseMediaPlayer()
    }
}