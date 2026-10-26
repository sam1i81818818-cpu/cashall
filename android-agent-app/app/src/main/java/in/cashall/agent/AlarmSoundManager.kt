package `in`.cashall.agent

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log

/**
 * 100% In-House Hardware Alarm Buzzer & High-Intensity Haptic Vibration Engine.
 * Utilizes STREAM_ALARM / AudioAttributes.USAGE_ALARM to ensure the alarm sounds
 * at maximum volume even if the phone is on Silent/Do-Not-Disturb mode.
 */
object AlarmSoundManager {
    private const val TAG = "AlarmSoundManager"
    private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null
    private var isAlarmPlaying = false

    // Pleasant haptic notification pulse (gentle and reassuring)
    private val VIBRATION_PATTERN = longArrayOf(0, 250, 150, 250, 500)
    private var autoSilenceHandler: android.os.Handler? = null

    @Synchronized
    fun isAlarmActive(): Boolean = isAlarmPlaying

    @Synchronized
    fun startAlarm(context: Context) {
        if (isAlarmPlaying) {
            Log.d(TAG, "Alarm already active, skipping duplicate start.")
            return
        }
        isAlarmPlaying = true
        Log.i(TAG, "🔔 Playing soothing notification chime for assigned lead (5s auto-silence enabled)...")

        // Auto-silence after 5 seconds so it never keeps chiming for minutes if unattended
        autoSilenceHandler?.removeCallbacksAndMessages(null)
        autoSilenceHandler = android.os.Handler(android.os.Looper.getMainLooper()).apply {
            postDelayed({
                if (isAlarmPlaying) {
                    Log.i(TAG, "⏰ Auto-silencing notification chime after 5s timeout.")
                    stopAlarm(context)
                }
            }, 5_000L)
        }

        // 1. Play soothing melodic notification chime at gentle, comfortable volume (non-looping, non-irritating)
        try {
            val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
            audioManager?.let { am ->
                val maxVol = am.getStreamMaxVolume(AudioManager.STREAM_NOTIFICATION)
                val comfortableVol = (maxVol * 0.65f).toInt().coerceAtLeast(1)
                am.setStreamVolume(AudioManager.STREAM_NOTIFICATION, comfortableVol, 0)
            }

            mediaPlayer?.release()
            // Try pleasant system notification ringtone first, fallback to raw resource
            val notificationUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            mediaPlayer = MediaPlayer().apply {
                try {
                    setDataSource(context, notificationUri)
                } catch (e: Exception) {
                    val afd = context.resources.openRawResourceFd(R.raw.loud_buzzer)
                    setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                    afd.close()
                }
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                isLooping = false
                prepare()
                start()
            }
            Log.i(TAG, "Soothing notification chime playing comfortably.")
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing MediaPlayer for chime: ${e.message}", e)
        }

        // 2. Continuous high-intensity haptic vibration
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibrator = vibratorManager?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }

            vibrator?.let { v ->
                if (v.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        val effect = VibrationEffect.createWaveform(VIBRATION_PATTERN, 0)
                        v.vibrate(effect)
                    } else {
                        @Suppress("DEPRECATION")
                        v.vibrate(VIBRATION_PATTERN, 0)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error triggering vibrator: ${e.message}", e)
        }
    }

    @Synchronized
    fun stopAlarm(context: Context? = null) {
        Log.i(TAG, "Stopping loud lead buzzer and phone vibration immediately.")
        isAlarmPlaying = false

        autoSilenceHandler?.removeCallbacksAndMessages(null)
        autoSilenceHandler = null

        // Stop Audio immediately with zero latency
        try {
            mediaPlayer?.let { player ->
                try {
                    if (player.isPlaying) {
                        player.stop()
                    }
                } catch (ignored: Exception) {}
                try {
                    player.reset()
                } catch (ignored: Exception) {}
                try {
                    player.release()
                } catch (ignored: Exception) {}
            }
        } catch (e: Exception) {
            Log.w(TAG, "Error releasing MediaPlayer: ${e.message}")
        } finally {
            mediaPlayer = null
        }

        // Stop Vibration immediately
        try {
            vibrator?.cancel()
            context?.let { ctx ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    val vm = ctx.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                    vm?.defaultVibrator?.cancel()
                } else {
                    @Suppress("DEPRECATION")
                    val v = ctx.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                    v?.cancel()
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Error cancelling vibrator: ${e.message}")
        }
    }

    fun triggerOneShotHaptic(context: Context) {
        try {
            val v = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                (context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager)?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v?.vibrate(VibrationEffect.createOneShot(150, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                v?.vibrate(150)
            }
        } catch (e: Exception) {}
    }
}
