package njt.paketnik

import android.app.Activity
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Bitmap
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.PersistableBundle
import android.provider.MediaStore
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatDelegate
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import com.google.android.material.navigation.NavigationView
import kotlinx.coroutines.launch
import njt.paketnik.databinding.ActivitySettingsBinding
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONException
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream

class SettingsActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySettingsBinding
    lateinit var app: MyApp

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView
    private lateinit var toolbar: Toolbar
    private lateinit var toggle: ActionBarDrawerToggle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        val view = binding.root
        app = application as MyApp
        setContentView(view)

        drawerLayout = binding.drawerLayout
        navView = binding.navView
        toolbar = binding.toolbar

        if (app.settings.contains("Theme")) {
            binding.spinnerTheme.setSelection(app.settings.getInt("Theme", 0))
        }

        if (app.settings.contains("Format")) {
            binding.spinnerFormat.setSelection(app.settings.getInt("Format", 1))
        }

        binding.buttonConfirm.setOnClickListener {
            val selectedThemePosition = binding.spinnerTheme.selectedItemPosition

            when (selectedThemePosition) {
                0 -> {
                    AppCompatDelegate.setDefaultNightMode(MODE_NIGHT_FOLLOW_SYSTEM)
                }
                1 -> {
                    AppCompatDelegate.setDefaultNightMode(MODE_NIGHT_NO)
                }
                2 -> {
                    AppCompatDelegate.setDefaultNightMode(MODE_NIGHT_YES)
                }
            }

            app.settings.edit().putInt("Theme", selectedThemePosition).apply()
            app.settings.edit().putInt("Format", binding.spinnerFormat.selectedItemPosition).apply()
            app.settings.edit().putBoolean("Reload", false).apply()
        }

        val takeRegisterFaceVideo = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {result: ActivityResult? ->
            if (result!!.resultCode == Activity.RESULT_OK) {
                val videoUri: Uri? = result.data?.data

                if (videoUri != null) {
                    registerFaceId(videoUri)
                } else {
                    Toast.makeText(applicationContext, "Failed to get video", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(applicationContext, "Canceled", Toast.LENGTH_SHORT).show()
            }
        }

        binding.buttonRegisterFaceId.setOnClickListener {
            val intent = Intent(MediaStore.ACTION_VIDEO_CAPTURE)
            takeRegisterFaceVideo.launch(intent)
        }

        val takeConfirmFacePic = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult? ->
            if (result!!.resultCode == Activity.RESULT_OK) {
                val imgBitmap: Bitmap? = result.data?.extras?.get("data") as? Bitmap

                if (imgBitmap != null) {
                    confirmFaceId(imgBitmap)
                } else {
                    Toast.makeText(applicationContext, "Failed to get picture", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(applicationContext, "Canceled", Toast.LENGTH_SHORT).show()
            }
        }

        binding.buttonConfirmFaceId.setOnClickListener {
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            takeConfirmFacePic.launch(intent)
        }

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
                    finish()
                }

                R.id.openPackagersBtn -> {
                    val intent = Intent(this, PackagersActivity::class.java)
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    startActivity(intent)
                }

                R.id.openUnlocksBtn -> {
                    val intent = Intent(this, UnlocksActivity::class.java)
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
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

    private fun registerFaceId(videoUri: Uri) {
        val apiUrl = "${app.backend}/users/registerFace"

        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("id", app.userInfo.getString("userID", "").toString())
            .addFormDataPart("video", "video.mp4", createVideoRequestBody(videoUri))
            .build()

        lifecycleScope.launch {
            val response = app.sendPostRequestMultipart(apiUrl, requestBody)

            try {
                val resJson = JSONObject(response)

                if (resJson.has("error")) {
                    Toast.makeText(applicationContext, getString(R.string.responseErrorText), Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(applicationContext, getString(R.string.successText), Toast.LENGTH_SHORT).show()
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

    private fun createVideoRequestBody(videoUri: Uri): RequestBody {
        val videoFile = File(getVideoPathFromUri(videoUri).toString())
        val requestBody = videoFile.asRequestBody("video/mp4".toMediaTypeOrNull())
        videoFile.delete()
        return requestBody
    }

    private fun getVideoPathFromUri(uri: Uri): String? {
        val projection = arrayOf(MediaStore.Video.Media.DATA)
        val cursor = contentResolver.query(uri, projection, null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val columnIndex = it.getColumnIndexOrThrow(MediaStore.Video.Media.DATA)
                return it.getString(columnIndex)
            }
        }
        return null
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
}