# Storage in React Native - Complete Guide

This guide covers all storage solutions for React Native applications.

## 📋 Table of Contents
1. [AsyncStorage](#asyncstorage)
2. [Secure Storage](#secure-storage)
3. [SQLite](#sqlite)
4. [Best Practices](#best-practices)

---

## 💾 AsyncStorage {#asyncstorage}

AsyncStorage is a simple, unencrypted, asynchronous, persistent, key-value storage system for React Native.

### Installation

```bash
npm install @react-native-async-storage/async-storage
```

For iOS:
```bash
cd ios && pod install && cd ..
```

### Basic Usage

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem('my-key', value);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Read data
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('my-key');
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.error('Error reading data:', error);
  }
};

// Remove data
const removeData = async () => {
  try {
    await AsyncStorage.removeItem('my-key');
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

// Clear all data
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
```

### Storing Objects

```tsx
// Store object (must stringify)
const storeObject = async (value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('my-object', jsonValue);
  } catch (error) {
    console.error('Error saving object:', error);
  }
};

// Read object (must parse)
const getObject = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('my-object');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading object:', error);
  }
};
```

### Multiple Operations

```tsx
// Store multiple items
const storeMultiple = async () => {
  try {
    await AsyncStorage.multiSet([
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', JSON.stringify({ name: 'John' })],
    ]);
  } catch (error) {
    console.error('Error storing multiple:', error);
  }
};

// Read multiple items
const getMultiple = async () => {
  try {
    const keys = ['key1', 'key2', 'key3'];
    const values = await AsyncStorage.multiGet(keys);
    // Returns: [['key1', 'value1'], ['key2', 'value2'], ['key3', '...']]
    return values;
  } catch (error) {
    console.error('Error reading multiple:', error);
  }
};

// Remove multiple items
const removeMultiple = async () => {
  try {
    const keys = ['key1', 'key2'];
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error removing multiple:', error);
  }
};
```

### Getting All Keys

```tsx
const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error('Error getting keys:', error);
  }
};
```

### Custom Hook for AsyncStorage

```tsx
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAsyncStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
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
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  return [storedValue, setValue, loading] as const;
};

// Usage
const MyComponent = () => {
  const [theme, setTheme, loading] = useAsyncStorage('theme', 'light');

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Current theme: {theme}</Text>
      <Button
        title="Toggle"
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </View>
  );
};
```

### Limitations

- **Size Limit**: ~6MB on Android, unlimited on iOS (but not recommended for large data)
- **Not Encrypted**: Don't store sensitive data
- **String Only**: Must stringify objects
- **Asynchronous**: All operations are async

---

## 🔒 Secure Storage {#secure-storage}

For sensitive data like tokens, passwords, and credentials, use secure storage.

### react-native-keychain (iOS Keychain / Android Keystore)

#### Installation

```bash
npm install react-native-keychain
cd ios && pod install && cd ..
```

#### Basic Usage

```tsx
import * as Keychain from 'react-native-keychain';

// Store credentials
const storeCredentials = async (username: string, password: string) => {
  try {
    await Keychain.setGenericPassword(username, password);
  } catch (error) {
    console.error('Error storing credentials:', error);
  }
};

// Get credentials
const getCredentials = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return {
        username: credentials.username,
        password: credentials.password,
      };
    }
  } catch (error) {
    console.error('Error getting credentials:', error);
  }
  return null;
};

// Delete credentials
const deleteCredentials = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error deleting credentials:', error);
  }
};
```

#### Store Custom Data

```tsx
// Store custom data
const storeCustomData = async (key: string, value: string) => {
  try {
    await Keychain.setInternetCredentials(
      key,
      'username', // Can be any identifier
      value
    );
  } catch (error) {
    console.error('Error storing custom data:', error);
  }
};

// Get custom data
const getCustomData = async (key: string) => {
  try {
    const credentials = await Keychain.getInternetCredentials(key);
    if (credentials) {
      return credentials.password; // Your custom value
    }
  } catch (error) {
    console.error('Error getting custom data:', error);
  }
  return null;
};
```

#### Advanced Options

```tsx
const storeWithOptions = async (username: string, password: string) => {
  try {
    await Keychain.setGenericPassword(username, password, {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      service: 'my-app-service',
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY, // Require biometric
    });
  } catch (error) {
    console.error('Error storing with options:', error);
  }
};
```

### react-native-encrypted-storage

#### Installation

```bash
npm install react-native-encrypted-storage
cd ios && pod install && cd ..
```

#### Usage

```tsx
import EncryptedStorage from 'react-native-encrypted-storage';

