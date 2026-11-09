---
description: Release notes for react-native-universal-sheet.
---

# Changelog

All notable changes are listed here. The project follows [semantic versioning](https://semver.org).

## 0.1.0 (unreleased)

First public release.

### Added

- `NativeSheetProvider`, `NativeSheet`, `NativeModal`, `useNativeSheet`, `useSheetState`.
- `SheetManager` with stacking, `replace`, depth limit, two-phase dismissal, `update`, `replace`, `snapTo`, `expand`, `collapse`, `dismissAll`.
- `SheetRegistry` and `presentNamed` for named, typed sheets.
- 23 presentation variants with per-variant defaults (`VARIANTS`).
- Snap points: percentages, points, named heights and `'content'`; `sizing` presets.
- `appearance` and `styles` design props with validation.
- `presentAlert` and `presentToast` helpers.
- Auto-dismiss, persistent sheets, Android back button and web Escape handling.
- Native bottom sheet on iOS (`UISheetPresentationController`) and Android (`BottomSheetDialog`).
- Web renderer for every placement.
- Expo config plugin (sets the iOS deployment target to 15.0).
