package njt.paketnik

import android.app.Application
import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

class MyApp : Application() {
    lateinit var userInfo: SharedPreferences
    val backend = "http://192.168.0.14:3001"
    val format = 2

    override fun onCreate() {
        super.onCreate()
        userInfo = getSharedPreferences("userInfo", Context.MODE_PRIVATE)
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