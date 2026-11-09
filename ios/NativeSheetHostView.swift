import UIKit
import React

/// Hosts React children inside a UIKit page sheet.
///
/// While presented, this view is re-parented into a `NativeSheetController`, which is
/// presented from the topmost view controller. That keeps stacked sheets on the native
/// presentation stack. On dismissal the view goes back to its React parent, so React
/// content identity is preserved.
@objc(NativeSheetHostView)
public final class NativeSheetHostView: UIView {
    @objc public var sheetId: String = ""

    @objc public var visible: Bool = false {
        didSet {
            if oldValue != visible { scheduleApply() }
        }
    }

    /// Detent fractions of viewport height. A negative value means "size to content".
    @objc public var snapPoints: [NSNumber] = [] {
        didSet {
            if presented { applyDetents() }
        }
    }

    @objc public var snapIndex: Int = 0 {
        didSet {
            if presented && snapIndex != oldValue { selectDetent(animated: true) }
        }
    }

    @objc public var enableDrag: Bool = true {
        didSet { controller?.isModalInPresentation = !enableDrag }
    }
    @objc public var enableBackdrop: Bool = true
    @objc public var enableKeyboard: Bool = true
    @objc public var enableNestedScroll: Bool = true

    // Placement: stored for the shared prop contract. iOS currently presents page sheets only.
    @objc public var placement: String = "bottom"
    @objc public var margin: CGFloat = 0
    @objc public var anchorX: CGFloat = 0
    @objc public var anchorY: CGFloat = 0
    @objc public var anchorWidth: CGFloat = 0
    @objc public var anchorHeight: CGFloat = 0

    // Design
    @objc public var borderWidth: CGFloat = 0
    @objc public var borderColor: String?
    @objc public var shadowRadius: CGFloat = 0
    @objc public var shadowOpacity: CGFloat = 0
    @objc public var width: CGFloat = 0
    @objc public var backdropColor: String?
    @objc public var handleColor: String?

    @objc public var cornerRadius: CGFloat = 16
    /// Not applied on iOS: UISheetPresentationController uses the system backdrop.
    @objc public var backdropOpacity: CGFloat = 0.4
    @objc public var showHandle: Bool = true
    @objc public var sheetBackgroundColor: String?

    @objc public var onPresent: RCTDirectEventBlock?
    @objc public var onDismiss: RCTDirectEventBlock?
    @objc public var onSnapChange: RCTDirectEventBlock?

    // Weak: UIKit retains the presented controller, and the controller's view retains us.
    private weak var controller: NativeSheetController?
    private var presented = false
    private weak var originalParent: UIView?
    private var originalIndex: Int = 0
    private var applyScheduled = false

    public override init(frame: CGRect) {
        super.init(frame: frame)
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
    }

    deinit {
        // React unmounted this view while a sheet was up: dismiss without animation.
        controller?.dismiss(animated: false)
    }

    /// React Native lays this view out by frame. While presented, the sheet owns the frame.
    public override func reactSetFrame(_ frame: CGRect) {
        if presented, let controller = controller {
            super.reactSetFrame(controller.view.bounds)
        } else {
            super.reactSetFrame(frame)
        }
    }

    // MARK: - Visibility

