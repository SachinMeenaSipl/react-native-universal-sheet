import UIKit

/// Container view controller that presents a `NativeSheetHostView` as a page sheet.
/// Forwards user-driven dismissal and detent changes back to its host.
final class NativeSheetController: UIViewController, UISheetPresentationControllerDelegate {
    weak var host: NativeSheetHostView?

    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        host?.handleDismissed()
    }

    func sheetPresentationControllerDidChangeSelectedDetentIdentifier(
        _ sheetPresentationController: UISheetPresentationController
    ) {
        host?.handleDetentChange(sheetPresentationController.selectedDetentIdentifier)
    }
}
