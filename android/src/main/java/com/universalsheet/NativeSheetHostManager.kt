package com.universalsheet

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativeSheetHostManagerDelegate
import com.facebook.react.viewmanagers.NativeSheetHostManagerInterface

/**
 * Serves both architectures. Legacy uses the @ReactProp setters. Fabric routes the same
 * setters through the codegen-generated delegate.
 */
class NativeSheetHostManager(
    @Suppress("unused") private val reactContext: ReactApplicationContext,
) : SimpleViewManager<NativeSheetHostView>(), NativeSheetHostManagerInterface<NativeSheetHostView> {

    private val delegate = NativeSheetHostManagerDelegate(this)

    override fun getName(): String = "NativeSheetHost"

    override fun getDelegate(): ViewManagerDelegate<NativeSheetHostView>? = delegate

    override fun createViewInstance(context: ThemedReactContext): NativeSheetHostView =
        NativeSheetHostView(context)

    override fun onDropViewInstance(view: NativeSheetHostView) {
        view.teardown()
        super.onDropViewInstance(view)
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> = mapOf(
        "topPresent" to mapOf("registrationName" to "onPresent"),
        "topDismiss" to mapOf("registrationName" to "onDismiss"),
        "topSnapChange" to mapOf("registrationName" to "onSnapChange"),
    )

    // ---- Identity and state -------------------------------------------------

    @ReactProp(name = "sheetId")
    override fun setSheetId(view: NativeSheetHostView, value: String?) {
        view.sheetId = value.orEmpty()
    }

    @ReactProp(name = "visible")
    override fun setVisible(view: NativeSheetHostView, value: Boolean) {
        view.shouldShow = value
        view.scheduleApply()
    }

    @ReactProp(name = "snapPoints")
    override fun setSnapPoints(view: NativeSheetHostView, value: ReadableArray?) {
        val fractions = ArrayList<Double>()
        if (value != null) {
            for (i in 0 until value.size()) {
                fractions.add(value.getDouble(i))
            }
        }
        view.snapFractions = fractions
        view.scheduleApply()
    }

    @ReactProp(name = "snapIndex")
    override fun setSnapIndex(view: NativeSheetHostView, value: Int) {
        view.snapIndex = value
        view.scheduleApply()
    }

    // ---- Interaction ----------------------------------------------------------

    @ReactProp(name = "enableDrag")
    override fun setEnableDrag(view: NativeSheetHostView, value: Boolean) {
        view.enableDrag = value
        view.scheduleApply()
    }

    @ReactProp(name = "enableBackdrop")
    override fun setEnableBackdrop(view: NativeSheetHostView, value: Boolean) {
        view.enableBackdrop = value
        view.scheduleApply()
    }

    @ReactProp(name = "enableKeyboard")
    override fun setEnableKeyboard(view: NativeSheetHostView, value: Boolean) {
        view.enableKeyboard = value
        view.scheduleApply()
    }

    @ReactProp(name = "enableNestedScroll")
    override fun setEnableNestedScroll(view: NativeSheetHostView, value: Boolean) {
        view.enableNestedScroll = value
        view.scheduleApply()
    }

    // ---- Placement ------------------------------------------------------------

    @ReactProp(name = "placement")
    override fun setPlacement(view: NativeSheetHostView, value: String?) {
        view.placement = value ?: "bottom"
        view.scheduleApply()
    }

    @ReactProp(name = "margin")
    override fun setMargin(view: NativeSheetHostView, value: Double) {
        view.margin = value
        view.scheduleApply()
    }

    @ReactProp(name = "anchorX")
    override fun setAnchorX(view: NativeSheetHostView, value: Double) {
        view.anchorX = value
    }

    @ReactProp(name = "anchorY")
    override fun setAnchorY(view: NativeSheetHostView, value: Double) {
        view.anchorY = value
    }

    @ReactProp(name = "anchorWidth")
    override fun setAnchorWidth(view: NativeSheetHostView, value: Double) {
        view.anchorWidth = value
    }

    @ReactProp(name = "anchorHeight")
    override fun setAnchorHeight(view: NativeSheetHostView, value: Double) {
        view.anchorHeight = value
    }

    // ---- Design ---------------------------------------------------------------

    @ReactProp(name = "sheetBackgroundColor")
    override fun setSheetBackgroundColor(view: NativeSheetHostView, value: String?) {
        view.sheetBackgroundColor = value
        view.scheduleApply()
    }

    @ReactProp(name = "cornerRadius")
    override fun setCornerRadius(view: NativeSheetHostView, value: Double) {
        view.cornerRadius = value
        view.scheduleApply()
    }

    @ReactProp(name = "borderWidth")
    override fun setBorderWidth(view: NativeSheetHostView, value: Double) {
        view.borderWidth = value
        view.scheduleApply()
    }

    @ReactProp(name = "borderColor")
    override fun setBorderColor(view: NativeSheetHostView, value: String?) {
        view.borderColor = value
        view.scheduleApply()
    }

    @ReactProp(name = "shadowRadius")
    override fun setShadowRadius(view: NativeSheetHostView, value: Double) {
        view.shadowRadius = value
    }

    @ReactProp(name = "shadowOpacity")
    override fun setShadowOpacity(view: NativeSheetHostView, value: Double) {
        view.shadowOpacity = value
    }

    @ReactProp(name = "width")
    override fun setWidth(view: NativeSheetHostView, value: Double) {
        view.width = value
        view.scheduleApply()
    }

    @ReactProp(name = "backdropOpacity")
    override fun setBackdropOpacity(view: NativeSheetHostView, value: Double) {
        view.backdropOpacity = value
        view.scheduleApply()
    }

    @ReactProp(name = "backdropColor")
    override fun setBackdropColor(view: NativeSheetHostView, value: String?) {
        view.backdropColor = value
        view.scheduleApply()
    }

    @ReactProp(name = "showHandle")
    override fun setShowHandle(view: NativeSheetHostView, value: Boolean) {
        view.showHandle = value
    }

    @ReactProp(name = "handleColor")
    override fun setHandleColor(view: NativeSheetHostView, value: String?) {
        view.handleColor = value
    }
}
