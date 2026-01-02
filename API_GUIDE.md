# Working With APIs in React Native - Complete Guide

This guide covers everything you need to know about working with APIs in React Native applications.

## 📋 Table of Contents
1. [Fetch API vs Axios](#fetch-vs-axios)
2. [Async/Await](#async-await)
3. [Handling Errors](#error-handling)
4. [Displaying API Data with FlatList](#flatlist)
5. [Pagination (Infinite Scroll)](#pagination)
6. [Caching & Offline Support](#caching)

---

## 🔄 Fetch API vs Axios {#fetch-vs-axios}

### Fetch API (Built-in)

**Pros:**
- Built into React Native (no installation needed)
- Promise-based
- Lightweight
- Modern API

**Cons:**
- No automatic JSON parsing
- No request/response interceptors
- No automatic request cancellation
- Less intuitive error handling

#### Basic Fetch Example

```tsx
// GET request
const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// POST request
const postData = async (userData: any) => {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Post error:', error);
    throw error;
  }
};
```

### Axios (Third-party Library)

**Pros:**
- Automatic JSON parsing
- Request/response interceptors
- Better error handling
- Request cancellation
- More intuitive API
- Automatic request/response transformation

**Cons:**
- Requires installation
- Larger bundle size
- Additional dependency

#### Installation

```bash
npm install axios
```

#### Basic Axios Example

```tsx
import axios from 'axios';

// GET request
const fetchData = async () => {
  try {
    const response = await axios.get('https://api.example.com/data');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      if (error.response) {
        // Server responded with error
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        console.error('Request error:', error.request);
      }
    }
    throw error;
  }
};

// POST request
const postData = async (userData: any) => {
  try {
    const response = await axios.post(
      'https://api.example.com/users',
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Post error:', error);
    throw error;
  }
};
```

### Comparison Table

| Feature | Fetch | Axios |
|---------|-------|-------|
| **Installation** | Built-in | npm install |
| **JSON Parsing** | Manual | Automatic |
| **Request Timeout** | Manual | Built-in |
| **Interceptors** | No | Yes |
| **Request Cancellation** | Manual | Built-in |
| **Error Handling** | Manual | Better |
| **Bundle Size** | 0 KB | ~13 KB |
| **Browser Support** | Modern browsers | All browsers |

### When to Use Each

**Use Fetch when:**
- You want to keep bundle size small
- You don't need advanced features
- You're building a simple app
- You prefer built-in solutions

**Use Axios when:**
- You need interceptors (auth tokens, etc.)
- You want better error handling
- You need request cancellation
- You prefer a more feature-rich API

---

## ⏳ Async/Await {#async-await}

Async/await is a modern way to handle asynchronous operations in JavaScript.

### Basic Syntax

```tsx
// Async function
const fetchData = async () => {
  const data = await fetch('https://api.example.com/data');
  return data;
};

// Using async function
const handlePress = async () => {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

### Multiple Async Operations

#### Sequential (One after another)

```tsx
const fetchUserData = async (userId: string) => {
  // Wait for user
  const user = await fetch(`/api/users/${userId}`);
  
  // Then wait for posts
  const posts = await fetch(`/api/users/${userId}/posts`);
  
  // Then wait for comments
  const comments = await fetch(`/api/users/${userId}/comments`);
  
  return { user, posts, comments };
};
```

#### Parallel (All at once)

```tsx
const fetchUserData = async (userId: string) => {
  // All requests happen simultaneously
  const [user, posts, comments] = await Promise.all([
    fetch(`/api/users/${userId}`),
    fetch(`/api/users/${userId}/posts`),
    fetch(`/api/users/${userId}/comments`),
  ]);
  
  return { user, posts, comments };
};
```

### Error Handling with Async/Await

```tsx
const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // Handle different error types
    if (error instanceof TypeError) {
      // Network error
      return { success: false, error: 'Network error' };
    } else if (error instanceof Error) {
      // Other errors
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error' };
  }
};
```

### Loading States

```tsx
const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.example.com/data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  if (!data) return null;

  return <View>{/* Display data */}</View>;
};
```

---

## ❌ Handling Errors {#error-handling}

### Comprehensive Error Handling

```tsx
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error',
      status: error.response.status,
      code: error.response.data?.code,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server',
      code: 'NETWORK_ERROR',
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'Unknown error',
      code: 'UNKNOWN_ERROR',
    };
  }
};

// Usage
const fetchData = async () => {
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('API Error:', apiError);
    throw apiError;
  }
};
```

### Error Boundaries

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong</Text>
          <Text>{this.state.error?.message}</Text>
          <Button
            title="Try Again"
            onPress={() => this.setState({ hasError: false, error: null })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

### Retry Logic

```tsx
const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  throw new Error('Max retries exceeded');
};
```

---

## 📋 Displaying API Data with FlatList {#flatlist}

### Basic Example

```tsx
import { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
        <Button title="Retry" onPress={fetchPosts} />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>No posts found</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  body: {
    fontSize: 14,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
```

### With Pull-to-Refresh

```tsx
const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};
```

---

## 📄 Pagination (Infinite Scroll) {#pagination}

### Basic Infinite Scroll

```tsx
const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts(1);
  }, []);

  const loadPosts = async (pageNum: number) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=10`
      );
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => (pageNum === 1 ? data : [...prev, ...data]));
        setPage(pageNum + 1);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page);
    }
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator size="small" /> : null
      }
    />
  );
};
```

