package `in`.cashall.customer

import android.annotation.SuppressLint
import android.app.Activity
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.util.Log
import android.view.View
import android.webkit.CookieManager
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import `in`.cashall.customer.databinding.ActivityMainBinding
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "CashALLCustomer"
        private const val APP_URL = "https://cashall.in"
    }

    private lateinit var binding: ActivityMainBinding

    // File picker / camera callback
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private var cameraPhotoPath: String? = null

    private val filePickerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (fileChooserCallback == null) return@registerForActivityResult

        var results: Array<Uri>? = null
        if (result.resultCode == Activity.RESULT_OK) {
            val dataString = result.data?.dataString
            if (dataString != null) {
                results = arrayOf(Uri.parse(dataString))
            } else if (cameraPhotoPath != null) {
                val file = File(cameraPhotoPath!!)
                if (file.exists() && file.length() > 0) {
                    results = arrayOf(Uri.fromFile(file))
                }
            }
        }
        fileChooserCallback?.onReceiveValue(results)
        fileChooserCallback = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupBackNavigation()
        setupWebView()
        setupSwipeRefresh()
        setupOfflineHandling()

        loadCashAll()
    }

    /**
     * Prevents unnecessary Vercel requests or CPU usage when the customer app is minimized.
     */
    override fun onPause() {
        super.onPause()
        binding.webView.onPause()
        binding.webView.pauseTimers()
    }

    override fun onResume() {
        super.onResume()
        binding.webView.onResume()
        binding.webView.resumeTimers()
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (binding.webView.canGoBack()) {
                    binding.webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        binding.webView.apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                useWideViewPort = true
                loadWithOverviewMode = true
                setSupportZoom(true)
                builtInZoomControls = true
                displayZoomControls = false

                // Load cached assets first whenever possible to strictly protect Vercel edge limits
                cacheMode = WebSettings.LOAD_DEFAULT
                mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                userAgentString = "${settings.userAgentString} CashALL-Customer-Android/1.0"
            }

            // Native PDF Download Manager integration
            setDownloadListener { url, userAgent, contentDisposition, mimetype, _ ->
                try {
                    val request = DownloadManager.Request(Uri.parse(url)).apply {
                        setMimeType(mimetype)
                        addRequestHeader("cookie", CookieManager.getInstance().getCookie(url))
                        addRequestHeader("User-Agent", userAgent)
                        setDescription("Downloading CashALL document...")
                        setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype))
                        setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                        setDestinationInExternalPublicDir(
                            Environment.DIRECTORY_DOWNLOADS,
                            URLUtil.guessFileName(url, contentDisposition, mimetype)
                        )
                    }
                    val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                    dm.enqueue(request)
                    Toast.makeText(this@MainActivity, "Downloading document to Downloads folder...", Toast.LENGTH_SHORT).show()
                } catch (e: Exception) {
                    Log.e(TAG, "Download error: ${e.message}")
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    } catch (ignored: Exception) {}
                }
            }

            webViewClient = object : WebViewClient() {
                override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                    binding.progressBar.visibility = View.VISIBLE
                    binding.offlineCard.visibility = View.GONE
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    binding.progressBar.visibility = View.GONE
                    binding.swipeRefresh.isRefreshing = false
                }

                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                    if (request?.isForMainFrame == true) {
                        binding.progressBar.visibility = View.GONE
                        binding.swipeRefresh.isRefreshing = false
                        if (!isNetworkAvailable()) {
                            binding.offlineCard.visibility = View.VISIBLE
                        }
                    }
                }

                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    val url = request?.url?.toString() ?: return false

                    // 1. WhatsApp native chat
                    if (url.startsWith("whatsapp:") || url.contains("wa.me") || url.contains("api.whatsapp.com")) {
                        return try {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            }
                            startActivity(intent)
                            true
                        } catch (e: Exception) {
                            Toast.makeText(this@MainActivity, "WhatsApp not installed on this device", Toast.LENGTH_SHORT).show()
                            false
                        }
                    }

                    // 2. Phone Dialer
                    if (url.startsWith("tel:")) {
                        return try {
                            startActivity(Intent(Intent.ACTION_DIAL, Uri.parse(url)))
                            true
                        } catch (e: Exception) {
                            false
                        }
                    }

                    // 3. Email client
                    if (url.startsWith("mailto:")) {
                        return try {
                            startActivity(Intent(Intent.ACTION_SENDTO, Uri.parse(url)))
                            true
                        } catch (e: Exception) {
                            false
                        }
                    }

                    // 4. Intent scheme
                    if (url.startsWith("intent://")) {
                        return try {
                            val intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
                            if (intent != null) {
                                startActivity(intent)
                                true
                            } else false
                        } catch (e: Exception) {
                            false
                        }
                    }

                    // 5. Internal CashALL URLs stay within the WebView
                    if (url.contains("cashall.in") || url.contains("vercel.app") || url.startsWith("/")) {
                        return false
                    }

                    // 6. External URLs open in browser
                    return try {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        true
                    } catch (e: Exception) {
                        false
                    }
                }
            }

            webChromeClient = object : WebChromeClient() {
                override fun onProgressChanged(view: WebView?, newProgress: Int) {
                    if (newProgress < 100) {
                        binding.progressBar.visibility = View.VISIBLE
                        binding.progressBar.progress = newProgress
                    } else {
                        binding.progressBar.visibility = View.GONE
                    }
                }

                override fun onShowFileChooser(
                    webView: WebView?,
                    filePathCallback: ValueCallback<Array<Uri>>?,
                    fileChooserParams: FileChooserParams?
                ): Boolean {
                    fileChooserCallback?.onReceiveValue(null)
                    fileChooserCallback = filePathCallback

                    var takePictureIntent: Intent? = Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE)
                    if (takePictureIntent?.resolveActivity(packageManager) != null) {
                        var photoFile: File? = null
                        try {
                            photoFile = createImageFile()
                            takePictureIntent.putExtra("PhotoPath", cameraPhotoPath)
                        } catch (ex: IOException) {
                            Log.e(TAG, "Unable to create Image File", ex)
                        }

                        if (photoFile != null) {
                            cameraPhotoPath = photoFile.absolutePath
                            val photoURI: Uri = FileProvider.getUriForFile(
                                this@MainActivity,
                                "${applicationContext.packageName}.fileprovider",
                                photoFile
                            )
                            takePictureIntent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, photoURI)
                        } else {
                            takePictureIntent = null
                        }
                    }

                    val contentSelectionIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "*/*"
                    }

                    val intentArray: Array<Intent> = if (takePictureIntent != null) {
                        arrayOf(takePictureIntent)
                    } else {
                        emptyArray()
                    }

                    val chooserIntent = Intent(Intent.ACTION_CHOOSER).apply {
                        putExtra(Intent.EXTRA_INTENT, contentSelectionIntent)
                        putExtra(Intent.EXTRA_TITLE, "Upload Device Photo or Document")
                        putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray)
                    }

                    filePickerLauncher.launch(chooserIntent)
                    return true
                }
            }
        }
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val imageFileName = "JPEG_${timeStamp}_"
        val storageDir: File? = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile(imageFileName, ".jpg", storageDir)
    }

    private fun setupSwipeRefresh() {
        binding.swipeRefresh.setColorSchemeResources(R.color.brand_yellow)
        binding.swipeRefresh.setProgressBackgroundColorSchemeResource(R.color.brand_card_dark)
        binding.swipeRefresh.setOnRefreshListener {
            if (isNetworkAvailable()) {
                binding.webView.reload()
            } else {
                binding.swipeRefresh.isRefreshing = false
                binding.offlineCard.visibility = View.VISIBLE
            }
        }
    }

    private fun setupOfflineHandling() {
        binding.btnRetry.setOnClickListener {
            if (isNetworkAvailable()) {
                binding.offlineCard.visibility = View.GONE
                loadCashAll()
            } else {
                Toast.makeText(this, "Still offline. Please check your internet connection.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loadCashAll() {
        if (isNetworkAvailable()) {
            binding.offlineCard.visibility = View.GONE
            binding.webView.loadUrl(APP_URL)
        } else {
            binding.offlineCard.visibility = View.VISIBLE
        }
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
}
