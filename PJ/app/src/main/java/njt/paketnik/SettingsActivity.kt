package njt.paketnik

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import androidx.appcompat.app.AppCompatDelegate
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO
import androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES
import njt.paketnik.databinding.ActivityMainBinding
import njt.paketnik.databinding.ActivitySettingsBinding

class SettingsActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySettingsBinding
    lateinit var app: MyApp

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        val view = binding.root
        app = application as MyApp
        setContentView(view)

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
    }
}