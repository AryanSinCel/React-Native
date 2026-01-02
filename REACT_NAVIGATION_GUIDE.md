# React Navigation Complete Guide

React Navigation is the most popular navigation library for React Native apps. This guide covers everything you need to know.

## 📋 Table of Contents
1. [Installation](#installation)
2. [Stack Navigation](#stack-navigation)
3. [Tab Navigation](#tab-navigation)
4. [Drawer Navigation](#drawer-navigation)
5. [Passing Parameters](#passing-parameters)
6. [Deep Linking](#deep-linking)
7. [Best Practices](#best-practices)

---

## 📦 Installation {#installation}

### Step 1: Install Core Packages

```bash
npm install @react-navigation/native
```

### Step 2: Install Navigation Types

For **Stack Navigation**:
```bash
npm install @react-navigation/native-stack
```

For **Tab Navigation**:
```bash
npm install @react-navigation/bottom-tabs
```

For **Drawer Navigation**:
```bash
npm install @react-navigation/drawer
```

### Step 3: Install Required Dependencies

React Navigation requires some peer dependencies:

```bash
npm install react-native-screens react-native-safe-area-context
```

For **iOS**, you also need to install pods:
```bash
cd ios && pod install && cd ..
```

For **Drawer Navigation**, you need:
```bash
npm install react-native-gesture-handler react-native-reanimated
```

### Step 4: Complete Installation Commands

**For Stack + Tab Navigation:**
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

**For Drawer Navigation (add these):**
```bash
npm install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

### Step 5: iOS Pod Installation

```bash
cd ios && pod install && cd ..
```

### Step 6: Android Configuration

For Android, no additional setup is needed. The library works out of the box.

### Step 7: Babel Configuration (for Reanimated)

If using `react-native-reanimated`, add to `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

---

## 📚 Stack Navigation {#stack-navigation}

Stack Navigation provides a way for your app to transition between screens where each new screen is placed on top of a stack.

### Basic Setup

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';

// Define your screen components
function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

// Create the stack navigator
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

### Stack Navigation Options

#### Screen Options

```tsx
<Stack.Navigator
  screenOptions={{
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen
    name="Details"
    component={DetailsScreen}
    options={{
      title: 'My Details',
      headerStyle: {
        backgroundColor: '#2196F3',
      },
    }}
  />
</Stack.Navigator>
```

#### Custom Header

```tsx
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerTitle: (props) => <LogoTitle {...props} />,
    headerRight: () => (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#fff"
      />
    ),
  }}
/>
```

#### Hide Header

```tsx
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  options={{ headerShown: false }}
/>
```

### Navigation Methods

```tsx
function HomeScreen({ navigation }: any) {
  return (
    <View>
      <Button
        title="Navigate to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Push Details"
        onPress={() => navigation.push('Details')}
      />
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
      <Button
        title="Go to First Screen"
        onPress={() => navigation.popToTop()}
      />
      <Button
        title="Replace with Details"
        onPress={() => navigation.replace('Details')}
      />
    </View>
  );
}
```

### Navigation Lifecycle

```tsx
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

function DetailsScreen() {
  useFocusEffect(
    useCallback(() => {
      // Screen is focused
      console.log('Screen focused');
      
      return () => {
        // Screen is unfocused
        console.log('Screen unfocused');
      };
    }, [])
  );

  return <View>{/* Your content */}</View>;
}
```

---

## 📑 Tab Navigation {#tab-navigation}

Tab Navigation provides bottom or top tabs for switching between screens.

### Basic Setup

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

### Custom Tab Icons

```tsx
import Ionicons from 'react-native-vector-icons/Ionicons';

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### Tab Badges

```tsx
<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    tabBarBadge: 3, // Shows a badge with number
    tabBarBadgeStyle: { backgroundColor: 'red' },
  }}
/>
```

### Tab Bar Styling

```tsx
<Tab.Navigator
  screenOptions={{
    tabBarActiveTintColor: '#e91e63',
    tabBarInactiveTintColor: '#999',
    tabBarStyle: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      height: 60,
      paddingBottom: 5,
      paddingTop: 5,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    },
  }}
>
  {/* Screens */}
</Tab.Navigator>
```

### Top Tabs

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

---

## 🗂️ Drawer Navigation {#drawer-navigation}

Drawer Navigation provides a slide-in menu from the side of the screen.

### Basic Setup

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

### Opening/Closing Drawer Programmatically

```tsx
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()}
      />
      <Button
        title="Close Drawer"
        onPress={() => navigation.closeDrawer()}
      />
      <Button
        title="Toggle Drawer"
        onPress={() => navigation.toggleDrawer()}
      />
    </View>
  );
}
```

### Custom Drawer Content

```tsx
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>My App</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0' }}>
        <Text>Version 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

### Drawer Styling

```tsx
<Drawer.Navigator
  screenOptions={{
    drawerStyle: {
      backgroundColor: '#fff',
      width: 250,
    },
    drawerActiveTintColor: '#e91e63',
    drawerInactiveTintColor: '#999',
    drawerLabelStyle: {
      fontSize: 16,
      fontWeight: '500',
    },
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
  }}
>
  {/* Screens */}
</Drawer.Navigator>
```

---

## 📤 Passing Parameters {#passing-parameters}

### Passing Parameters to a Route

```tsx
function HomeScreen({ navigation }: any) {
  return (
    <View>
      <Button
        title="Go to Details"
        onPress={() => {
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
    </View>
  );
}
```

### Reading Parameters

```tsx
function DetailsScreen({ route, navigation }: any) {
  const { itemId, otherParam } = route.params;

  return (
    <View>
      <Text>Item ID: {itemId}</Text>
      <Text>Other Param: {otherParam}</Text>
    </View>
  );
}
```

### TypeScript: Typed Parameters

```tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Details: {
    itemId: number;
    otherParam?: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

function DetailsScreen({ route, navigation }: Props) {
  const { itemId, otherParam } = route.params;

  return (
    <View>
      <Text>Item ID: {itemId}</Text>
      {otherParam && <Text>Other Param: {otherParam}</Text>}
    </View>
  );
}
```

### Updating Parameters

```tsx
function DetailsScreen({ route, navigation }: any) {
  return (
    <View>
      <Button
        title="Update Params"
        onPress={() =>
          navigation.setParams({
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
    </View>
  );
}
```

### Initial Parameters

```tsx
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  initialParams={{ itemId: 42 }}
/>
```

### Passing Parameters with Default Values

```tsx
function DetailsScreen({ route }: any) {
  const { itemId, otherParam = 'default value' } = route.params || {};

  return (
    <View>
      <Text>Item ID: {itemId}</Text>
      <Text>Other Param: {otherParam}</Text>
    </View>
  );
}
```

---

## 🔗 Deep Linking {#deep-linking}

Deep linking allows you to open specific screens in your app via URLs.

### Basic Deep Link Setup

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'home',
      Details: 'details/:itemId',
      Profile: {
        path: 'profile/:userId',
        parse: {
          userId: (userId: string) => parseInt(userId, 10),
        },
      },
    },
  },
};

