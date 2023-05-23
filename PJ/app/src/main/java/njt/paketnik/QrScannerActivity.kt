package njt.paketnik

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.google.zxing.integration.android.IntentIntegrator
import com.google.zxing.integration.android.IntentResult
import njt.paketnik.databinding.ActivityQrScannerBinding
import android.content.Intent
import android.widget.Toast


class QrScannerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityQrScannerBinding

    private fun startQRScanner() {
        val integrator = IntentIntegrator(this@QrScannerActivity)
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE)
        integrator.setPrompt("Scan a QR Code")
        integrator.setCameraId(0) // Use the rear camera by default
        integrator.setBeepEnabled(false) // Disable beep sound
        integrator.setOrientationLocked(false) // Allow rotation
        integrator.initiateScan()
    }

    // Override onActivityResult to handle the scan result
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val result: IntentResult? =
            IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (result != null) {
            if (result.contents == null) {
                Toast.makeText(this, "Cancelled", Toast.LENGTH_LONG).show()
            } else {
                binding.result.text = result.contents
                binding.resultFormat.text = result.formatName
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQrScannerBinding.inflate(layoutInflater)

        val view = binding.root
        setContentView(view)

        binding.openScanner.setOnClickListener {
            startQRScanner()
        }

    }
}