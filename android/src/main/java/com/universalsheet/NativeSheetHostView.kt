package com.universalsheet

import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import kotlin.math.abs

/**
 * Hosts React children inside a Material BottomSheetDialog. While presented the view is
 * detached from its React parent; it is re-attached on dismissal.
 *
 * Each dialog is its own window, so stacked surfaces nest naturally and the parent
 * Activity and its React tree are untouched.
 *
 * Stored but not yet rendered on Android: placement, margin, anchor*, width, shadow*,
 * handleColor. These are part of the shared prop contract and are pending native presenters.
 */
class NativeSheetHostView(private val reactContext: ThemedReactContext) : FrameLayout(reactContext) {
    // Identity and state
    var sheetId: String = ""
    var shouldShow: Boolean = false
    var snapFractions: List<Double> = emptyList()
    var snapIndex: Int = 0

    // Interaction
    var enableDrag: Boolean = true
    var enableBackdrop: Boolean = true
    var enableKeyboard: Boolean = true
    var enableNestedScroll: Boolean = true

    // Placement
    var placement: String = "bottom"
    var margin: Double = 0.0
    var anchorX: Double = 0.0
    var anchorY: Double = 0.0
    var anchorWidth: Double = 0.0
    var anchorHeight: Double = 0.0

    // Design
    var sheetBackgroundColor: String? = null
    var cornerRadius: Double = 16.0
    var borderWidth: Double = 0.0
    var borderColor: String? = null
    var shadowRadius: Double = 0.0
    var shadowOpacity: Double = 0.0
    var width: Double = 0.0
    var backdropOpacity: Double = 0.4
    var backdropColor: String? = null
    var showHandle: Boolean = true
    var handleColor: String? = null

    private var dialog: BottomSheetDialog? = null
    private var presented = false
    private var originalParent: ViewGroup? = null
    private var originalIndex: Int = -1
    private var applyScheduled = false

    /** Coalesces prop updates, which arrive one at a time, into a single apply. */
    fun scheduleApply() {
        if (applyScheduled) return
        applyScheduled = true
        post {
            applyScheduled = false
            applyState()
        }
    }

    private fun applyState() {
        if (shouldShow) {
            present()
        } else {
            dialog?.dismiss()
        }
        dialog?.let { applyBehavior(it) }
        applyDesign()
    }

    private fun present() {
        if (presented) return

        val parentView = parent as? ViewGroup
        originalParent = parentView
        originalIndex = parentView?.indexOfChild(this) ?: -1
        parentView?.removeView(this)

        val sheet = BottomSheetDialog(reactContext)
        val wrapsContent = snapFractions.any { it < 0 }
        sheet.setContentView(
            this,
            ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                if (wrapsContent) ViewGroup.LayoutParams.WRAP_CONTENT else ViewGroup.LayoutParams.MATCH_PARENT,
            ),
        )
        sheet.setCancelable(enableDrag)
        sheet.setCanceledOnTouchOutside(enableDrag && enableBackdrop)
        sheet.behavior.addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
            override fun onStateChanged(bottomSheet: View, newState: Int) {
                handleStateChanged(sheet, newState)
            }

            override fun onSlide(bottomSheet: View, slideOffset: Float) {}
        })
        sheet.setOnShowListener { emit("topPresent") }
        sheet.setOnDismissListener { onDialogDismissed() }

        dialog = sheet
        presented = true
        sheet.show()
    }

    private fun applyBehavior(sheet: BottomSheetDialog) {
        val behavior = sheet.behavior
        val target = snapFractions.getOrNull(snapIndex) ?: 1.0
        behavior.isDraggable = enableDrag
        behavior.isHideable = enableDrag
        behavior.skipCollapsed = true
        behavior.isFitToContents = snapFractions.any { it < 0 }
        // The half-expanded state represents the requested mid-height detent.
        behavior.halfExpandedRatio = if (target in 0.1..0.9) target else 0.5
        val expanded = target < 0 || target >= 0.9
        behavior.state = if (expanded) BottomSheetBehavior.STATE_EXPANDED else BottomSheetBehavior.STATE_HALF_EXPANDED
        sheet.window?.setDimAmount(if (enableBackdrop) backdropOpacity.toFloat().coerceIn(0f, 1f) else 0f)
    }

    /** Applies the surface fill, border and corner radius to the content view. */
    private fun applyDesign() {
        val fill = sheetBackgroundColor?.let { parseColor(it) } ?: Color.WHITE
        val drawable = GradientDrawable().apply {
            setColor(fill)
            cornerRadius = this@NativeSheetHostView.cornerRadius.toFloat()
            val stroke = borderColor?.let { parseColor(it) }
            if (stroke != null && borderWidth > 0) {
                setStroke(borderWidth.toInt(), stroke)
            }
        }
        background = drawable
    }

    private fun handleStateChanged(sheet: BottomSheetDialog, newState: Int) {
        if (snapFractions.isEmpty()) return
        val index = when (newState) {
            BottomSheetBehavior.STATE_EXPANDED ->
                snapFractions.indexOfLast { it < 0 || it >= 0.9 }.takeIf { it >= 0 } ?: snapFractions.lastIndex
            BottomSheetBehavior.STATE_HALF_EXPANDED -> {
                val ratio = sheet.behavior.halfExpandedRatio
                snapFractions.indexOfFirst { abs(it - ratio) < 0.01 }
            }
            else -> return
        }
        if (index >= 0 && index != snapIndex) {
            snapIndex = index
            emit("topSnapChange", index)
        }
    }

    private fun onDialogDismissed() {
        if (!presented) return
        presented = false
        dialog = null
        (parent as? ViewGroup)?.removeView(this)

        val parentView = originalParent
        if (parentView != null) {
            if (originalIndex >= 0) {
                parentView.addView(this, minOf(originalIndex, parentView.childCount))
            } else {
                parentView.addView(this)
            }
        }
        emit("topDismiss")
    }

    /** Dismisses without emitting events. Called when React drops the view. */
    fun teardown() {
        val sheet = dialog
        dialog = null
        presented = false
        sheet?.setOnDismissListener(null)
        sheet?.dismiss()
        (parent as? ViewGroup)?.removeView(this)
    }

    private fun parseColor(hex: String): Int? =
        try {
            Color.parseColor(hex)
        } catch (e: IllegalArgumentException) {
            null
        }

    private fun emit(eventName: String, index: Int? = null) {
        val surfaceId = UIManagerHelper.getSurfaceId(this)
        UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
            ?.dispatchEvent(NativeSheetEvent(surfaceId, id, eventName, index))
    }
}
