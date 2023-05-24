package njt.paketnik

import android.app.Application
import android.content.Context
import android.content.SharedPreferences

class MyApp : Application() {
    lateinit var userInfo: SharedPreferences

    override fun onCreate() {
        super.onCreate()
        userInfo = getSharedPreferences("userInfo", Context.MODE_PRIVATE)
    }
}