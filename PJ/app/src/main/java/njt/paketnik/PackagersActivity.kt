package njt.paketnik

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPackagersBinding.inflate(layoutInflater)
        val view = binding.root
        app = application as MyApp
        setContentView(view)

        fetchPackagres()
    }

    private fun fetchPackagres() {
        val packagerSet = app.userInfo.getStringSet("packagers", emptySet())
        val packagerNumbers = packagerSet?.map { packager ->
            JSONObject(packager).getString("number")
        }?.toMutableList() ?: mutableListOf()

        binding.packagerList.adapter = ArrayAdapter(this@PackagersActivity, android.R.layout.simple_list_item_1, packagerNumbers)
    }
}