// Store data
const storeSecureData = async (key: string, value: any) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing secure data:', error);
  }
};

// Get data
const getSecureData = async (key: string) => {
  try {
    const value = await EncryptedStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Error getting secure data:', error);
  }
  return null;
};

// Remove data
const removeSecureData = async (key: string) => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing secure data:', error);
  }
};

// Clear all
const clearSecureStorage = async () => {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    console.error('Error clearing secure storage:', error);
  }
};
```

### Custom Hook for Secure Storage

```tsx
import { useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

const useSecureStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await EncryptedStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error loading from secure storage:', error);
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
      await EncryptedStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to secure storage:', error);
    }
  };

  return [storedValue, setValue, loading] as const;
};

// Usage
const MyComponent = () => {
  const [token, setToken, loading] = useSecureStorage('authToken', '');

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Token: {token ? '***' : 'Not set'}</Text>
      <Button
        title="Set Token"
        onPress={() => setToken('my-secret-token')}
      />
    </View>
  );
};
```

### When to Use Secure Storage

- Authentication tokens
- Passwords
- API keys
- Credit card information
- Personal identification numbers
- Any sensitive user data

---

## 🗄️ SQLite {#sqlite}

SQLite provides a full-featured SQL database for React Native.

### Installation

```bash
npm install react-native-sqlite-storage
```

For iOS:
```bash
cd ios && pod install && cd ..
```

For Android, add to `android/app/build.gradle`:
```gradle
dependencies {
    implementation 'org.webkit:android-jsc:+'
}
```

### Basic Setup

```tsx
import SQLite from 'react-native-sqlite-storage';

// Open database
const db = SQLite.openDatabase(
  {
    name: 'MyDatabase',
    location: 'default',
  },
  () => {
    console.log('Database opened');
  },
  (error) => {
    console.error('Database error:', error);
  }
);
```

### Create Table

```tsx
const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      [],
      () => {
        console.log('Table created');
      },
      (error) => {
        console.error('Error creating table:', error);
      }
    );
  });
};
```

### Insert Data

```tsx
const insertUser = (name: string, email: string, age: number) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age],
      (tx, results) => {
        console.log('User inserted, ID:', results.insertId);
      },
      (error) => {
        console.error('Error inserting user:', error);
      }
    );
  });
};
```

### Query Data

```tsx
const getUsers = (callback: (users: any[]) => void) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM users ORDER BY created_at DESC',
      [],
      (tx, results) => {
        const users = [];
        for (let i = 0; i < results.rows.length; i++) {
          users.push(results.rows.item(i));
        }
        callback(users);
      },
      (error) => {
        console.error('Error querying users:', error);
        callback([]);
      }
    );
  });
};

// Usage
getUsers((users) => {
  console.log('Users:', users);
});
```

### Update Data

```tsx
const updateUser = (id: number, name: string, email: string) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id],
      (tx, results) => {
        console.log('User updated, rows affected:', results.rowsAffected);
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  });
};
```

### Delete Data

```tsx
const deleteUser = (id: number) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM users WHERE id = ?',
      [id],
      (tx, results) => {
        console.log('User deleted, rows affected:', results.rowsAffected);
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  });
};
```

### Custom Hook for SQLite

```tsx
import { useState, useEffect } from 'react';
import SQLite from 'react-native-sqlite-storage';

