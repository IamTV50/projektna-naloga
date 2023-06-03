package njt.paketnik

import android.app.Application
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.widget.Toast
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class MyApp : Application() {
    lateinit var userInfo: SharedPreferences
    lateinit var settings: SharedPreferences
    val backend = "http://192.168.0.14:3001"

    override fun onCreate() {
        super.onCreate()
        userInfo = getSharedPreferences("userInfo", Context.MODE_PRIVATE)
        settings = getSharedPreferences("settings", Context.MODE_PRIVATE)
    }

    fun unsetUser() {
        userInfo.edit().putString("userID", "").apply()
        userInfo.edit().putString("username", "").apply()
        userInfo.edit().putString("email", "").apply()
        userInfo.edit().putBoolean("admin", false).apply()
        userInfo.edit().putBoolean("hasModel", false).apply()
        userInfo.edit().putStringSet("packagers", emptySet()).apply()
        userInfo.edit().putBoolean("faceIsRegistered", false).apply()
        userInfo.edit().putBoolean("confirmedFaceID", false).apply()
        val intent = Intent(applicationContext, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(intent)
    }

    suspend fun getUserInfo() {
        val apiUrl = "$backend/users/${userInfo.getString("userID", "")}"
        val response = sendGetRequest(apiUrl)

        try {
            val resJson = JSONObject(response)

            if (resJson.has("error")) {
                Toast.makeText(applicationContext, resJson["error"].toString(), Toast.LENGTH_SHORT).show()
            } else if (resJson.has("message")) {
                Toast.makeText(applicationContext, resJson["message"].toString(), Toast.LENGTH_SHORT).show()
                unsetUser()
            } else {
                userInfo.edit().putString("username", resJson["username"].toString()).apply()
                userInfo.edit().putString("email", resJson["email"].toString()).apply()
                userInfo.edit().putBoolean("admin", resJson["admin"].toString().toBoolean()).apply()
                userInfo.edit().putBoolean("hasModel", resJson["hasModel"].toString().toBoolean()).apply()

                val packagersArray: JSONArray = resJson.getJSONArray("packagers")

                val packagersSet = mutableSetOf<String>()
                for (i in 0 until packagersArray.length()) {
                    packagersSet.add(packagersArray.getString(i))
                }

                userInfo.edit().putStringSet("packagers", packagersSet).apply()

                Toast.makeText(applicationContext, "got user info", Toast.LENGTH_SHORT).show()
            }
        } catch (e: JSONException) {
            if (response == "") {
                Toast.makeText(applicationContext, "unexpected response", Toast.LENGTH_SHORT)
                    .show()
            } else {
                Toast.makeText(applicationContext, "pasring error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    suspend fun sendPostRequest(apiUrl: String, jsonBody: String): String {
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
            } catch (e: IOException) {
                e.printStackTrace()
                return@withContext ""
            }
        }
    }

    suspend fun sendPostRequestMultipart(apiUrl: String, requestBody: MultipartBody): String {
        val request = Request.Builder()
            .url(apiUrl)
            .post(requestBody)
            .build()
        val client = OkHttpClient()
        return withContext(Dispatchers.IO) {
            try {
                val response = client.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""
                response.close()
                return@withContext responseBody
            } catch (e: IOException) {
                e.printStackTrace()
                return@withContext ""
            }
        }
    }

    suspend fun sendGetRequest(apiUrl: String): String {
        val request = Request.Builder()
            .url(apiUrl)
            .get()
            .build()
        val client = OkHttpClient()
        return withContext(Dispatchers.IO) {
            try {
                val response = client.newCall(request).execute()
                return@withContext response.body?.string() ?: ""
            } catch (e: IOException) {
                e.printStackTrace()
                return@withContext ""
            }
        }
    }
}