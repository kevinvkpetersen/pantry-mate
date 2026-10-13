# 0005. Expo over bare React Native

- Status: Accepted
- Date: 2026-10-10

## Context

The mobile app is likely to need device capabilities that plain React Native doesn't provide: the camera for scanning barcodes when adding items, and notifications for expiry reminders. It also has to run on an Android emulator and a physical phone, and it is developed on Linux, where iOS builds aren't possible locally. Expo provides maintained modules for these capabilities (for example `expo-camera` and `expo-notifications`), config plugins for permissions and native settings, and file-based routing through Expo Router.

## Decision

Use Expo, with Expo Router, instead of a bare React Native project. The native projects are generated from `app.json` and config plugins and are not committed. Start in Expo Go, and move to a development build when a native module requires it.

## Alternatives considered

- **Bare React Native:** full control of the `android/` and `ios/` projects, but they have to be maintained by hand, upgrades mean merging native file diffs, and Metro needs manual configuration for the monorepo. The same capabilities are available through community libraries such as `react-native-vision-camera`, but each has to be installed and configured in the native projects by hand.
- **Expo Go only:** the quickest way to start, but it contains only Expo's bundled native modules. Anything outside that set needs a development build, so that is the planned path and not a limit to design around.

## Consequences

- Upgrading React Native is mostly a version bump, and recent Expo SDKs configure Metro for monorepos automatically.
- Adding a capability means installing the matching Expo module and declaring its permissions in `app.json`. `npx expo install` picks versions that match the SDK.
- Expo generates some files, such as `expo-env.d.ts`, that are gitignored, so a clean CI checkout lacks them. The committed `apps/mobile/env.d.ts` covers the one that broke type-aware linting.
- iOS builds can't be produced locally on Linux. Cloud builds (EAS) or a Mac machine would be needed.
- If a native need appears that config plugins can't handle, `expo prebuild` generates the native projects, so moving to bare remains possible.