    private func scheduleApply() {
        guard !applyScheduled else { return }
        applyScheduled = true
        // Props arrive as a batch; act once they have all been applied.
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.applyScheduled = false
            self.applyVisibility()
        }
    }

    private func applyVisibility() {
        if visible {
            presentIfNeeded()
        } else {
            dismissIfNeeded()
        }
    }

    private func presentIfNeeded() {
        guard !presented else { return }
        guard let host = topViewController() else { return }

        if host.isBeingPresented || host.isBeingDismissed {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [weak self] in
                self?.applyVisibility()
            }
            return
        }

        let sheet = NativeSheetController()
        sheet.host = self
        sheet.modalPresentationStyle = .pageSheet
        sheet.view.backgroundColor = parseColor(sheetBackgroundColor) ?? .systemBackground

        originalParent = superview
        originalIndex = superview?.subviews.firstIndex(of: self) ?? 0
        presented = true
        controller = sheet

        // addSubview detaches this view from its React parent.
        sheet.view.addSubview(self)
        frame = sheet.view.bounds
        autoresizingMask = [.flexibleWidth, .flexibleHeight]

        host.present(sheet, animated: true) { [weak self] in
            guard let self = self, self.controller === sheet else { return }
            self.onPresent?([:])
        }
        // The sheet presentation controller exists once present(_:) has been called.
        configureSheetPresentation(sheet)
    }

    private func dismissIfNeeded() {
        guard let sheet = controller, !sheet.isBeingDismissed else { return }
        sheet.dismiss(animated: true) { [weak self] in
            self?.handleDismissed()
        }
    }

    /// Called when the sheet is gone, whether by code or by a user gesture. Idempotent.
    func handleDismissed() {
        guard controller != nil else { return }
        controller = nil
        presented = false

        if let parent = originalParent {
            parent.insertSubview(self, at: min(originalIndex, parent.subviews.count))
        } else {
            removeFromSuperview()
        }
        onDismiss?([:])
    }

    /// Tears down without emitting events. Used when React drops the view.
    func teardown() {
        let sheet = controller
        controller = nil
        presented = false
        onPresent = nil
        onDismiss = nil
        onSnapChange = nil
        sheet?.dismiss(animated: false)
        removeFromSuperview()
    }

    // MARK: - Sheet configuration

    private func configureSheetPresentation(_ sheet: NativeSheetController) {
        sheet.isModalInPresentation = !enableDrag
        guard let presentation = sheet.sheetPresentationController else { return }
        presentation.delegate = sheet
        presentation.prefersGrabberVisible = showHandle
        applyBorderAndShadow(to: sheet.view)
        if #available(iOS 16.0, *) {
            presentation.preferredCornerRadius = cornerRadius
        }
        applyDetents()
        selectDetent(animated: false)
    }

    private func applyDetents() {
        guard let presentation = controller?.sheetPresentationController else { return }
        presentation.detents = makeDetents()
    }

    private func makeDetents() -> [UISheetPresentationController.Detent] {
        if #available(iOS 16.0, *) {
            if snapPoints.isEmpty { return [.large()] }
            return snapPoints.enumerated().map { (index, value) -> UISheetPresentationController.Detent in
                let fraction = CGFloat(value.doubleValue)
                if fraction < 0 {
                    return .medium()
                }
                let identifier = UISheetPresentationController.Detent.Identifier("snap\(index)")
                return .custom(identifier: identifier) { context in
                    context.maximumDetentValue * fraction
                }
            }
        }
        // iOS 15 has only the system detents.
        return [.medium(), .large()]
    }

    private func detentIdentifier(for index: Int) -> UISheetPresentationController.Detent.Identifier? {
        guard index >= 0, index < snapPoints.count else { return nil }
        let fraction = snapPoints[index].doubleValue
        if #available(iOS 16.0, *) {
            return fraction < 0 ? .medium : UISheetPresentationController.Detent.Identifier("snap\(index)")
        }
        return fraction < 0.6 ? .medium : .large
    }

    private func selectDetent(animated: Bool) {
        guard let presentation = controller?.sheetPresentationController,
              let identifier = detentIdentifier(for: snapIndex) else { return }
        let apply = { presentation.selectedDetentIdentifier = identifier }
        if animated {
            presentation.animateChanges(apply)
        } else {
            apply()
        }
    }

    /// Called by the controller when the user drags to another detent.
    func handleDetentChange(_ identifier: UISheetPresentationController.Detent.Identifier?) {
        guard let identifier = identifier else { return }
        guard let index = (0..<snapPoints.count).first(where: { detentIdentifier(for: $0) == identifier }) else {
            return
        }
        guard index != snapIndex else { return }
        snapIndex = index
        onSnapChange?(["index": index])
    }

    // MARK: - Helpers

    private func topViewController() -> UIViewController? {
        let windows = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap { $0.windows }
        let keyWindow = windows.first(where: { $0.isKeyWindow }) ?? windows.first
        var top = keyWindow?.rootViewController
        while let next = top?.presentedViewController {
            top = next
        }
        return top
    }

    private func applyBorderAndShadow(to view: UIView) {
        view.layer.borderWidth = borderWidth
        view.layer.borderColor = parseColor(borderColor)?.cgColor
        view.layer.shadowRadius = shadowRadius
        view.layer.shadowOpacity = Float(shadowOpacity)
        view.layer.shadowOffset = CGSize(width: 0, height: -2)
    }

    private func parseColor(_ hex: String?) -> UIColor? {
        guard var digits = hex?.trimmingCharacters(in: .whitespaces), digits.hasPrefix("#") else { return nil }
        digits.removeFirst()
        guard digits.count == 6 || digits.count == 8, let value = UInt64(digits, radix: 16) else { return nil }
        let hasAlpha = digits.count == 8
        let shift: UInt64 = hasAlpha ? 8 : 0
        let r = CGFloat((value >> (shift + 16)) & 0xFF) / 255
        let g = CGFloat((value >> (shift + 8)) & 0xFF) / 255
        let b = CGFloat((value >> shift) & 0xFF) / 255
        let a = hasAlpha ? CGFloat(value & 0xFF) / 255 : 1
        return UIColor(red: r, green: g, blue: b, alpha: a)
    }
}
