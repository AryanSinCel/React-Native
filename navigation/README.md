# React Navigation Setup Guide

This directory contains navigation setup files for React Navigation.

## 📦 Installation

Before using these navigation files, install React Navigation:

```bash
# Core packages
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer

# Required dependencies
npm install react-native-screens react-native-safe-area-context

# For drawer navigation (optional)
npm install react-native-gesture-handler react-native-reanimated

# iOS pods
cd ios && pod install && cd ..
```

## 📁 File Structure

```
navigation/
  index.tsx              # Main navigation container
  RootNavigator.tsx      # Root stack navigator
  TabNavigator.tsx       # Bottom tab navigator
  DrawerNavigator.tsx    # Drawer navigator
  types.ts              # TypeScript navigation types
```

## 🚀 Quick Start

1. Install packages (see above)
2. Copy navigation files to your project
3. Update `App.tsx`:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
```

## 📚 Documentation

See `REACT_NAVIGATION_GUIDE.md` for complete documentation.


