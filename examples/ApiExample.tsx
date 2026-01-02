/**
 * API Examples - Fetch, Axios, Error Handling, FlatList, Pagination, Caching
 * 
 * This example demonstrates:
 * - Fetch API vs Axios
 * - Async/Await patterns
 * - Error handling
 * - Displaying data with FlatList
 * - Pagination (infinite scroll)
 * - Caching and offline support
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';

// ============================================
// TYPES
// ============================================

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// FETCH API EXAMPLES
// ============================================

const fetchWithFetch = async (url: string): Promise<Post[]> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// ============================================
// AXIOS EXAMPLE (if installed)
// ============================================

// Uncomment if axios is installed
// import axios from 'axios';
// const fetchWithAxios = async (url: string): Promise<Post[]> => {
//   const response = await axios.get<Post[]>(url);
//   return response.data;
// };

// ============================================
// ERROR HANDLING
// ============================================

const handleApiError = (error: any): string => {
  if (error.message.includes('Network')) {
    return 'Network error. Please check your connection.';
  } else if (error.message.includes('HTTP')) {
    return 'Server error. Please try again later.';
  } else {
    return error.message || 'An unknown error occurred';
  }
};

// ============================================
// BASIC API FETCH COMPONENT
// ============================================

export const BasicApiExample = () => {
  const [state, setState] = useState<ApiState<Post[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchPosts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchWithFetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=10'
      );
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: handleApiError(error),
      });
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
    </View>
  );

  if (state.loading && !state.data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {state.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Basic API Example</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchPosts}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={state.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No posts found</Text>
          </View>
        }
      />
    </View>
  );
};

// ============================================
// FLATLIST WITH PULL-TO-REFRESH
// ============================================

export const FlatListWithRefresh = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchWithFetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=20'
      );
      setPosts(data);
    } catch (err) {
      setError(handleApiError(err));
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody} numberOfLines={2}>
        {item.body}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pull-to-Refresh Example</Text>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

// ============================================
// PAGINATION (INFINITE SCROLL)
// ============================================

export const PaginationExample = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (loading || (!hasMore && append)) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchWithFetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=10`
        );

        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prev) => (append ? [...prev, ...data] : data));
          setPage(pageNum + 1);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchPosts(1, false);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(page, true);
    }
  }, [page, loading, hasMore, fetchPosts]);

  const refresh = useCallback(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, false);
  }, [fetchPosts]);

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody} numberOfLines={2}>
        {item.body}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pagination Example</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Text>No posts found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

// ============================================
// CACHING EXAMPLE (Simple In-Memory Cache)
// ============================================

// Simple in-memory cache (for demo purposes)
// In production, use AsyncStorage or a proper caching library
class SimpleCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private expiry: number = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new SimpleCache();

export const CachingExample = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<string>('');

  const fetchPosts = useCallback(async (useCache: boolean = true) => {
    const cacheKey = 'posts_list';

    // Check cache first
    if (useCache) {
      const cached = cache.get<Post[]>(cacheKey);
      if (cached) {
        setPosts(cached);
        setCacheStatus('Loaded from cache');
        return;
      }
    }

    setLoading(true);
    setError(null);
    setCacheStatus('Fetching from API...');

    try {
      const data = await fetchWithFetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=15'
      );
      setPosts(data);
      cache.set(cacheKey, data);
      setCacheStatus('Loaded from API and cached');
    } catch (err) {
      setError(handleApiError(err));
      setCacheStatus('Error loading data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const clearCache = () => {
    cache.clear();
    setCacheStatus('Cache cleared');
    setPosts([]);
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody} numberOfLines={2}>
        {item.body}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Caching Example</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => fetchPosts(true)}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearCache}
          >
            <Text style={styles.clearButtonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cacheStatus}>
        <Text style={styles.cacheStatusText}>Status: {cacheStatus}</Text>
      </View>

      {loading && !posts.length && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Text>No posts found. Try refreshing.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

// ============================================
// COMPLETE EXAMPLE WITH ALL FEATURES
// ============================================

export const CompleteApiExample = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchWithFetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=10`
        );

        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prev) => (append ? [...prev, ...data] : data));
          setPage(pageNum + 1);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    fetchPosts(1, false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchPosts(1, false);
    setRefreshing(false);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(page, true);
    }
  }, [page, loading, hasMore, fetchPosts]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View style={styles.postItem}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postBody} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Post) => item.id.toString(), []);

  const renderFooter = () => {
    if (!loading || !hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete API Example</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search posts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchPosts(1, false)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Text>
                {searchQuery
                  ? 'No posts match your search'
                  : 'No posts found'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const ApiExampleApp = () => {
  const [activeTab, setActiveTab] = useState<
    'basic' | 'refresh' | 'pagination' | 'caching' | 'complete'
  >('basic');

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'refresh', label: 'Refresh' },
    { id: 'pagination', label: 'Pagination' },
    { id: 'caching', label: 'Caching' },
    { id: 'complete', label: 'Complete' },
  ] as const;

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>API Examples</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
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

      <View style={styles.content}>
        {activeTab === 'basic' && <BasicApiExample />}
        {activeTab === 'refresh' && <FlatListWithRefresh />}
        {activeTab === 'pagination' && <PaginationExample />}
        {activeTab === 'caching' && <CachingExample />}
        {activeTab === 'complete' && <CompleteApiExample />}
      </View>
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
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  refreshButton: {
    backgroundColor: '#2196f3',
    padding: 8,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  postItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postBody: {
    fontSize: 14,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    padding: 15,
    margin: 10,
    borderRadius: 6,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    margin: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  cacheStatus: {
    padding: 10,
    backgroundColor: '#e3f2fd',
    margin: 10,
    borderRadius: 6,
  },
  cacheStatusText: {
    fontSize: 14,
    color: '#1976d2',
  },
});

export default ApiExampleApp;


