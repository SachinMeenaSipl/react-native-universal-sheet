package com.universalsheet

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

/** Dispatched to JS as onPresent / onDismiss / onSnapChange. */
class NativeSheetEvent(
    surfaceId: Int,
    viewId: Int,
    private val eventName: String,
    private val index: Int?,
) : Event<NativeSheetEvent>(surfaceId, viewId) {

    override fun getEventName(): String = eventName

    override fun getEventData(): WritableMap? =
        Arguments.createMap().also { map ->
            index?.let { map.putInt("index", it) }
        }
}
