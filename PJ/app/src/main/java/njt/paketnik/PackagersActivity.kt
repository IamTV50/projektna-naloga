package njt.paketnik

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.ListView

class PackagersActivity : AppCompatActivity() {
    private lateinit var listView: ListView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_packagers)

        listView = findViewById(R.id.userlist)

        var userInfo = getSharedPreferences("userInfo", Context.MODE_PRIVATE)

        val apiUrl = "http://164.8.113.38:3001/unlocks/userUnlocks/${userInfo.getString("userID", "")}"

        fetchPackagres()
//        // use arrayadapter and define an array
//        val arrayAdapter: ArrayAdapter<*>
//        val users = arrayOf(
//            "Virat Kohli", "Rohit Sharma", "Steve Smith",
//            "Kane Williamson", "Ross Taylor"
//        )
//
//        // access the listView from xml file
//        var mListView = findViewById<ListView>(R.id.userlist)
//        arrayAdapter = ArrayAdapter(this,
//            android.R.layout.simple_list_item_1, users)
//        mListView.adapter = arrayAdapter
    }

    private fun fetchPackagres() {
        // Use your preferred networking library to make the API request and retrieve the data
        // For simplicity, let's assume it returns a list of Item objects

        val items = listOf(
            "Item 1",
            "Item 2",
            "Item 3"
        )

        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, items)
        listView.adapter = adapter
    }

    private fun displayPackagers() {

    }
}