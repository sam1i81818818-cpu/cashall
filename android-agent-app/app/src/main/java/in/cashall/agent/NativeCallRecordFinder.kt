package `in`.cashall.agent

import android.content.Context
import java.io.File

/**
 * Disabled: CashALL Agent App does not search or upload native call recordings.
 * Only call initiation and completion metadata (date & time) are tracked.
 */
object NativeCallRecordFinder {
    suspend fun findRecentRecording(
        context: Context,
        rawCustomerPhone: String,
        customerName: String,
        callStartTime: Long,
        callEndTime: Long
    ): File? = null
}
