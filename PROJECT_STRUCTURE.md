# React Native Project Structure Explained

This document explains the folder structure of a React Native project and what each part does.

## 📁 Root Level Files

### Configuration Files

#### `package.json`
- **Purpose**: Defines your project's dependencies, scripts, and metadata
- **Contains**:
  - Project name, version, and description
  - Dependencies (React, React Native, and other libraries)
  - Scripts (start, android, ios, test, lint)
  - Node.js version requirements
- **How it works**: When you run `npm install`, it reads this file to download all dependencies into `node_modules/`

#### `app.json`
- **Purpose**: App metadata used by React Native CLI
- **Contains**: App name and display name
- **How it works**: Used by build tools to identify your app

#### `tsconfig.json`
- **Purpose**: TypeScript configuration
- **Contains**: Compiler options, file includes/excludes
- **How it works**: Tells TypeScript how to compile your `.ts` and `.tsx` files

#### `babel.config.js`
- **Purpose**: Babel transpiler configuration
- **Contains**: Presets that transform modern JavaScript/TypeScript into code that React Native can run
- **How it works**: Transforms your code during the build process (e.g., JSX → JavaScript, ES6+ → ES5)

#### `metro.config.js`
- **Purpose**: Metro bundler configuration (Metro is React Native's JavaScript bundler)
- **Contains**: Settings for how Metro bundles your JavaScript code
- **How it works**: Metro reads this when you run `npm start` to bundle your app's JavaScript

#### `jest.config.js`
- **Purpose**: Jest testing framework configuration
- **Contains**: Test settings, file patterns, and test environment setup
- **How it works**: Used when you run `npm test` to execute your test files

---

## 📁 Core Application Files

### `App.tsx`
- **Purpose**: The main entry component of your React Native app
- **What it does**: This is the root component that gets rendered when your app starts
- **How it works**: Contains your app's UI structure and logic

### `index.js`
- **Purpose**: The JavaScript entry point that registers your app
- **What it does**: 
  - Imports your `App` component
  - Registers it with React Native's `AppRegistry`
  - Tells React Native which component to render
- **How it works**: This is the first file that runs when your app launches

---

## 📁 Platform-Specific Folders

### `android/` Folder
Contains all Android-specific code and configuration.

#### `android/app/`
- **Purpose**: Main Android application module
- **Key files**:
  - `build.gradle`: Android build configuration (dependencies, SDK versions, build settings)
  - `src/main/AndroidManifest.xml`: App permissions, activities, and Android app configuration
  - `src/main/java/`: Native Android code (Kotlin files)
  - `src/main/res/`: Android resources (images, layouts, strings)

#### `android/build.gradle`
- **Purpose**: Project-level Android build configuration
- **Contains**: Android SDK version, build tools version, repositories

#### `android/gradle/`
- **Purpose**: Gradle wrapper files
- **Contains**: Gradle version and wrapper scripts
- **How it works**: Ensures everyone uses the same Gradle version

#### `android/gradle.properties`
- **Purpose**: Gradle build properties
- **Contains**: Memory settings, build optimizations

#### `android/settings.gradle`
- **Purpose**: Defines which modules are included in the Android build

---

### `ios/` Folder
Contains all iOS-specific code and configuration.

#### `ios/MyApp/`
- **Purpose**: Main iOS application folder
- **Key files**:
  - `AppDelegate.swift`: iOS app entry point, handles app lifecycle
  - `Info.plist`: iOS app configuration (permissions, bundle ID, supported devices)
  - `LaunchScreen.storyboard`: The splash screen shown when app launches
  - `Images.xcassets/`: iOS image assets (app icons)

#### `ios/MyApp.xcodeproj/`
- **Purpose**: Xcode project file
- **Contains**: Project structure, build settings, file references
- **How it works**: This is what you open in Xcode to build/run the iOS app

#### `ios/MyApp.xcworkspace/`
- **Purpose**: Xcode workspace (includes CocoaPods)
- **Contains**: References to the project and Pods
- **How it works**: You open this (not .xcodeproj) when using CocoaPods

#### `ios/Podfile`
- **Purpose**: CocoaPods dependency manager configuration
- **Contains**: List of iOS native dependencies
- **How it works**: When you run `pod install`, it reads this file and installs dependencies to `Pods/`

#### `ios/Pods/`
- **Purpose**: Installed iOS native dependencies
- **Contains**: All CocoaPods libraries (React Native core, native modules, etc.)
- **Note**: This folder is generated - don't edit it manually

#### `ios/Podfile.lock`
- **Purpose**: Locks dependency versions
- **Contains**: Exact versions of all installed pods
- **How it works**: Ensures consistent builds across different machines

---

## 📁 Development & Testing

### `__tests__/`
- **Purpose**: Contains test files
- **Contains**: Unit tests, component tests
- **How it works**: Jest automatically finds and runs files in this folder

### `node_modules/`
- **Purpose**: All installed npm packages
- **Contains**: Dependencies from `package.json`
- **Note**: Never edit files here - they're managed by npm
- **Size**: Can be very large (often 100+ MB)

---

## 📁 Build & Configuration

### `vendor/`
- **Purpose**: Ruby gem dependencies (for CocoaPods)
- **Contains**: Bundled Ruby gems
- **How it works**: Used by `bundle install` for iOS development

### `Gemfile` & `Gemfile.lock`
- **Purpose**: Ruby dependency management (for CocoaPods)
- **Contains**: Ruby gem versions needed for iOS development
- **How it works**: Ensures consistent CocoaPods versions across the team

---

## 🔄 How It All Works Together

### Development Flow:

1. **You write code** in `App.tsx` and other source files
2. **Metro bundler** (`metro.config.js`) bundles your JavaScript
3. **Babel** (`babel.config.js`) transpiles your code
4. **TypeScript** (`tsconfig.json`) type-checks your code
5. **Platform builds**:
   - **Android**: Gradle (`android/build.gradle`) compiles native code
   - **iOS**: Xcode (`ios/MyApp.xcodeproj`) compiles native code
6. **App launches**: `index.js` registers and renders `App.tsx`

### Build Process:

```
Your Code (App.tsx)
    ↓
Metro Bundler (bundles JS)
    ↓
Babel (transpiles)
    ↓
Native Build (Android/iOS)
    ↓
Running App
```

---

## 📝 Key Takeaways

1. **Root files** = Configuration and entry points
2. **`android/`** = Everything Android-specific
3. **`ios/`** = Everything iOS-specific
4. **`node_modules/`** = JavaScript dependencies
5. **`App.tsx`** = Your main app code
6. **`index.js`** = App registration point

---

## 🎯 What You'll Edit Most Often

- **`App.tsx`**: Your main app code
- **`package.json`**: Adding new npm packages
- **`android/app/src/main/AndroidManifest.xml`**: Android permissions
- **`ios/MyApp/Info.plist`**: iOS permissions
- **Your own source files**: Create new `.tsx` files for screens/components

---

## ⚠️ Important Notes

- **Don't edit** `node_modules/` or `ios/Pods/` - they're auto-generated
- **Don't commit** `node_modules/` to git (use `.gitignore`)
- **Always use** `ios/MyApp.xcworkspace` (not `.xcodeproj`) when using CocoaPods
- **Run `pod install`** after adding iOS dependencies
- **Run `npm install`** after adding JavaScript dependencies


