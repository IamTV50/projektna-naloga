package njt.paketnik

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import njt.paketnik.databinding.ActivityLoginBinding
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
                // Tu vpiši IP računalnika, ki hosta backend
                val backendIP = "192.168.0.14"
                val apiUrl = "http://$backendIP:3001/users/login"
                val jsonData = "{\"username\":\"$uname\",\"password\":\"$pass\"}"

                lifecycleScope.launch{
                    val resJson: JSONObject
                    val response = app.sendPostRequest(apiUrl, jsonData)

                    try {
                        resJson = JSONObject(response)

                        if (resJson.has("error")){ //error
                            Toast.makeText(applicationContext, resJson["error"].toString(), Toast.LENGTH_SHORT).show()
                        }
                        else{
                            app.userInfo.edit().putString("userID", resJson["_id"].toString()).apply()
                            app.userInfo.edit().putString("username", resJson["username"].toString()).apply()
                            app.userInfo.edit().putString("email", resJson["email"].toString()).apply()
                            app.userInfo.edit().putString("admin", resJson["admin"].toString()).apply()
                            app.userInfo.edit().putString("packagers", resJson["packagers"].toString()).apply()

                            Toast.makeText(applicationContext, "login success", Toast.LENGTH_SHORT).show()

                            val intent = Intent(applicationContext, MainActivity::class.java)
                            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
                            startActivity(intent)
                        }
                    }
                    catch (e: JSONException){
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
