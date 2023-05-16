package njt.paketnik

import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
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

class MainActivity : AppCompatActivity() {
    lateinit var binding: ActivityMainBinding

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        val view = binding.root
        setContentView(view)

        binding.showTxt.text = "test"

        binding.callAPIBtn.setOnClickListener {
            //binding.showTxt.text = "calll api click"

            //daj v .env
            val apiUrl = "https://api-d4me-stage.direct4.me/sandbox/v1/Access/openbox"
            val jsonData = "{\"deliveryId\":0,\"boxId\":541,\"tokenFormat\":0,\"terminalSeed\":0,\"isMultibox\":false,\"addAccessLog\":false}"

            lifecycleScope.launch {
                val resJson:JSONObject
                val response = sendPostRequest(apiUrl, jsonData)

                try {
                    resJson = JSONObject(response)

                    if (resJson["errorNumber"] != 0){
                        binding.showTxt.text = "napaka"
                    }
                    else{
                        binding.showTxt.text = resJson["data"].toString()
                        //todo - decode b64 to zip
                        //todo - unzip and play sound
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
                //return@withContext response.code.toString()
            } catch (e: IOException) {
                e.printStackTrace()
                return@withContext ""
            }
        }
    }
}