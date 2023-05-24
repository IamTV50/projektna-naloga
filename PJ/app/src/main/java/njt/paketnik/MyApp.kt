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

    override fun onCreate() {
        super.onCreate()
        userInfo = getSharedPreferences("userInfo", Context.MODE_PRIVATE)
    }
}

internal suspend fun sendPostRequest(apiUrl: String, jsonBody: String): String {
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