/**
 * Drawer Navigator
 * Side drawer navigator for the app
 * 
 * Usage:
 * import DrawerNavigator from './navigation/DrawerNavigator';
 * 
 * <DrawerNavigator />
 */

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from './types';
// import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

// Import your screens
// import HomeScreen from '../screens/HomeScreen';
// import NotificationsScreen from '../screens/NotificationsScreen';
// import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

// Placeholder screens (replace with your actual screens)
const HomeScreen = () => null;
const NotificationsScreen = () => null;
const SettingsScreen = () => null;

// Custom drawer content (optional)
// function CustomDrawerContent(props: any) {
//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
//         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>My App</Text>
//       </View>
//       <DrawerItemList {...props} />
//     </DrawerContentScrollView>
//   );
// }

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: 250,
        },
        drawerActiveTintColor: '#e91e63',
        drawerInactiveTintColor: '#999',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
      }}
      // drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Drawer.Navigator>
  );
}


