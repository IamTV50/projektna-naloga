package njt.paketnik

import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.PersistableBundle
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import com.google.android.material.navigation.NavigationView
import kotlinx.coroutines.launch
import njt.paketnik.databinding.ActivityPackagersBinding
import njt.paketnik.databinding.ActivitySettingsBinding
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import org.json.JSONTokener

class PackagersActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPackagersBinding
    lateinit var app: MyApp

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView
    private lateinit var toolbar: Toolbar
    private lateinit var toggle: ActionBarDrawerToggle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPackagersBinding.inflate(layoutInflater)
        val view = binding.root
        app = application as MyApp
        setContentView(view)

        drawerLayout = binding.drawerLayout
        navView = binding.navView
        toolbar = binding.toolbar

        fetchPackagres()

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
                    val intent = Intent(this, MainActivity::class.java)
                    startActivity(intent)
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

    private fun fetchPackagres() {
        val packagerSet = app.userInfo.getStringSet("packagers", emptySet())
        val packagerNumbers = packagerSet?.map { packager ->
            JSONObject(packager).getString("number")
        }?.toMutableList() ?: mutableListOf()

        binding.packagerList.adapter = PackagersAdapter(this@PackagersActivity, packagerNumbers)
    }
}