/**
 * React Hooks Examples
 * Demonstrates useState, useEffect, useRef, useCallback, useMemo, and Custom Hooks
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';

// ============================================
// USESTATE EXAMPLES
// ============================================

export const UseStateExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [user, setUser] = useState({ name: '', email: '' });
  const [todos, setTodos] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useState Examples</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Counter (Number State)</Text>
        <Text style={styles.count}>{count}</Text>
        <View style={styles.buttonRow}>
          <Button title="-" onPress={() => setCount(count - 1)} />
          <Button title="Reset" onPress={() => setCount(0)} />
          <Button title="+" onPress={() => setCount(count + 1)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Text Input (String State)</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          style={styles.input}
        />
        <Text>Hello, {name || 'Guest'}!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Object State</Text>
        <TextInput
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
          placeholder="Name"
          style={styles.input}
        />
        <TextInput
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          placeholder="Email"
          style={styles.input}
        />
        <Text>Name: {user.name}</Text>
        <Text>Email: {user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Array State</Text>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Add todo"
            style={[styles.input, { flex: 1 }]}
            onSubmitEditing={(e) => {
              if (e.nativeEvent.text) {
                setTodos([...todos, e.nativeEvent.text]);
                e.nativeEvent.text = '';
              }
            }}
          />
        </View>
        {todos.map((todo, index) => (
          <View key={index} style={styles.todoItem}>
            <Text>{todo}</Text>
            <Button
              title="Remove"
              onPress={() => setTodos(todos.filter((_, i) => i !== index))}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================
// USEEFFECT EXAMPLES
// ============================================

export const UseEffectExample = () => {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Effect 1: Run once on mount
  useEffect(() => {
    console.log('Component mounted');
    Alert.alert('Info', 'Component mounted!');
  }, []);

  // Effect 2: Run when count changes
  useEffect(() => {
    console.log('Count changed to:', count);
  }, [count]);

  // Effect 3: Timer with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      console.log('Timer cleaned up');
    };
  }, []);

  // Effect 4: Simulated API call
  const fetchData = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setData('Data loaded successfully!');
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useEffect Examples</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Effect on Mount</Text>
        <Text>Check console and alert when component mounts</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Effect on State Change</Text>
        <Text>Count: {count}</Text>
        <Text>Check console when count changes</Text>
        <Button title="Increment" onPress={() => setCount(count + 1)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Timer with Cleanup</Text>
        <Text style={styles.timer}>Timer: {seconds}s</Text>
        <Text>Timer stops when component unmounts</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Async Data Fetching</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text>{data || 'Loading...'}</Text>
        )}
        <Button title="Refetch" onPress={fetchData} />
      </View>
    </View>
  );
};

// ============================================
// USEREF EXAMPLES
// ============================================

export const UseRefExample = () => {
  const [count, setCount] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const countRef = useRef(0);
  const prevCountRef = useRef<number>();

  // Track previous value
  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const incrementWithoutRerender = () => {
    countRef.current += 1;
    console.log('Count ref:', countRef.current);
    // This won't cause a re-render!
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useRef Examples</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Accessing TextInput</Text>
        <TextInput
          ref={inputRef}
          placeholder="Click button to focus"
          style={styles.input}
        />
        <Button title="Focus Input" onPress={focusInput} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Storing Mutable Values</Text>
        <Text>State count: {count} (causes re-render)</Text>
        <Text>Ref count: {countRef.current} (no re-render)</Text>
        <View style={styles.buttonRow}>
          <Button
            title="Increment State"
            onPress={() => setCount(count + 1)}
          />
          <Button
            title="Increment Ref"
            onPress={incrementWithoutRerender}
          />
        </View>
        <Text style={styles.note}>
          Check console for ref updates (no re-render)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Tracking Previous Value</Text>
        <Text>Current count: {count}</Text>
        <Text>Previous count: {prevCountRef.current ?? 'N/A'}</Text>
        <Button title="Increment" onPress={() => setCount(count + 1)} />
      </View>
    </View>
  );
};

// ============================================
// USECALLBACK EXAMPLES
// ============================================

// Memoized child component
const ExpensiveChild = React.memo(
  ({ onPress, label }: { onPress: () => void; label: string }) => {
    console.log(`Rendering ${label}`);
    return (
      <TouchableOpacity style={styles.childButton} onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  }
);

export const UseCallbackExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ❌ Without useCallback - new function every render
  const handleClickWithoutCallback = () => {
    console.log('Clicked without callback');
  };

  // ✅ With useCallback - same function reference
  const handleClickWithCallback = useCallback(() => {
    console.log('Clicked with callback');
  }, []); // Empty deps = never changes

  // ✅ With dependencies
  const handleClickWithDeps = useCallback(() => {
    console.log('Count is:', count);
  }, [count]); // Changes when count changes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useCallback Examples</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Preventing Re-renders</Text>
        <Text>Count: {count}</Text>
        <Text>Name: {name}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Type to see re-renders"
          style={styles.input}
        />
        <Text style={styles.note}>
          Check console - child with useCallback won't re-render when name
          changes
        </Text>
        <ExpensiveChild
          label="Without useCallback"
          onPress={handleClickWithoutCallback}
        />
        <ExpensiveChild
          label="With useCallback"
          onPress={handleClickWithCallback}
        />
        <ExpensiveChild
          label="With Dependencies"
          onPress={handleClickWithDeps}
        />
        <Button title="Increment Count" onPress={() => setCount(count + 1)} />
      </View>
    </View>
  );
};

// ============================================
// USEMEMO EXAMPLES
// ============================================

export const UseMemoExample = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([1, 2, 3, 4, 5]);
  const [filter, setFilter] = useState('');

  // ❌ Expensive calculation on every render
  const expensiveValueWithoutMemo = () => {
    console.log('Calculating without memo...');
    return items.reduce((sum, item) => sum + item * 2, 0);
  };

  // ✅ Memoized - only recalculates when items change
  const expensiveValueWithMemo = useMemo(() => {
    console.log('Calculating with memo...');
    return items.reduce((sum, item) => sum + item * 2, 0);
  }, [items]);

  // Filtered items - only recalculates when items or filter changes
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter((item) =>
      item.toString().includes(filter)
    );
  }, [items, filter]);

  // Memoized object - same reference unless items change
  const config = useMemo(
    () => ({
      items: items.length,
      sum: items.reduce((a, b) => a + b, 0),
    }),
    [items]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useMemo Examples</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Expensive Calculations</Text>
        <Text>Count: {count}</Text>
        <Text>Without memo: {expensiveValueWithoutMemo()}</Text>
        <Text>With memo: {expensiveValueWithMemo}</Text>
        <Text style={styles.note}>
          Check console - memoized version only calculates when items change
        </Text>
        <Button title="Increment Count" onPress={() => setCount(count + 1)} />
        <Button
          title="Add Item"
          onPress={() => setItems([...items, items.length + 1])}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Filtered Data</Text>
        <TextInput
          value={filter}
          onChangeText={setFilter}
          placeholder="Filter items"
          style={styles.input}
        />
        <Text>Filtered items: {filteredItems.join(', ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Memoized Objects</Text>
        <Text>Config items: {config.items}</Text>
        <Text>Config sum: {config.sum}</Text>
        <Text style={styles.note}>
          Config object has stable reference unless items change
        </Text>
      </View>
    </View>
  );
};

// ============================================
// CUSTOM HOOKS
// ============================================

// Custom Hook: useCounter
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

// Custom Hook: useToggle
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, setTrue, setFalse }] as const;
};

// Custom Hook: useDebounce
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom Hook: usePrevious
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const CustomHooksExample = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [currentValue, setCurrentValue] = useState(0);
  const previousValue = usePrevious(currentValue);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Hooks Examples</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. useCounter Hook</Text>
        <Text style={styles.count}>{count}</Text>
        <View style={styles.buttonRow}>
          <Button title="-" onPress={decrement} />
          <Button title="Reset" onPress={reset} />
          <Button title="+" onPress={increment} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. useToggle Hook</Text>
        <Text>Is Open: {isOpen ? 'Yes' : 'No'}</Text>
        <View style={styles.buttonRow}>
          <Button title="Toggle" onPress={toggle} />
          <Button title="Open" onPress={setTrue} />
          <Button title="Close" onPress={setFalse} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. useDebounce Hook</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Type to see debounce"
          style={styles.input}
        />
        <Text>Query: {searchQuery}</Text>
        <Text>Debounced (500ms): {debouncedQuery}</Text>
        <Text style={styles.note}>
          Debounced value updates 500ms after you stop typing
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. usePrevious Hook</Text>
        <Text>Current: {currentValue}</Text>
        <Text>Previous: {previousValue ?? 'N/A'}</Text>
        <Button
          title="Increment"
          onPress={() => setCurrentValue(currentValue + 1)}
        />
      </View>
    </View>
  );
};

// ============================================
// PRODUCTION EXAMPLE: useFetch Hook
// ============================================

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useFetch = <T,>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Mock data
      setData({ message: 'Data loaded!' } as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const ProductionHooksExample = () => {
  const { data, loading, error, refetch } = useFetch<{ message: string }>(
    'https://api.example.com/data'
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Production Hook Example</Text>
      <Text style={styles.sectionTitle}>useFetch Hook</Text>

      {loading && <ActivityIndicator size="large" />}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {data && <Text>{data.message}</Text>}

      <Button title="Refetch" onPress={refetch} />
    </View>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const HooksExampleApp = () => {
  const [activeTab, setActiveTab] = useState<
    | 'useState'
    | 'useEffect'
    | 'useRef'
    | 'useCallback'
    | 'useMemo'
    | 'custom'
    | 'production'
  >('useState');

  const tabs = [
    { id: 'useState', label: 'useState' },
    { id: 'useEffect', label: 'useEffect' },
    { id: 'useRef', label: 'useRef' },
    { id: 'useCallback', label: 'useCallback' },
    { id: 'useMemo', label: 'useMemo' },
    { id: 'custom', label: 'Custom' },
    { id: 'production', label: 'Production' },
  ] as const;

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>React Hooks Examples</Text>

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

      <ScrollView style={styles.content}>
        {activeTab === 'useState' && <UseStateExample />}
        {activeTab === 'useEffect' && <UseEffectExample />}
        {activeTab === 'useRef' && <UseRefExample />}
        {activeTab === 'useCallback' && <UseCallbackExample />}
        {activeTab === 'useMemo' && <UseMemoExample />}
        {activeTab === 'custom' && <CustomHooksExample />}
        {activeTab === 'production' && <ProductionHooksExample />}
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
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196f3',
    marginBottom: 15,
  },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4caf50',
    marginBottom: 10,
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
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    marginTop: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 5,
  },
  childButton: {
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  note: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  error: {
    color: '#f44336',
    marginTop: 10,
  },
});

export default HooksExampleApp;


