1. Modal types
A modal is a UI layer displayed above the current screen. It can appear in the center, from the top, from the bottom, or occupy the entire screen.










1. Center Modal

Appears in the center of the screen.

Use cases: Confirmation, information, short forms, alerts.
Very common













2. Full Screen Modal

Covers the entire screen.

Use cases: Create profile, edit details, onboarding, complex forms.
Very common













3. Alert Dialog

Small dialog with title, description and action buttons.

Use cases: Delete confirmation, logout, permission explanation.













4. Popup Modal

Floating popup positioned over a screen.

Use cases: Quick actions, contextual information, announcements.













5. Side Modal

Slides from left or right.

Use cases: Filters, settings, navigation, additional information.













6. Top Modal

Appears from the top of the screen.

Use cases: Notifications, connection status, temporary alerts.













7. Floating Modal

A floating card with margins around the screen.

Use cases: Media previews, mini-player, contextual workflows.



2. Bottom sheet types
Bottom sheets are panels that appear from the bottom edge of the screen. They are especially common in Android and iOS applications.
Important for your library
A. Based on presentation and height










1. Peek / Mini Sheet

Shows a small portion of a sheet at the bottom.

Use cases: Mini player, map location preview, tracking status.













2. Half Sheet

Occupies approximately 40–60% of screen height.

Use cases: Quick selection, filters, location details.













3. Medium Sheet

Occupies approximately 60–75% of screen height.

Use cases: Forms, menus, product details.













4. Expanded Sheet

Occupies approximately 85–95% of screen height.

Use cases: Search results, long forms, detailed content.













5. Full Height Sheet

Occupies the entire available screen.

Use cases: Full-screen workflows, complex selection, detailed screens.



B. Based on interaction behavior










6. Draggable Sheet

User can drag the sheet up and down between snap points.

Use cases: Maps, search, ride booking.













7. Persistent Sheet

Remains visible while the user interacts with the underlying screen.

Use cases: Music player, navigation, ongoing task status.













8. Modal Bottom Sheet

Appears above the screen with a backdrop.

Use cases: Action menus, selection, filters, confirmation.













9. Non-modal Bottom Sheet

Underlying screen remains interactive.

Use cases: Mini player, contextual panels, map previews.













10. Nested Scroll Sheet

Sheet supports both dragging and scrolling its content.

Use cases: Long lists, product details, search results.



C. Based on specialized use cases










11. Action Sheet

List of available actions.

Example: Share, Copy, Delete, Edit.













12. Share Sheet

Native-style sharing options.

Example: Share content to WhatsApp, Messages, Mail.













13. Picker Sheet

Selection interface.

Example: Date, time, country, language, currency.













14. Filter Sheet

Filter and sorting controls.

Example: Price range, category, ratings.













15. Keyboard-aware Sheet

Automatically adjusts its height and position when the keyboard opens.

Example: Chat input, comments, search, forms.













16. Stacked / Nested Sheet

Opens another sheet over an existing sheet.

Example: Open a country selector from a profile-edit sheet.



3. Other overlay components worth supporting
These are not necessarily modals or bottom sheets, but a comprehensive UI library can provide them as separate components.
Component	Purpose
Toast	Short temporary message
Snackbar	Message with optional action
Tooltip	Contextual explanation
Popover	Floating contextual content
Context Menu	Long-press actions
Dropdown	Selection menu
Coachmark	Feature guidance
Spotlight	Highlight specific UI
Loading Overlay	Block interaction during loading
Full-screen Viewer	Image/video preview
In-app Notification	Temporary notification panel

4. Common real-world sheet patterns
These are useful references when designing your library.
Google Maps-style sheet








nngroup.com


Peek → Half → Expanded. Map remains visible behind the sheet.


Apple Music-style mini player








tek.sapo.pt


Persistent mini player → Expanded player.


iOS Action Sheet








migros.ch


Action list with cancel option.


Filter and Sort Sheet








medium.com


Scrollable filters with Apply and Reset actions.


5. Recommended architecture for your React Native library
I would avoid creating 20 completely independent native implementations. Instead, create a common native presentation engine and expose different presentation modes through a consistent API.

For example:
<NativeModal
  visible={visible}
  presentation="center"
  animation="spring"
  backdrop
  onDismiss={handleDismiss}
>
  <Content />
</NativeModal>


For sheets:
<NativeSheet
  visible={visible}
  snapPoints={['25%', '50%', '90%']}
  initialSnapPoint="50%"
  enableDrag
  enableBackdrop
  enableKeyboard
  enableNestedScroll
  onDismiss={handleDismiss}
>
  <Content />
</NativeSheet>


Suggested API categories
Category	Presentation types
Modal	Center, full-screen, floating, side, top
Sheet	Bottom, left, right, top
Sheet behavior	Modal, persistent, non-modal
Sheet sizing	Peek, half, medium, expanded, full
Sheet interaction	Draggable, nested scroll, snap points
Specialized	Action, picker, filter, share

6. Features your library should support
For a production-grade native library, these capabilities matter more than the number of presentation types.
- [ ] Multiple simultaneous modals.
- [ ] Multiple simultaneous sheets.
- [ ] Modal over modal.
- [ ] Sheet over modal and modal over sheet.
- [ ] Independent native presentation controllers.
- [ ] Configurable animation duration and spring physics.
- [ ] Backdrop blur and dimming.
- [ ] Swipe-to-dismiss with velocity thresholds.
- [ ] Gesture conflict handling.
- [ ] Keyboard avoidance and resizing.
- [ ] Safe area handling.
- [ ] Nested scrolling.
- [ ] Android BackHandler integration.
- [ ] iOS interactive dismissal.
- [ ] Orientation and screen-size changes.
- [ ] Accessibility and screen reader support.
- [ ] Expo compatibility.
- [ ] Fabric and legacy architecture support.

7. My recommendation: What to build first
For your native React Native library, I would prioritize these 12 components/presentation patterns.
Priority	Component	Importance
1	Center Modal	Essential
2	Full Screen Modal	Essential
3	Modal Bottom Sheet	Essential
4	Draggable Bottom Sheet	Essential
5	Persistent Bottom Sheet	High
6	Action Sheet	High
7	Nested / Stacked Sheet	High
8	Side Sheet	High
9	Keyboard-aware Sheet	Essential
10	Floating Modal	Medium
11	Top Sheet	Medium
12	Non-modal Sheet