const useSQLite = () => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const database = SQLite.openDatabase(
      {
        name: 'MyDatabase',
        location: 'default',
      },
      () => {
        setDb(database);
        setReady(true);
      },
      (error) => {
        console.error('Database error:', error);
      }
    );

    return () => {
      if (database) {
        database.close();
      }
    };
  }, []);

  const executeQuery = (
    query: string,
    params: any[] = []
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not ready'));
        return;
      }

      db.transaction((tx) => {
        tx.executeSql(
          query,
          params,
          (tx, results) => {
            resolve(results);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };

  return { db, ready, executeQuery };
};

// Usage
const MyComponent = () => {
  const { ready, executeQuery } = useSQLite();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (ready) {
      loadUsers();
    }
  }, [ready]);

  const loadUsers = async () => {
    try {
      const results = await executeQuery('SELECT * FROM users');
      const userList = [];
      for (let i = 0; i < results.rows.length; i++) {
        userList.push(results.rows.item(i));
      }
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  if (!ready) return <ActivityIndicator />;

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
};
```

### Alternative: react-native-sqlite-2

For a simpler API:

```bash
npm install react-native-sqlite-2
```

```tsx
import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase('mydb.db', '1.0', '', 1);

db.transaction((tx) => {
  tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');
  tx.executeSql('INSERT INTO users (name) VALUES (?)', ['John']);
  tx.executeSql('SELECT * FROM users', [], (tx, results) => {
    console.log(results.rows);
  });
});
```

---

## ✅ Best Practices {#best-practices}

### 1. Choose the Right Storage

| Storage Type | Use Case | Size Limit | Security |
|--------------|----------|------------|----------|
| **AsyncStorage** | Non-sensitive data, settings, cache | ~6MB Android | None |
| **Secure Storage** | Tokens, passwords, sensitive data | Limited by device | Encrypted |
| **SQLite** | Complex data, relationships, queries | Device storage | None (can encrypt) |

### 2. Error Handling

```tsx
const safeStorageOperation = async (operation: () => Promise<void>) => {
  try {
    await operation();
  } catch (error) {
    console.error('Storage operation failed:', error);
    // Show user-friendly error
    Alert.alert('Error', 'Failed to save data. Please try again.');
  }
};
```

### 3. Data Migration

```tsx
const migrateStorage = async () => {
  const version = await AsyncStorage.getItem('db_version');
  const currentVersion = '2.0';

  if (version !== currentVersion) {
    // Perform migration
    const oldData = await AsyncStorage.getItem('old_key');
    // Transform and save to new structure
    await AsyncStorage.setItem('new_key', transformedData);
    await AsyncStorage.setItem('db_version', currentVersion);
  }
};
```

### 4. Storage Service Layer

```tsx
// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

class StorageService {
  // AsyncStorage methods
  async setItem(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(`Failed to store ${key}`);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve ${key}`);
    }
  }

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Failed to remove ${key}`);
    }
  }

  // Secure storage methods
  async setSecureItem(key: string, value: any) {
    try {
      await EncryptedStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(`Failed to store secure ${key}`);
    }
  }

  async getSecureItem<T>(key: string): Promise<T | null> {
    try {
      const value = await EncryptedStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve secure ${key}`);
    }
  }
}

export const storageService = new StorageService();
```

### 5. Cache Management

```tsx
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const setCachedData = async <T,>(key: string, data: T) => {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
};

const getCachedData = async <T,>(key: string): Promise<T | null> => {
  const cached = await AsyncStorage.getItem(key);
  if (!cached) return null;

  const entry: CacheEntry<T> = JSON.parse(cached);
  const now = Date.now();

  if (now - entry.timestamp > CACHE_EXPIRY) {
    await AsyncStorage.removeItem(key);
    return null;
  }

  return entry.data;
};
```

### 6. Storage Size Management

```tsx
const checkStorageSize = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }

    const sizeInMB = totalSize / (1024 * 1024);
    console.log(`Storage size: ${sizeInMB.toFixed(2)} MB`);

    if (sizeInMB > 5) {
      // Clean up old cache
      await cleanupOldCache();
    }
  } catch (error) {
    console.error('Error checking storage size:', error);
  }
};
```

### 7. Type Safety

```tsx
// Define storage keys
const StorageKeys = {
  USER_PREFERENCES: 'user_preferences',
  AUTH_TOKEN: 'auth_token',
  CACHE_DATA: 'cache_data',
} as const;

type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];

// Type-safe storage functions
const setTypedItem = async <T,>(key: StorageKey, value: T) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

const getTypedItem = async <T,>(key: StorageKey): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
```

---

## 📊 Comparison Table

| Feature | AsyncStorage | Secure Storage | SQLite |
|---------|--------------|----------------|--------|
| **Security** | None | Encrypted | None (can add) |
| **Size Limit** | ~6MB Android | Device limit | Device storage |
| **Data Type** | Key-value | Key-value | Relational |
| **Query** | No | No | Full SQL |
| **Performance** | Fast | Fast | Very Fast |
| **Complexity** | Low | Low | Medium |
| **Use Case** | Settings, cache | Sensitive data | Complex data |

---

This guide covers all essential storage concepts for React Native! 🚀


