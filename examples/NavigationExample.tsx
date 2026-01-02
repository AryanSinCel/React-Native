/**
 * React Navigation Examples
 * Demonstrates Stack, Tab, and Drawer Navigation
 * 
 * NOTE: This example requires React Navigation to be installed:
 * npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer react-native-screens react-native-safe-area-context
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

// ============================================
// SCREEN COMPONENTS
// ============================================

// Home Screen
const HomeScreen = ({ navigation }: any) => {
  const [itemId, setItemId] = useState('');

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Stack Navigation Example</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigate to Details</Text>
        <TextInput
          placeholder="Enter Item ID"
          value={itemId}
          onChangeText={setItemId}
          style={styles.input}
          keyboardType="numeric"
        />
        <Button
          title="Go to Details"
          onPress={() => {
            if (itemId) {
              navigation.navigate('Details', {
                itemId: parseInt(itemId, 10),
                otherParam: 'Hello from Home!',
              });
            } else {
              Alert.alert('Error', 'Please enter an Item ID');
            }
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Methods</Text>
        <Button
          title="Push Details"
          onPress={() => navigation.push('Details', { itemId: 999 })}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="Replace with Details"
          onPress={() => navigation.replace('Details', { itemId: 888 })}
        />
      </View>
    </View>
  );
};

// Details Screen
const DetailsScreen = ({ route, navigation }: any) => {
  const { itemId, otherParam } = route.params || {};

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Details Screen</Text>
      <Text style={styles.subtitle}>Item ID: {itemId}</Text>
      {otherParam && <Text style={styles.subtitle}>{otherParam}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Actions</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
        <View style={styles.buttonSpacing} />
        <Button
          title="Go to First Screen"
          onPress={() => navigation.popToTop()}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="Update Params"
          onPress={() =>
            navigation.setParams({
              itemId: Math.floor(Math.random() * 100),
            })
          }
        />
      </View>
    </View>
  );
};

// Profile Screen
const ProfileScreen = ({ navigation }: any) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.subtitle}>Tab Navigation Example</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
};

// Settings Screen
const SettingsScreen = ({ navigation }: any) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings Screen</Text>
      <Text style={styles.subtitle}>Tab Navigation Example</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
};

// Notifications Screen
const NotificationsScreen = ({ navigation }: any) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Notifications Screen</Text>
      <Text style={styles.subtitle}>Drawer Navigation Example</Text>
      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()}
      />
      <View style={styles.buttonSpacing} />
      <Button
        title="Close Drawer"
        onPress={() => navigation.closeDrawer()}
      />
    </View>
  );
};

// ============================================
// NAVIGATION EXAMPLES (Without React Navigation)
// ============================================

// Since React Navigation isn't installed, we'll create a mock navigation system
// to demonstrate the concepts

export const StackNavigationExample = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [navigationStack, setNavigationStack] = useState<string[]>(['Home']);
  const [params, setParams] = useState<any>({});

  const navigate = (screen: string, newParams?: any) => {
    setNavigationStack([...navigationStack, screen]);
    setCurrentScreen(screen);
    if (newParams) setParams(newParams);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop();
      setNavigationStack(newStack);
      setCurrentScreen(newStack[newStack.length - 1]);
    }
  };

  const push = (screen: string, newParams?: any) => {
    navigate(screen, newParams);
  };

  const replace = (screen: string, newParams?: any) => {
    setNavigationStack([screen]);
    setCurrentScreen(screen);
    if (newParams) setParams(newParams);
  };

  const popToTop = () => {
    setNavigationStack(['Home']);
    setCurrentScreen('Home');
  };

  const setParamsAction = (newParams: any) => {
    setParams({ ...params, ...newParams });
  };

  const mockNavigation = {
    navigate,
    goBack,
    push,
    replace,
    popToTop,
    setParams: setParamsAction,
  };

  const mockRoute = {
    params: params,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stack Navigation Example</Text>
      <Text style={styles.subtitle}>
        Current Screen: {currentScreen}
      </Text>
      <Text style={styles.subtitle}>
        Stack: {navigationStack.join(' → ')}
      </Text>

      {currentScreen === 'Home' && (
        <HomeScreen navigation={mockNavigation} />
      )}
      {currentScreen === 'Details' && (
        <DetailsScreen navigation={mockNavigation} route={mockRoute} />
      )}

      <View style={styles.navigationInfo}>
        <Text style={styles.infoTitle}>Navigation Stack:</Text>
        {navigationStack.map((screen, index) => (
          <Text key={index} style={styles.infoText}>
            {index + 1}. {screen}
          </Text>
        ))}
      </View>
    </View>
  );
};

export const TabNavigationExample = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Navigation Example</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Profile' && styles.activeTab]}
          onPress={() => setActiveTab('Profile')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Profile' && styles.activeTabText,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Settings' && styles.activeTab]}
          onPress={() => setActiveTab('Settings')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Settings' && styles.activeTabText,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'Profile' && (
          <ProfileScreen
            navigation={{
              navigate: (screen: string) => setActiveTab(screen),
            }}
          />
        )}
        {activeTab === 'Settings' && (
          <SettingsScreen
            navigation={{
              navigate: (screen: string) => setActiveTab(screen),
            }}
          />
        )}
      </View>
    </View>
  );
};

export const DrawerNavigationExample = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');

  const mockNavigation = {
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    toggleDrawer: () => setDrawerOpen(!drawerOpen),
    navigate: (screen: string) => {
      setCurrentScreen(screen);
      setDrawerOpen(false);
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerOpen(!drawerOpen)}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.drawerHeaderText}>My App</Text>
      </View>

      {drawerOpen && (
        <View style={styles.drawer}>
          <TouchableOpacity
            style={[
              styles.drawerItem,
              currentScreen === 'Home' && styles.drawerItemActive,
            ]}
            onPress={() => {
              setCurrentScreen('Home');
              setDrawerOpen(false);
            }}
          >
            <Text
              style={[
                styles.drawerItemText,
                currentScreen === 'Home' && styles.drawerItemTextActive,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.drawerItem,
              currentScreen === 'Notifications' && styles.drawerItemActive,
            ]}
            onPress={() => {
              setCurrentScreen('Notifications');
              setDrawerOpen(false);
            }}
          >
            <Text
              style={[
                styles.drawerItemText,
                currentScreen === 'Notifications' &&
                  styles.drawerItemTextActive,
              ]}
            >
              Notifications
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.drawerContent}>
        {currentScreen === 'Home' && (
          <View style={styles.screen}>
            <Text style={styles.title}>Home Screen</Text>
            <Text style={styles.subtitle}>Drawer Navigation Example</Text>
            <Button
              title="Open Drawer"
              onPress={() => setDrawerOpen(true)}
            />
          </View>
        )}
        {currentScreen === 'Notifications' && (
          <NotificationsScreen navigation={mockNavigation} />
        )}
      </View>
    </View>
  );
};

// ============================================
// PARAMETERS EXAMPLE
// ============================================

export const ParametersExample = () => {
  const [itemId, setItemId] = useState('');
  const [otherParam, setOtherParam] = useState('');
  const [receivedParams, setReceivedParams] = useState<any>(null);

  const navigateWithParams = () => {
    setReceivedParams({
      itemId: itemId || 'Not provided',
      otherParam: otherParam || 'Not provided',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passing Parameters Example</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter Parameters:</Text>
        <TextInput
          placeholder="Item ID"
          value={itemId}
          onChangeText={setItemId}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Other Param"
          value={otherParam}
          onChangeText={setOtherParam}
          style={styles.input}
        />
        <Button title="Navigate with Params" onPress={navigateWithParams} />
      </View>

      {receivedParams && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Received Parameters:</Text>
          <Text style={styles.paramText}>
            Item ID: {receivedParams.itemId}
          </Text>
          <Text style={styles.paramText}>
            Other Param: {receivedParams.otherParam}
          </Text>
        </View>
      )}
    </View>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const NavigationExampleApp = () => {
  const [activeExample, setActiveExample] = useState<
    'stack' | 'tab' | 'drawer' | 'params'
  >('stack');

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>React Navigation Examples</Text>
      <Text style={styles.installNote}>
        Note: Install React Navigation packages to use real navigation
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        <TouchableOpacity
          style={[
            styles.exampleTab,
            activeExample === 'stack' && styles.activeExampleTab,
          ]}
          onPress={() => setActiveExample('stack')}
        >
          <Text
            style={[
              styles.exampleTabText,
              activeExample === 'stack' && styles.activeExampleTabText,
            ]}
          >
            Stack
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.exampleTab,
            activeExample === 'tab' && styles.activeExampleTab,
          ]}
          onPress={() => setActiveExample('tab')}
        >
          <Text
            style={[
              styles.exampleTabText,
              activeExample === 'tab' && styles.activeExampleTabText,
            ]}
          >
            Tab
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.exampleTab,
            activeExample === 'drawer' && styles.activeExampleTab,
          ]}
          onPress={() => setActiveExample('drawer')}
        >
          <Text
            style={[
              styles.exampleTabText,
              activeExample === 'drawer' && styles.activeExampleTabText,
            ]}
          >
            Drawer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.exampleTab,
            activeExample === 'params' && styles.activeExampleTab,
          ]}
          onPress={() => setActiveExample('params')}
        >
          <Text
            style={[
              styles.exampleTabText,
              activeExample === 'params' && styles.activeExampleTabText,
            ]}
          >
            Params
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView style={styles.content}>
        {activeExample === 'stack' && <StackNavigationExample />}
        {activeExample === 'tab' && <TabNavigationExample />}
        {activeExample === 'drawer' && <DrawerNavigationExample />}
        {activeExample === 'params' && <ParametersExample />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  installNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#fff3cd',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 4,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  buttonSpacing: {
    height: 10,
  },
  navigationInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContent: {
    paddingHorizontal: 10,
  },
  tab: {
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2196f3',
  },
  menuButton: {
    marginRight: 15,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 60,
    bottom: 0,
    width: 250,
    backgroundColor: '#fff',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerItemActive: {
    backgroundColor: '#e3f2fd',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
  drawerItemTextActive: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  exampleTab: {
    padding: 15,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeExampleTab: {
    borderBottomColor: '#2196f3',
  },
  exampleTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeExampleTabText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  paramText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
});

export default NavigationExampleApp;


