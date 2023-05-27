package njt.paketnik

import android.media.AudioAttributes
import android.media.AudioManager
import android.content.Intent
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Base64
import android.media.MediaPlayer
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatDelegate
import androidx.lifecycle.lifecycleScope
import com.google.zxing.integration.android.IntentIntegrator
import com.google.zxing.integration.android.IntentResult
import njt.paketnik.databinding.ActivityMainBinding
import kotlinx.coroutines.launch
import java.io.IOException
import org.json.JSONException
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.util.zip.GZIPInputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private var mediaPlayer: MediaPlayer? = null
    private lateinit var app: MyApp

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        val view = binding.root
        app = application as MyApp
        setContentView(view)

        if (app.settings.contains("Theme")) {
            when (app.settings.getInt("Theme", 0)) {
                0 -> {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
                }
                1 -> {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
                }
                2 -> {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
                }
            }
        }

        if (app.userInfo.getString("userID", "") == "") {
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
        } else {
            lifecycleScope.launch {
                app.getUserInfo()
            }
        }

        binding.openScannerBtn.setOnClickListener {
            startQRScanner()
        }

        binding.logoutBtn.setOnClickListener{
            app.unsetUser()
        }

        binding.openPackagersList.setOnClickListener {
            val intent = Intent(this, PackagersActivity::class.java)
            startActivity(intent)
        }

        binding.openSettings.setOnClickListener {
            val intent = Intent(this, SettingsActivity::class.java)
            startActivity(intent)
        }
    }

    private val qrScannerActivityResultLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        val intentResult: IntentResult? = IntentIntegrator.parseActivityResult(result.resultCode, result.data)
        if (intentResult != null) {
            if (intentResult.contents.isNullOrEmpty()) {
                Toast.makeText(this, "Cancelled", Toast.LENGTH_LONG).show()
            } else {
                val boxId = getNumberFromUrl(intentResult.contents)
                binding.resultTxt.text = boxId?.toString() ?: "Invalid URL"

                if (boxId != null) {
                    var apiUrl: String
                    var resJson: JSONObject
                    var response: String

                    lifecycleScope.launch {
                        if (!app.userInfo.getBoolean("admin", false)) {
                            apiUrl = "${app.backend}/packagers/byNumber/$boxId"
                            response = app.sendGetRequest(apiUrl)

                            try {
                                resJson = JSONObject(response)

                                if (resJson.has("message")) {
                                    binding.statusTxt.text = getString(R.string.responseErrorText)
                                    return@launch
                                }
                            } catch (e: JSONException) {
                                if (response == "") {
                                    binding.statusTxt.text = getString(R.string.unexpectedResponseText)
                                } else {
                                    binding.statusTxt.text = getString(R.string.parsingErrorText)
                                }
                                return@launch
                            }

                            if (!resJson["public"].toString().toBoolean()) {
                                val packagerSet = app.userInfo.getStringSet("packagers", emptySet())

                                if (packagerSet.isNullOrEmpty()) {
                                    binding.statusTxt.text = getString(R.string.emptyPackagerListText)
                                    return@launch
                                }

                                val packagerIds = packagerSet.map { packager ->
                                    val jsonObject = JSONObject(packager)
                                    jsonObject.optString("_id")
                                }

                                if (!packagerIds.contains(resJson["_id"].toString())) {
                                    binding.statusTxt.text = getString(R.string.notContainPackagerText, boxId.toString())
                                    return@launch
                                }
                            }
                        }

                        val format = app.settings.getInt("Format", 1) + 1
                        apiUrl = "https://api-d4me-stage.direct4.me/sandbox/v1/Access/openbox"
                        val jsonData = "{\"deliveryId\":0,\"boxId\":$boxId,\"tokenFormat\":${format},\"terminalSeed\":0,\"isMultibox\":false,\"addAccessLog\":false}"

                        response = app.sendPostRequest(apiUrl, jsonData)

                        try {
                            resJson = JSONObject(response)

                            if (resJson["errorNumber"] != 0) {
                                binding.statusTxt.text = getString(R.string.responseErrorText)
                            } else {
                                binding.statusTxt.text = getString(R.string.successText)
                                convertB64ToSound(resJson["data"].toString(), format)
                            }
                        } catch (e: JSONException) {
                            if (response == "") {
                                binding.statusTxt.text = getString(R.string.unexpectedResponseText)
                            } else {
                                binding.statusTxt.text = getString(R.string.parsingErrorText)
                            }
                        }
                    }
                } else {
                    binding.statusTxt.text = getString(R.string.parsingErrorText)
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
