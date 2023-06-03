package njt.paketnik

import android.app.Activity
import android.media.AudioAttributes
import android.media.AudioManager
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Bitmap
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Base64
import android.media.MediaPlayer
import android.os.PersistableBundle
import android.provider.MediaStore
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.appcompat.widget.Toolbar
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatDelegate
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import com.google.android.material.navigation.NavigationView
import com.google.zxing.integration.android.IntentIntegrator
import com.google.zxing.integration.android.IntentResult
import njt.paketnik.databinding.ActivityMainBinding
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
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

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView
    private lateinit var toolbar: Toolbar
    private lateinit var toggle: ActionBarDrawerToggle

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        val view = binding.root
        app = application as MyApp
        setContentView(view)

        drawerLayout = binding.drawerLayout
        navView = binding.navView
        toolbar = binding.toolbar

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
            if (app.settings.getBoolean("Reload", true)) {
                if (app.userInfo.getBoolean("hasModel", false)) {
                    val takeConfirmFacePic =
                        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult? ->
                            if (result!!.resultCode == Activity.RESULT_OK) {
                                val imgBitmap: Bitmap? = result.data?.extras?.get("data") as? Bitmap

                                if (imgBitmap != null) {
                                    confirmFaceId(imgBitmap)
                                } else {
                                    Toast.makeText(
                                        applicationContext,
                                        "Failed to get picture",
                                        Toast.LENGTH_SHORT
                                    ).show()
                                }
                            } else {
                                Toast.makeText(applicationContext, "Canceled", Toast.LENGTH_SHORT)
                                    .show()
                            }
                        }

                    val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                    takeConfirmFacePic.launch(intent)
                } else {
                    lifecycleScope.launch {
                        app.getUserInfo()
                    }
                }
            } else {
                app.settings.edit().putBoolean("Reload", true).apply()
            }
        }

        binding.openScannerBtn.setOnClickListener {
            startQRScanner()
        }

        binding.openPackagersList.setOnClickListener {
            val intent = Intent(this, PackagersActivity::class.java)
            startActivity(intent)
        }

        binding.openUnlocksList.setOnClickListener {
            val intent = Intent(this, UnlocksActivity::class.java)
            startActivity(intent)
        }

        binding.openSettings.setOnClickListener {
            val intent = Intent(this, SettingsActivity::class.java)
            startActivity(intent)
        }

        // drawer
        setSupportActionBar(toolbar)

        val toggle = ActionBarDrawerToggle(
            this, drawerLayout, toolbar,
            R.string.navigation_drawer_open,
            R.string.navigation_drawer_close
        )

        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        navView.setNavigationItemSelectedListener { menuItem ->
            // Handle navigation view item clicks here.
            when (menuItem.itemId) {
                R.id.openScannerBtn -> {
                    startQRScanner()
                }

                R.id.openPackagersBtn -> {
                    val intent = Intent(this, PackagersActivity::class.java)
                    startActivity(intent)
                }

                R.id.openUnlocksBtn -> {
                    val intent = Intent(this, UnlocksActivity::class.java)
                    startActivity(intent)
                }

                R.id.openSettingsBtn -> {
                    val intent = Intent(this, SettingsActivity::class.java)
                    startActivity(intent)
                }

                R.id.logoutBtn -> {
                    app.unsetUser()
                }
            }

            drawerLayout.closeDrawers()
            true
        }
    }

    override fun onPostCreate(savedInstanceState: Bundle?, persistentState: PersistableBundle?) {
        super.onPostCreate(savedInstanceState, persistentState)
        toggle.syncState()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        toggle.onConfigurationChanged(newConfig)
    }

    private fun confirmFaceId(imgBitmap: Bitmap) {
        val apiUrl = "${app.backend}/users/faceId"
        val imgFile = bitmapToFile(imgBitmap)

        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("id", app.userInfo.getString("userID", "").toString())
            .addFormDataPart("image", "photo.jpg", imgFile.asRequestBody("image/jpeg".toMediaTypeOrNull()))
            .build()

        lifecycleScope.launch {
            val response = app.sendPostRequestMultipart(apiUrl, requestBody)

            try {
                val resJson = JSONObject(response)

                if (resJson.has("error")) {
                    if (resJson.has("message")) {
                        Toast.makeText(applicationContext, resJson["message"].toString(), Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(applicationContext, getString(R.string.responseErrorText), Toast.LENGTH_SHORT).show()
                    }

                    app.unsetUser()
                } else {
                    Toast.makeText(applicationContext, getString(R.string.successText), Toast.LENGTH_SHORT).show()
                    app.getUserInfo()
                }
            } catch (e: JSONException) {
                if (response == "") {
                    Toast.makeText(applicationContext, getString(R.string.unexpectedResponseText), Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(applicationContext, getString(R.string.parsingErrorText), Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun bitmapToFile(bitmap: Bitmap): File {
        val file = File(applicationContext.cacheDir, "photo.jpg")
        file.createNewFile()

        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()

        val fileOutputStream = FileOutputStream(file)
        fileOutputStream.write(byteArray)
        fileOutputStream.flush()
        fileOutputStream.close()

        return file
    }

    private val qrScannerActivityResultLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        val intentResult: IntentResult? = IntentIntegrator.parseActivityResult(result.resultCode, result.data)
        if (intentResult != null) {
            if (intentResult.contents.isNullOrEmpty()) {
                Toast.makeText(this, "Cancelled", Toast.LENGTH_LONG).show()
            } else {
                val boxNumber = getNumberFromUrl(intentResult.contents)
                binding.resultTxt.text = boxNumber?.toString() ?: "Invalid URL"

                if (boxNumber != null) {
                    var apiUrl: String
                    var resJson: JSONObject
                    var response: String

                    lifecycleScope.launch {
                        if (!app.userInfo.getBoolean("admin", false)) {
                            apiUrl = "${app.backend}/packagers/byNumber/$boxNumber"
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

                            if (!resJson["active"].toString().toBoolean()) {
                                binding.statusTxt.text = getString(R.string.packagerInactiveText, boxNumber.toString())
                                return@launch
                            }

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
                                binding.statusTxt.text = getString(R.string.notContainPackagerText, boxNumber.toString())
                                return@launch
                            }
                        }

                        val format = app.settings.getInt("Format", 1) + 1
                        apiUrl = "https://api-d4me-stage.direct4.me/sandbox/v1/Access/openbox"
                        val jsonData = "{\"deliveryId\":0,\"boxId\":$boxNumber,\"tokenFormat\":${format},\"terminalSeed\":0,\"isMultibox\":false,\"addAccessLog\":false}"

                        response = app.sendPostRequest(apiUrl, jsonData)

                        try {
                            resJson = JSONObject(response)

                            if (resJson["errorNumber"] != 0) {
                                binding.statusTxt.text = getString(R.string.responseErrorText)
                            } else {
                                binding.statusTxt.text = getString(R.string.successText)
                                convertB64ToSound(resJson["data"].toString(), format, boxNumber)
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

    private fun convertB64ToSound(base64String: String, format: Int, boxNumber: Int) {
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
                    playSoundFile(soundBytes, format, boxNumber)
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
                            playSoundFile(soundBytes, format, boxNumber)

                            break
                        }
                        zipEntry = zipInputStream.nextEntry
                    }
                    zipInputStream.close()
                }

                5, 6 -> {
                    playSoundFile(byteArray, format, boxNumber)
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

    private fun playSoundFile(soundBytes: ByteArray, format: Int, boxNumber: Int) {
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
            mediaPlayer?.setOnCompletionListener {
                showUnlockConfirmationDialog(boxNumber)
            }
            mediaPlayer?.start()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    private fun showUnlockConfirmationDialog(boxNumber: Int) {
        val dialog = AlertDialog.Builder(this)
            .setTitle("Unlock Confirmation")
            .setMessage("Was the unlock successful?")
            .setPositiveButton("Yes") { _, _ ->
                showSpinnerDialog(true, boxNumber)
            }
            .setNegativeButton("No") { _, _ ->
                showSpinnerDialog(false, boxNumber)
            }
            .setCancelable(false)
            .create()
        dialog.show()
    }

    private fun showSpinnerDialog(success: Boolean, boxNumber: Int) {
        val items = if (success) {
            resources.getStringArray(R.array.addUnlockTrue)
        } else {
            resources.getStringArray(R.array.addUnlockFalse)
        }

        val dialog = AlertDialog.Builder(this)
            .setTitle("Select Option")
            .setItems(items) { _, which ->
                val selectedOption = items[which]
                addUnlock(success, selectedOption, boxNumber)
            }
            .setCancelable(false)
            .create()
        dialog.show()
    }

    private fun addUnlock(success: Boolean, reason: String, boxNumber: Int) {
        var apiUrl: String
        var resJson: JSONObject
        var response: String
        var boxId: String

        lifecycleScope.launch {
            apiUrl = "${app.backend}/packagers/byNumber/$boxNumber"
            response = app.sendGetRequest(apiUrl)

            try {
                resJson = JSONObject(response)

                if (resJson.has("message")) {
                    binding.statusTxt.text = getString(R.string.responseErrorText)
                    return@launch
                } else {
                    boxId = resJson["_id"].toString()
                }
            } catch (e: JSONException) {
                if (response == "") {
                    binding.statusTxt.text = getString(R.string.unexpectedResponseText)
                } else {
                    binding.statusTxt.text = getString(R.string.parsingErrorText)
                }
                return@launch
            }

            apiUrl = "${app.backend}/unlocks"
            val jsonData = "{\"packager\":\"$boxId\",\"user\":\"${app.userInfo.getString("userID", "")}\",\"success\":$success,\"status\":\"$reason\"}"

            response = app.sendPostRequest(apiUrl, jsonData)

            try {
                resJson = JSONObject(response)

                if (resJson.has("error")) {
                    binding.statusTxt.text = getString(R.string.responseErrorText)
                } else {
                    binding.statusTxt.text = getString(R.string.successText)
                }
            } catch (e: JSONException) {
                if (response == "") {
                    binding.statusTxt.text = getString(R.string.unexpectedResponseText)
                } else {
                    binding.statusTxt.text = getString(R.string.parsingErrorText)
                }
            }
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
