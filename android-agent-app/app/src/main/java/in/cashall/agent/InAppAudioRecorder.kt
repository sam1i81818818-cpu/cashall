package `in`.cashall.agent

import android.content.Context
import java.io.File

/**
 * Disabled: CashALL Agent App does not record call audio.
 * Only call initiation and completion metadata (date & time) are tracked.
 */
object InAppAudioRecorder {
    fun startRecording(context: Context, customerPhone: String) {
        // No-op: Call audio recording disabled
    }

    fun stopRecording(context: Context): File? = null
}