function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Handling Deep Links

```tsx
function DetailsScreen({ route }: any) {
  const { itemId } = route.params || {};

  return (
    <View>
      <Text>Item ID from deep link: {itemId}</Text>
    </View>
  );
}
```

### Testing Deep Links

**iOS Simulator:**
```bash
xcrun simctl openurl booted "myapp://details/123"
```

**Android Emulator:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "myapp://details/123" com.myapp
```

### Universal Links (iOS) / App Links (Android)

For production apps, you'll need to configure:

**iOS (Universal Links):**
- Add Associated Domains in Xcode
- Configure `apple-app-site-association` file on your server

**Android (App Links):**
- Add intent filters in `AndroidManifest.xml`
- Configure `assetlinks.json` file on your server

### Getting Initial URL

```tsx
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

function App() {
  const [initialUrl, setInitialUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        setInitialUrl(url);
      }
    });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('Deep link received:', event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer linking={linking}>
      {/* Your navigator */}
    </NavigationContainer>
  );
}
```

---

## ✅ Best Practices {#best-practices}

### 1. Type Safety with TypeScript

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Details: { itemId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Use typed navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeScreenProps) {
  // navigation.navigate is now typed!
  navigation.navigate('Profile', { userId: '123' });
}
```

### 2. Organize Navigation Structure

