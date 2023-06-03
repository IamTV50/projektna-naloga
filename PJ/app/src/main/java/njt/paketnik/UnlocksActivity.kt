package njt.paketnik

import android.R
import android.content.Intent
import android.content.res.Configuration
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.PersistableBundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import com.google.android.material.navigation.NavigationView
import kotlinx.coroutines.launch
import njt.paketnik.databinding.ActivityPackagersBinding
import njt.paketnik.databinding.ActivityUnlocksBinding
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import org.json.JSONTokener

class UnlocksActivity : AppCompatActivity() {
    private lateinit var binding: ActivityUnlocksBinding
    lateinit var app: MyApp

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView
    private lateinit var toolbar: Toolbar
    private lateinit var toggle: ActionBarDrawerToggle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityUnlocksBinding.inflate(layoutInflater)
        val view = binding.root
        app = application as MyApp
        setContentView(view)

        drawerLayout = binding.drawerLayout
        navView = binding.navView
        toolbar = binding.toolbar

        fetchUnlocks()

        // drawer
        setSupportActionBar(toolbar)

        val toggle = ActionBarDrawerToggle(
            this, drawerLayout, toolbar,
            njt.paketnik.R.string.navigation_drawer_open,
            njt.paketnik.R.string.navigation_drawer_close
        )

        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        navView.setNavigationItemSelectedListener { menuItem ->
            // Handle navigation view item clicks here.
            when (menuItem.itemId) {
                njt.paketnik.R.id.openScannerBtn -> {
                    finish()
                }

                njt.paketnik.R.id.openPackagersBtn -> {
                    val intent = Intent(this, PackagersActivity::class.java)
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    startActivity(intent)
                }

                njt.paketnik.R.id.openSettingsBtn -> {
                    val intent = Intent(this, SettingsActivity::class.java)
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    startActivity(intent)
                }

                njt.paketnik.R.id.logoutBtn -> {
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

    private fun fetchUnlocks() {
        val apiUrl = "${app.backend}/unlocks/userUnlocks/${app.userInfo.getString("userID", "")}"

        lifecycleScope.launch{
            val response = app.sendGetRequest(apiUrl)

            try {
                val resJson = JSONTokener(response).nextValue()

                if (resJson is JSONObject) {
                    if (resJson.has("error")) { //error
                        Toast.makeText(applicationContext, resJson["error"].toString(), Toast.LENGTH_SHORT).show()
                    }
                } else if (resJson is JSONArray) {
                    val unlocksList = mutableListOf<Unlock>()

                    for (i in 0 until resJson.length()) {
                        val unlockObject = resJson.optJSONObject(i)
                        val unlockId = unlockObject?.getString("_id")
                        unlockId?.let {
                            val number = unlockObject.optJSONObject("packager")?.getInt("number") ?: 0
                            val date = unlockObject.getString("openedOn") ?: ""
                            val success = unlockObject.getBoolean("success")
                            val reason = unlockObject.getString("status") ?: ""
                            unlocksList.add(Unlock(number, date, success, reason))
                        }
                    }

                    binding.unlocksList.adapter = UnlocksAdapter(this@UnlocksActivity, unlocksList)
                } else {
                    Toast.makeText(applicationContext, "Unexpected response type", Toast.LENGTH_SHORT).show()
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

    inner class Unlock(val number: Int, val date: String, val success: Boolean, val reason: String)
}