### Optimized Pagination Hook

```tsx
interface UsePaginationOptions<T> {
  fetchFn: (page: number) => Promise<T[]>;
  pageSize?: number;
  initialPage?: number;
}

const usePagination = <T,>({
  fetchFn,
  pageSize = 10,
  initialPage = 1,
}: UsePaginationOptions<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newData = await fetchFn(page);

      if (newData.length < pageSize) {
        setHasMore(false);
      }

      setData((prev) => (page === initialPage ? newData : [...prev, ...newData]));
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFn, pageSize, initialPage]);

  const refresh = useCallback(async () => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    await loadMore();
  }, [initialPage, loadMore]);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

// Usage
const PostList = () => {
  const { data, loading, hasMore, loadMore } = usePagination({
    fetchFn: async (page) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );
      return response.json();
    },
  });

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading && hasMore ? <ActivityIndicator /> : null
      }
    />
  );
};
```

---

## 💾 Caching & Offline Support {#caching}

### Simple Cache with AsyncStorage

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number; // milliseconds
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const getCachedData = async <T,>(key: string): Promise<T | null> => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    if (now - entry.timestamp > entry.expiry) {
      // Cache expired
      await AsyncStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedData = async <T,>(
  key: string,
  data: T,
  expiry: number = CACHE_EXPIRY
): Promise<void> => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

// Usage
const fetchWithCache = async <T,>(
  key: string,
  fetchFn: () => Promise<T>,
  expiry?: number
): Promise<T> => {
  // Try cache first
  const cached = await getCachedData<T>(key);
  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  await setCachedData(key, data, expiry);
  return data;
};
```

### Custom Hook with Caching

```tsx
const useCachedFetch = <T,>(
  key: string,
  url: string,
  options?: RequestInit,
  cacheExpiry?: number
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadData();
  }, [key, url]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cached = await getCachedData<T>(key);
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      // Fetch fresh data
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const freshData = await response.json();
        setData(freshData);
        await setCachedData(key, freshData, cacheExpiry);
        setIsOffline(false);
      } catch (fetchError) {
        // If fetch fails and we have cached data, use it
        if (cached) {
          setIsOffline(true);
        } else {
          throw fetchError;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadData();
  };

  return { data, loading, error, isOffline, refresh };
};
```

### Network Status Detection

```tsx
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Get initial state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isConnected,
    connectionType,
    isOffline: isConnected === false,
  };
};

// Usage
const MyComponent = () => {
  const { isConnected, isOffline } = useNetworkStatus();

  return (
    <View>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text>No internet connection. Using cached data.</Text>
        </View>
      )}
      {/* Your content */}
    </View>
  );
};
```

### Complete Caching Solution

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class ApiCache {
  private static instance: ApiCache;
  private cache: Map<string, CacheEntry<any>> = new Map();

  static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      // Check memory cache first
      const memoryEntry = this.cache.get(key);
      if (memoryEntry && !this.isExpired(memoryEntry)) {
        return memoryEntry.data;
      }

      // Check persistent cache
      const cached = await AsyncStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      if (this.isExpired(entry)) {
        await AsyncStorage.removeItem(`cache_${key}`);
        this.cache.delete(key);
        return null;
      }

      // Store in memory cache
      this.cache.set(key, entry);
      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(
    key: string,
    data: T,
    expiry: number = CACHE_EXPIRY
  ): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiry,
      };

      // Store in memory
      this.cache.set(key, entry);

      // Store persistently
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
    await AsyncStorage.multiRemove(cacheKeys);
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.expiry;
  }
}

// Usage
const apiCache = ApiCache.getInstance();

const fetchWithCache = async <T,>(
  key: string,
  fetchFn: () => Promise<T>,
  expiry?: number
): Promise<T> => {
  // Check cache
  const cached = await apiCache.get<T>(key);
  if (cached) {
    return cached;
  }

  // Check network
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    throw new Error('No internet connection and no cached data');
  }

  // Fetch fresh
  const data = await fetchFn();
  await apiCache.set(key, data, expiry);
  return data;
};
```

---

## 🎯 Best Practices

### 1. Create API Service Layer

```tsx
// services/api.ts
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService('https://api.example.com');
```

### 2. Use Custom Hooks

```tsx
const useApi = <T,>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
};
```

### 3. Handle Loading States

```tsx
const MyComponent = () => {
  const { data, loading, error } = useApi('/api/data');

  if (loading) return <ActivityIndicator />;
  if (error) return <ErrorView error={error} />;
  if (!data) return null;

  return <DataView data={data} />;
};
```

### 4. Optimize Re-renders

```tsx
const renderItem = useCallback(
  ({ item }: { item: Post }) => <PostItem post={item} />,
  []
);

const keyExtractor = useCallback((item: Post) => item.id.toString(), []);
```

---

This guide covers all essential API concepts for React Native! 🚀


