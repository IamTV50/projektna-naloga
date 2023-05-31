package njt.paketnik

import android.content.Intent
import android.content.res.Configuration
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.PersistableBundle
import android.view.View
import android.widget.AdapterView
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatDelegate
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import njt.paketnik.databinding.ActivityMainBinding
import njt.paketnik.databinding.ActivitySettingsBinding

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
        }

        binding.buttonExitSettings.setOnClickListener {
            finish()
        }

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
}