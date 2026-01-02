/**
 * Tab Navigator
 * Bottom tab navigator for the app
 * 
 * Usage:
 * import TabNavigator from './navigation/TabNavigator';
 * 
 * <TabNavigator />
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screens
// import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

// Placeholder screens (replace with your actual screens)
const HomeScreen = () => null;
const ProfileScreen = () => null;
const SettingsScreen = () => null;

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Uncomment to use icons (requires react-native-vector-icons)
        // tabBarIcon: ({ focused, color, size }) => {
        //   let iconName: string;
        //
        //   if (route.name === 'HomeTab') {
        //     iconName = focused ? 'home' : 'home-outline';
        //   } else if (route.name === 'ProfileTab') {
        //     iconName = focused ? 'person' : 'person-outline';
        //   } else if (route.name === 'SettingsTab') {
        //     iconName = focused ? 'settings' : 'settings-outline';
        //   } else {
        //     iconName = 'help-outline';
        //   }
        //
        //   return <Ionicons name={iconName} size={size} color={color} />;
        // },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          // tabBarBadge: 3, // Uncomment to show badge
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}


