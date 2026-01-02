/**
 * Storage Examples
 * Demonstrates AsyncStorage, Secure Storage, and SQLite
 * 
 * NOTE: These libraries require installation:
 * - AsyncStorage: npm install @react-native-async-storage/async-storage
 * - Secure Storage: npm install react-native-encrypted-storage
 * - SQLite: npm install react-native-sqlite-storage
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================
// MOCK STORAGE IMPLEMENTATIONS
// ============================================

// Mock AsyncStorage (in-memory for demo)
class MockAsyncStorage {
  private storage: Map<string, string> = new Map();

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    return keys.map((key) => [key, this.storage.get(key) || null]);
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    keyValuePairs.forEach(([key, value]) => {
      this.storage.set(key, value);
    });
  }
}

const mockAsyncStorage = new MockAsyncStorage();

// Mock Secure Storage
class MockSecureStorage {
  private storage: Map<string, string> = new Map();

  async setItem(key: string, value: string): Promise<void> {
    // Simulate encryption (in real app, this would be encrypted)
    this.storage.set(key, `encrypted_${value}`);
  }

  async getItem(key: string): Promise<string | null> {
    const value = this.storage.get(key);
    if (!value) return null;
    // Simulate decryption
    return value.replace('encrypted_', '');
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

const mockSecureStorage = new MockSecureStorage();

// ============================================
// ASYNCSTORAGE EXAMPLES
// ============================================

export const AsyncStorageExample = () => {
  const [key, setKey] = useState('myKey');
  const [value, setValue] = useState('');
  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStoredValue = async () => {
    setLoading(true);
    try {
      const item = await mockAsyncStorage.getItem(key);
      setStoredValue(item);
    } catch (error) {
      Alert.alert('Error', 'Failed to read from storage');
    } finally {
      setLoading(false);
    }
  };

  const storeValue = async () => {
    if (!key || !value) {
      Alert.alert('Error', 'Please enter both key and value');
      return;
    }

    setLoading(true);
    try {
      await mockAsyncStorage.setItem(key, value);
      Alert.alert('Success', 'Value stored successfully');
      setValue('');
      loadStoredValue();
      loadAllKeys();
    } catch (error) {
      Alert.alert('Error', 'Failed to store value');
    } finally {
      setLoading(false);
    }
  };

  const removeValue = async () => {
    setLoading(true);
    try {
      await mockAsyncStorage.removeItem(key);
      setStoredValue(null);
      Alert.alert('Success', 'Value removed');
      loadAllKeys();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove value');
    } finally {
      setLoading(false);
    }
  };

  const loadAllKeys = async () => {
    try {
      const keys = await mockAsyncStorage.getAllKeys();
      setAllKeys(keys);
    } catch (error) {
      console.error('Error loading keys:', error);
    }
  };

  const clearAll = async () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await mockAsyncStorage.clear();
              setStoredValue(null);
              setAllKeys([]);
              Alert.alert('Success', 'All storage cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear storage');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadStoredValue();
    loadAllKeys();
  }, [key]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AsyncStorage Example</Text>
      <Text style={styles.note}>
        Mock implementation. Install @react-native-async-storage/async-storage
        for real usage.
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Key</Text>
        <TextInput
          style={styles.input}
          value={key}
          onChangeText={setKey}
          placeholder="Storage key"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Value</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="Storage value"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={storeValue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Store</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={loadStoredValue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Load</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loader} />}

      {storedValue !== null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Stored Value:</Text>
          <Text style={styles.resultText}>{storedValue}</Text>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={removeValue}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Keys ({allKeys.length})</Text>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton, { padding: 8 }]}
            onPress={clearAll}
          >
            <Text style={[styles.buttonText, { fontSize: 12 }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
        {allKeys.map((k) => (
          <Text key={k} style={styles.keyItem}>
            • {k}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

// ============================================
// OBJECT STORAGE EXAMPLE
// ============================================

export const ObjectStorageExample = () => {
  const [user, setUser] = useState({ name: '', email: '', age: '' });
  const [storedUser, setStoredUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const storeUser = async () => {
    if (!user.name || !user.email) {
      Alert.alert('Error', 'Please fill in name and email');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: user.name,
        email: user.email,
        age: parseInt(user.age) || 0,
      };
      await mockAsyncStorage.setItem('user', JSON.stringify(userData));
      Alert.alert('Success', 'User stored successfully');
      setUser({ name: '', email: '', age: '' });
      loadUser();
    } catch (error) {
      Alert.alert('Error', 'Failed to store user');
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    setLoading(true);
    try {
      const userJson = await mockAsyncStorage.getItem('user');
      if (userJson) {
        setStoredUser(JSON.parse(userJson));
      } else {
        setStoredUser(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async () => {
    setLoading(true);
    try {
      await mockAsyncStorage.removeItem('user');
      setStoredUser(null);
      Alert.alert('Success', 'User removed');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Object Storage Example</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
          placeholder="Enter name"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={user.age}
          onChangeText={(text) => setUser({ ...user, age: text })}
          placeholder="Enter age"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton, styles.fullWidth]}
        onPress={storeUser}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Store User</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={styles.loader} />}

      {storedUser && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Stored User:</Text>
          <Text style={styles.resultText}>Name: {storedUser.name}</Text>
          <Text style={styles.resultText}>Email: {storedUser.email}</Text>
          <Text style={styles.resultText}>Age: {storedUser.age}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={loadUser}
            >
              <Text style={styles.buttonText}>Reload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={removeUser}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// ============================================
// SECURE STORAGE EXAMPLE
// ============================================

export const SecureStorageExample = () => {
  const [token, setToken] = useState('');
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const storeToken = async () => {
    if (!token) {
      Alert.alert('Error', 'Please enter a token');
      return;
    }

    setLoading(true);
    try {
      await mockSecureStorage.setItem('authToken', token);
      Alert.alert('Success', 'Token stored securely');
      setToken('');
      loadToken();
    } catch (error) {
      Alert.alert('Error', 'Failed to store token');
    } finally {
      setLoading(false);
    }
  };

  const loadToken = async () => {
    setLoading(true);
    try {
      const value = await mockSecureStorage.getItem('authToken');
      setStoredToken(value);
    } catch (error) {
      Alert.alert('Error', 'Failed to load token');
    } finally {
      setLoading(false);
    }
  };

  const removeToken = async () => {
    setLoading(true);
    try {
      await mockSecureStorage.removeItem('authToken');
      setStoredToken(null);
      Alert.alert('Success', 'Token removed');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Secure Storage Example</Text>
      <Text style={styles.note}>
        Mock implementation. Install react-native-encrypted-storage for real
        encrypted storage.
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Auth Token</Text>
        <TextInput
          style={styles.input}
          value={token}
          onChangeText={setToken}
          placeholder="Enter authentication token"
          secureTextEntry
        />
        <Text style={styles.hint}>
          Use secure storage for sensitive data like tokens, passwords, etc.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton, styles.fullWidth]}
        onPress={storeToken}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Store Token Securely</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={styles.loader} />}

      {storedToken && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Stored Token:</Text>
          <Text style={styles.resultText}>
            {storedToken.substring(0, 20)}... (hidden)
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={removeToken}
          >
            <Text style={styles.buttonText}>Remove Token</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// ============================================
// CUSTOM HOOK EXAMPLE
// ============================================

const useAsyncStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await mockAsyncStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error loading from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await mockAsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  return [storedValue, setValue, loading] as const;
};

export const CustomHookExample = () => {
  const [theme, setTheme, loading] = useAsyncStorage('theme', 'light');
  const [count, setCount, countLoading] = useAsyncStorage('count', 0);

  if (loading || countLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Hook Example</Text>
      <Text style={styles.note}>
        Using useAsyncStorage hook for automatic loading and saving
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View
          style={[
            styles.themeBox,
            { backgroundColor: theme === 'light' ? '#fff' : '#333' },
          ]}
        >
          <Text
            style={{ color: theme === 'light' ? '#000' : '#fff' }}
          >
            Current: {theme}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <Text style={styles.buttonText}>Toggle Theme</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Counter</Text>
        <Text style={styles.count}>{count}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCount(count - 1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCount(0)}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCount(count + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>
          Values are automatically saved and restored
        </Text>
      </View>
    </View>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const StorageExampleApp = () => {
  const [activeTab, setActiveTab] = useState<
    'async' | 'object' | 'secure' | 'hook'
  >('async');

  const tabs = [
    { id: 'async', label: 'AsyncStorage' },
    { id: 'object', label: 'Objects' },
    { id: 'secure', label: 'Secure' },
    { id: 'hook', label: 'Custom Hook' },
  ] as const;

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Storage Examples</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {activeTab === 'async' && <AsyncStorageExample />}
        {activeTab === 'object' && <ObjectStorageExample />}
        {activeTab === 'secure' && <SecureStorageExample />}
        {activeTab === 'hook' && <CustomHookExample />}
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
  tabContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContent: {
    paddingHorizontal: 10,
  },
  tab: {
    padding: 15,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  note: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  primaryButton: {
    backgroundColor: '#2196f3',
  },
  secondaryButton: {
    backgroundColor: '#4caf50',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    marginTop: 10,
  },
  fullWidth: {
    width: '100%',
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  keyItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 10,
  },
  themeBox: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196f3',
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StorageExampleApp;


