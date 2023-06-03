package njt.paketnik

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout
import njt.paketnik.databinding.ActivityLoginBinding
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var app: MyApp

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        val view = binding.root
        app = application as MyApp
        setContentView(view)

        if (app.userInfo.getString("userID", "") != "") {
            val intent = Intent(applicationContext, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
        }

        binding.loginBtn.setOnClickListener{
            val uname = binding.loginNameInput.text.toString()
            val pass = binding.loginPasswdInput.text.toString()

            if (uname == "" || pass == "") {
                Toast.makeText(this, "Please fill in all the fields", Toast.LENGTH_SHORT).show()
            } else {
                // V MyApp vpiši IP računalnika, ki hosta backend
                val apiUrl = "${app.backend}/users/login"
                val jsonData = "{\"username\":\"$uname\",\"password\":\"$pass\"}"

                lifecycleScope.launch{
                    val resJson: JSONObject
                    val response = app.sendPostRequest(apiUrl, jsonData)

                    try {
                        withTimeout(3000) {
                            resJson = JSONObject(response)

                            if (resJson.has("error")) { //error
                                Toast.makeText(applicationContext, resJson["error"].toString(), Toast.LENGTH_SHORT).show()
                            } else {
                                app.userInfo.edit().putString("userID", resJson["_id"].toString()).apply()
                                app.userInfo.edit().putString("username", resJson["username"].toString()).apply()
                                app.userInfo.edit().putString("email", resJson["email"].toString()).apply()
                                app.userInfo.edit().putBoolean("admin", resJson["admin"].toString().toBoolean()).apply()
                                app.userInfo.edit().putBoolean("hasModel", resJson["hasModel"].toString().toBoolean()).apply()

                                val packagersArray: JSONArray = resJson.getJSONArray("packagers")

                                val packagersSet = mutableSetOf<String>()
                                for (i in 0 until packagersArray.length()) {
                                    packagersSet.add(packagersArray.getString(i))
                                }

                                app.userInfo.edit().putStringSet("packagers", packagersSet).apply()

                                app.settings.edit().putBoolean("Reload", false).apply()

                                Toast.makeText(applicationContext, "login success", Toast.LENGTH_SHORT).show()

                                val intent = Intent(applicationContext, MainActivity::class.java)
                                intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
                                startActivity(intent)
                            }
                        }
                    } catch (e: TimeoutCancellationException) {
                        // Handle timeout exception here
                        Toast.makeText(applicationContext, "Request timed out", Toast.LENGTH_SHORT).show()
                    } catch (e: JSONException) {
                        if (response == ""){
                            Toast.makeText(applicationContext, "unexpected response", Toast.LENGTH_SHORT).show()
                        }
                        else{
                            Toast.makeText(applicationContext, "pasring error", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            }
        }
    }
}