```
src/
  navigation/
    index.tsx          # Main navigation container
    RootNavigator.tsx  # Root stack navigator
    TabNavigator.tsx   # Tab navigator
    DrawerNavigator.tsx # Drawer navigator
  screens/
    HomeScreen.tsx
    DetailsScreen.tsx
    ProfileScreen.tsx
```

### 3. Use Navigation Hooks

```tsx
import { useNavigation, useRoute } from '@react-navigation/native';

function MyScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Use navigation and route
}
```

### 4. Handle Navigation State

```tsx
import { useNavigationState } from '@react-navigation/native';

function MyScreen() {
  const routeName = useNavigationState((state) => 
    state?.routes[state.index]?.name
  );

  return <Text>Current screen: {routeName}</Text>;
}
```

### 5. Prevent Multiple Navigations

```tsx
function MyScreen({ navigation }: any) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigate = () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    navigation.navigate('Details');
    
    setTimeout(() => setIsNavigating(false), 1000);
  };

  return <Button title="Navigate" onPress={handleNavigate} />;
}
```

### 6. Use Navigation Focus Effect

```tsx
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

function MyScreen() {
  useFocusEffect(
    useCallback(() => {
      // Fetch data when screen is focused
      fetchData();

      return () => {
        // Cleanup when screen is unfocused
        cancelRequest();
      };
    }, [])
  );

  return <View>{/* Content */}</View>;
}
```

### 7. Conditional Navigation

```tsx
function LoginScreen({ navigation }: any) {
  const handleLogin = async () => {
    const success = await login();
    
    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  return <Button title="Login" onPress={handleLogin} />;
}
```

### 8. Navigation Reset

```tsx
// Reset navigation stack (useful after login)
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

### 9. Nested Navigators

```tsx
// Stack Navigator inside Tab Navigator
function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FeedList" component={FeedListScreen} />
      <Stack.Screen name="FeedDetails" component={FeedDetailsScreen} />
    </Stack.Navigator>
  );
}
```

### 10. Performance Optimization

```tsx
// Lazy load screens
const DetailsScreen = React.lazy(() => import('./screens/DetailsScreen'));

// Use React.memo for screen components
const HomeScreen = React.memo(function HomeScreen() {
  return <View>{/* Content */}</View>;
});
```

### 11. Error Boundaries

```tsx
import { NavigationContainer } from '@react-navigation/native';

function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        {/* Your navigator */}
      </NavigationContainer>
    </ErrorBoundary>
  );
}
```

### 12. Navigation Events

```tsx
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

function MyScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen focused
      console.log('Screen focused');
    });

    return unsubscribe;
  }, [navigation]);

  return <View>{/* Content */}</View>;
}
```

---

## 🎯 Common Patterns

### Authentication Flow

```tsx
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Modal Screens

```tsx
<Stack.Navigator>
  <Stack.Group>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Details" component={DetailsScreen} />
  </Stack.Group>
  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
  </Stack.Group>
</Stack.Navigator>
```

### Header Buttons

```tsx
import { HeaderBackButton } from '@react-navigation/elements';

<Stack.Screen
  name="Details"
  component={DetailsScreen}
  options={({ navigation, route }) => ({
    headerLeft: (props) => (
      <HeaderBackButton
        {...props}
        onPress={() => {
          // Custom back action
          navigation.goBack();
        }}
      />
    ),
    headerRight: () => (
      <Button
        onPress={() => alert('Menu')}
        title="Menu"
        color="#000"
      />
    ),
  })}
/>
```

---

This guide covers all essential React Navigation concepts! 🚀


