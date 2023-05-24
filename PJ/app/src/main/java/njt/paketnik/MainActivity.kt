package njt.paketnik

import android.media.AudioAttributes
import android.media.AudioManager
import android.content.Intent
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Base64
import android.media.MediaPlayer
import androidx.annotation.RequiresApi
import androidx.lifecycle.lifecycleScope
import njt.paketnik.databinding.ActivityMainBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.IOException
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

        if(app.userInfo.getString("userID", "") == ""){
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

        binding.showTxt.text = "test"

        binding.callAPIBtn.setOnClickListener {
            //binding.showTxt.text = "call api click"

            //daj v .env
            val format = 2
            val apiUrl = "https://api-d4me-stage.direct4.me/sandbox/v1/Access/openbox"
            val jsonData = "{\"deliveryId\":0,\"boxId\":541,\"tokenFormat\":$format,\"terminalSeed\":0,\"isMultibox\":false,\"addAccessLog\":false}"

            lifecycleScope.launch {
                val resJson:JSONObject
                val response = sendPostRequest(apiUrl, jsonData)

                try {
                    resJson = JSONObject(response)

                    if (resJson["errorNumber"] != 0){
                        binding.showTxt.text = "napaka"
                    }
                    else{
                        binding.showTxt.text = "uspeh"
                        convertB64ToSound(resJson["data"].toString(), format)
                    }
                }
                catch (e:JSONException){
                    if (response == ""){
                        binding.showTxt.text = "unexpected response"
                    }
                    else{
                        binding.showTxt.text = "pasring error"
                    }
                }
            }
        }

        binding.tmpOut.setOnClickListener{
            app.userInfo.edit().putString("userID", "").apply()
            app.userInfo.edit().putString("username", "").apply()
            app.userInfo.edit().putString("email", "").apply()
            app.userInfo.edit().putString("admin", "").apply()
            app.userInfo.edit().putString("packagers", "").apply()

            //show login page
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

        binding.navigateQrScanner.setOnClickListener {
            val intent = Intent(this, QrScannerActivity::class.java)
            startActivity(intent)
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
        File(cacheDir, "temp.wav").delete()
        File(cacheDir, "temp.mp3").delete()
        mediaPlayer?.release()
        mediaPlayer = null
    }

    override fun onDestroy() {
        super.onDestroy()
        releaseMediaPlayer()
    }
}
