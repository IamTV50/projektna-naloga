package njt.paketnik

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.view.WindowManager
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatDelegate
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONException
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream

class RedirectActivity : AppCompatActivity() {

    private lateinit var app: MyApp
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_redirect)
        progressBar = findViewById(R.id.progressBar)
        progressBar.visibility = View.VISIBLE

        app = application as MyApp

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
//            if (app.settings.getBoolean("Reload", true)) {
                if (app.userInfo.getBoolean("hasModel", false)) {
                    Toast.makeText(this, "Has model", Toast.LENGTH_SHORT).show()
                    val takeConfirmFacePic =
                        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult? ->
                            if (result!!.resultCode == Activity.RESULT_OK) {
                                val imgBitmap: Bitmap? = result.data?.extras?.get("data") as? Bitmap

                                if (imgBitmap != null) {
                                    window.setFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE, WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE)

                                    lifecycleScope.launch {
                                        confirmFaceId(imgBitmap)
                                    }
                                } else {
                                    Toast.makeText(applicationContext, "Failed to get picture", Toast.LENGTH_SHORT).show()
                                    window.clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE)
                                    app.unsetUser()
                                }
                            } else {
                                Toast.makeText(applicationContext, "Canceled", Toast.LENGTH_SHORT).show()
                                window.clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE)
                                app.unsetUser()
                            }
                        }

                    val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                    takeConfirmFacePic.launch(intent)
                } else {
                    lifecycleScope.launch {
                        app.getUserInfo()
                    }
                    val intent = Intent(this, MainActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
                    startActivity(intent)
                }
            }
//        else {
//                app.settings.edit().putBoolean("Reload", true).apply()
//            }

    }

    private suspend fun confirmFaceId(imgBitmap: Bitmap) {
        val apiUrl = "${app.backend}/users/faceId"
        val imgFile = bitmapToFile(imgBitmap)

        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("id", app.userInfo.getString("userID", "").toString())
            .addFormDataPart("image", "photo.jpg", imgFile.asRequestBody("image/jpeg".toMediaTypeOrNull()))
            .build()

        val response = app.sendPostRequestMultipart(apiUrl, requestBody)

        try {
            val resJson = JSONObject(response)

            if (resJson.has("error")) {
                if (resJson.has("message")) {
                    Toast.makeText(applicationContext, resJson["message"].toString(), Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(applicationContext, getString(R.string.responseErrorText), Toast.LENGTH_SHORT).show()
                }

                window.clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE)
                app.unsetUser()
            } else {
                Toast.makeText(applicationContext, getString(R.string.successText), Toast.LENGTH_SHORT).show()
                window.clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE)
                app.getUserInfo()
                val intent = Intent(this, MainActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
                startActivity(intent)
            }
        } catch (e: JSONException) {
            if (response == "") {
                Toast.makeText(applicationContext, getString(R.string.unexpectedResponseText), Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(applicationContext, getString(R.string.parsingErrorText), Toast.LENGTH_SHORT).show()
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