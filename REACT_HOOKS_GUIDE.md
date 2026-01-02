# React Hooks Complete Guide with Examples

Hooks are functions that let you "hook into" React features from functional components. They were introduced in React 16.8.

## 📋 Table of Contents
1. [useState](#usestate)
2. [useEffect](#useeffect)
3. [useRef](#useref)
4. [useCallback](#usecallback)
5. [useMemo](#usememo)
6. [Custom Hooks](#custom-hooks)
7. [Real Production Examples](#production-examples)

---

## 🎣 useState {#usestate}

`useState` lets you add state to functional components.

### Basic Syntax

```tsx
const [state, setState] = useState(initialValue);
```

### Basic Example

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} />
    </View>
  );
};
```

### Multiple State Variables

```tsx
const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  return (
    <View>
      <TextInput value={name} onChangeText={setName} />
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={age.toString()} onChangeText={(text) => setAge(parseInt(text) || 0)} />
    </View>
  );
};
```

### Object State

```tsx
const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0,
  });

  const updateName = (name: string) => {
    setUser({ ...user, name }); // Spread operator to preserve other fields
  };

  return (
    <View>
      <TextInput
        value={user.name}
        onChangeText={updateName}
      />
    </View>
  );
};
```

### Array State

```tsx
const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    setTodos([...todos, input]); // Add new item
    setInput('');
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index)); // Remove item
  };

  return (
    <View>
      {/* Todo list UI */}
    </View>
  );
};
```

### Functional Updates

When the new state depends on the previous state, use a function:

```tsx
const Counter = () => {
  const [count, setCount] = useState(0);

  // ❌ WRONG - Multiple rapid updates might not work
  const incrementMultiple = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Only increments by 1!
  };

  // ✅ CORRECT - Use functional updates
  const incrementMultipleCorrect = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // Correctly increments by 3
  };

  return <View>{/* UI */}</View>;
};
```

### Lazy Initial State

If the initial state is expensive to compute, use a function:

```tsx
const ExpensiveComponent = () => {
  // ❌ Runs on every render
  const [data, setData] = useState(expensiveComputation());

  // ✅ Only runs once
  const [data, setData] = useState(() => expensiveComputation());

  return <View>{/* UI */}</View>;
};
```

---

## 🔄 useEffect {#useeffect}

`useEffect` lets you perform side effects in functional components (like API calls, subscriptions, DOM manipulation).

### Basic Syntax

```tsx
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);
```

### Component Did Mount (Run Once)

```tsx
useEffect(() => {
  console.log('Component mounted');
  // Fetch data, setup subscriptions, etc.
}, []); // Empty dependency array = run once
```

### Component Did Update (Run on Changes)

```tsx
const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Runs whenever userId changes
    fetchUser(userId).then(setUser);
  }, [userId]); // Re-run when userId changes

  return <View>{/* UI */}</View>;
};
```

### Component Will Unmount (Cleanup)

```tsx
const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []); // Empty array = run once, cleanup on unmount

  return <Text>{seconds}</Text>;
};
```

### Multiple Effects

```tsx
const Component = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Effect 1: Runs when count changes
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  // Effect 2: Runs when name changes
  useEffect(() => {
    console.log('Name changed:', name);
  }, [name]);

  // Effect 3: Runs on mount and cleanup on unmount
  useEffect(() => {
    const subscription = subscribe();
    return () => subscription.unsubscribe();
  }, []);

  return <View>{/* UI */}</View>;
};
```

### Fetching Data

```tsx
const DataFetcher = ({ url }: { url: string }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup: cancel if component unmounts
    return () => {
      cancelled = true;
    };
  }, [url]); // Re-fetch when URL changes

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  return <Text>{JSON.stringify(data)}</Text>;
};
```

### Effect with Dependencies

```tsx
const SearchResults = ({ query }: { query: string }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchAPI(query).then(setResults);
    }, 300);

    // Cleanup: cancel timeout if query changes before timeout completes
    return () => clearTimeout(timeoutId);
  }, [query]); // Re-run when query changes

  return <View>{/* Results */}</View>;
};
```

### Common Patterns

#### 1. Skip Effect on Initial Render

```tsx
const Component = ({ value }: { value: number }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (prevValue !== value) {
      setHasChanged(true);
      setPrevValue(value);
    }
  }, [value, prevValue]);

  return <View>{/* UI */}</View>;
};
```

#### 2. Effect with Ref to Track Previous Value

```tsx
const Component = ({ value }: { value: number }) => {
  const prevValueRef = useRef<number>();

  useEffect(() => {
    if (prevValueRef.current !== undefined) {
      console.log('Value changed from', prevValueRef.current, 'to', value);
    }
    prevValueRef.current = value;
  }, [value]);

  return <View>{/* UI */}</View>;
};
```

---

## 🔗 useRef {#useref}

`useRef` returns a mutable ref object that persists across renders. It doesn't cause re-renders when changed.

### Basic Syntax

```tsx
const ref = useRef(initialValue);
```

### Accessing DOM Elements (TextInput)

```tsx
const Form = () => {
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);

  const focusEmail = () => {
    emailInputRef.current?.focus();
  };

  return (
    <View>
      <TextInput
        ref={nameInputRef}
        placeholder="Name"
        onSubmitEditing={focusEmail}
      />
      <TextInput
        ref={emailInputRef}
        placeholder="Email"
      />
    </View>
  );
};
```

### Storing Mutable Values

```tsx
const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (intervalRef.current) return; // Already running

    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <View>
      <Text>{seconds}</Text>
      <Button title="Start" onPress={startTimer} />
      <Button title="Stop" onPress={stopTimer} />
    </View>
  );
};
```

### Tracking Previous Values

```tsx
const Component = ({ count }: { count: number }) => {
  const prevCountRef = useRef<number>();

  useEffect(() => {
    prevCountRef.current = count;
  });

  const prevCount = prevCountRef.current;

  return (
    <View>
      <Text>Current: {count}</Text>
      <Text>Previous: {prevCount ?? 'N/A'}</Text>
    </View>
  );
};
```

### Storing Callback References

```tsx
const Component = () => {
  const callbackRef = useRef<() => void>();

  useEffect(() => {
    callbackRef.current = () => {
      console.log('Latest callback');
    };
  });

  const handlePress = () => {
    callbackRef.current?.();
  };

  return <Button title="Press" onPress={handlePress} />;
};
```

### Avoiding Stale Closures

```tsx
const Component = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // Keep ref in sync with state
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Use ref to get latest value without dependency
      console.log('Current count:', countRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // No dependency on count

  return <View>{/* UI */}</View>;
};
```

---

## 🎯 useCallback {#usecallback}

`useCallback` returns a memoized callback function. It only changes when dependencies change.

### Basic Syntax

```tsx
const memoizedCallback = useCallback(
  () => {
    // Function body
  },
  [dependencies]
);
```

### Why Use useCallback?

Without `useCallback`, a new function is created on every render, which can cause child components to re-render unnecessarily.

```tsx
// ❌ WRONG - New function on every render
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('Clicked');
  };

  return <Child onClick={handleClick} />; // Child re-renders every time
};

// ✅ CORRECT - Function only changes when dependencies change
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Empty deps = never changes

  return <Child onClick={handleClick} />; // Child doesn't re-render unnecessarily
};
```

### Basic Example

```tsx
const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  const addTodo = useCallback((text: string) => {
    setTodos(prev => [...prev, text]);
  }, []); // No dependencies

  const removeTodo = useCallback((index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  }, []); // No dependencies

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => todo.includes(filter));
  }, [todos, filter]);

  return (
    <View>
      <TextInput value={filter} onChangeText={setFilter} />
      {filteredTodos.map((todo, index) => (
        <TodoItem
          key={index}
          todo={todo}
          onRemove={() => removeTodo(index)}
        />
      ))}
    </View>
  );
};
```

### With Dependencies

```tsx
const SearchComponent = ({ userId }: { userId: string }) => {
  const [query, setQuery] = useState('');

  const performSearch = useCallback(async () => {
    const results = await searchAPI(userId, query);
    // Handle results
  }, [userId, query]); // Re-create when userId or query changes

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, performSearch]);

  return <TextInput value={query} onChangeText={setQuery} />;
};
```

### Passing to Child Components

```tsx
// Child component (memoized to prevent unnecessary re-renders)
const TodoItem = React.memo(({ 
  todo, 
  onRemove 
}: { 
  todo: string; 
  onRemove: () => void;
}) => {
  return (
    <View>
      <Text>{todo}</Text>
      <Button title="Remove" onPress={onRemove} />
    </View>
  );
});

// Parent component
const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([]);

  const handleRemove = useCallback((index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  }, []); // Stable reference

  return (
    <View>
      {todos.map((todo, index) => (
        <TodoItem
          key={index}
          todo={todo}
          onRemove={() => handleRemove(index)}
        />
      ))}
    </View>
  );
};
```

### Common Pitfall

```tsx
// ❌ WRONG - Creates new function every time
const handleClick = useCallback(() => {
  doSomething(count);
}, []); // Missing count in dependencies

// ✅ CORRECT - Includes all dependencies
const handleClick = useCallback(() => {
  doSomething(count);
}, [count]); // count in dependencies
```

---

## 💾 useMemo {#usememo}

`useMemo` returns a memoized value. It only recomputes when dependencies change.

### Basic Syntax

```tsx
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
```

### Why Use useMemo?

Prevents expensive calculations on every render.

```tsx
// ❌ WRONG - Recalculates on every render
const Component = ({ items }: { items: number[] }) => {
  const expensiveValue = items.reduce((sum, item) => sum + item * 2, 0);

  return <Text>{expensiveValue}</Text>;
};

// ✅ CORRECT - Only recalculates when items change
const Component = ({ items }: { items: number[] }) => {
  const expensiveValue = useMemo(
    () => items.reduce((sum, item) => sum + item * 2, 0),
    [items]
  );

  return <Text>{expensiveValue}</Text>;
};
```

### Basic Example

```tsx
const ExpensiveComponent = ({ data }: { data: number[] }) => {
  const sortedData = useMemo(() => {
    console.log('Sorting data...');
    return [...data].sort((a, b) => a - b);
  }, [data]); // Only sort when data changes

  const sum = useMemo(() => {
    return sortedData.reduce((acc, val) => acc + val, 0);
  }, [sortedData]);

  return (
    <View>
      <Text>Sum: {sum}</Text>
    </View>
  );
};
```

### Filtering and Sorting

```tsx
const ProductList = ({ 
  products, 
  filter, 
  sortBy 
}: { 
  products: Product[]; 
  filter: string; 
  sortBy: string;
}) => {
  const filteredAndSorted = useMemo(() => {
    let result = products;

    // Filter
    if (filter) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, filter, sortBy]);

  return (
    <View>
      {filteredAndSorted.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </View>
  );
};
```

### Memoizing Objects/Arrays

```tsx
const Component = ({ userId }: { userId: string }) => {
  // ❌ WRONG - New object on every render
  const config = {
    userId,
    apiKey: 'abc123',
  };

  // ✅ CORRECT - Same object reference unless userId changes
  const config = useMemo(
    () => ({
      userId,
      apiKey: 'abc123',
    }),
    [userId]
  );

  useEffect(() => {
    // This effect won't run unnecessarily
    doSomething(config);
  }, [config]);

  return <View>{/* UI */}</View>;
};
```

### When NOT to Use useMemo

```tsx
// ❌ DON'T - Simple calculations don't need memoization
const Component = ({ a, b }: { a: number; b: number }) => {
  const sum = useMemo(() => a + b, [a, b]); // Overhead > benefit
  return <Text>{sum}</Text>;
};

// ✅ DO - Simple is better
const Component = ({ a, b }: { a: number; b: number }) => {
  const sum = a + b;
  return <Text>{sum}</Text>;
};
```

---

## 🎨 Custom Hooks {#custom-hooks}

Custom hooks let you extract component logic into reusable functions. They must start with "use".

### Basic Custom Hook

```tsx
// useCounter.ts
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

// Usage
const Counter = () => {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <View>
      <Text>{count}</Text>
      <Button title="+" onPress={increment} />
      <Button title="-" onPress={decrement} />
      <Button title="Reset" onPress={reset} />
    </View>
  );
};
```

### useFetch Hook

```tsx
// useFetch.ts
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const useFetch = <T,>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Usage
const UserProfile = ({ userId }: { userId: string }) => {
  const { data, loading, error, refetch } = useFetch<User>(
    `https://api.example.com/users/${userId}`
  );

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data) return null;

  return (
    <View>
      <Text>{data.name}</Text>
      <Button title="Refresh" onPress={refetch} />
    </View>
  );
};
```

### useLocalStorage Hook (AsyncStorage)

```tsx
// useAsyncStorage.ts
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

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error saving to storage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, loading] as const;
};

// Usage
const Settings = () => {
  const [theme, setTheme, loading] = useAsyncStorage('theme', 'light');

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Current theme: {theme}</Text>
      <Button title="Toggle" onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
    </View>
  );
};
```

### useDebounce Hook

```tsx
// useDebounce.ts
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

// Usage
const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <TextInput
      value={query}
      onChangeText={setQuery}
      placeholder="Search..."
    />
  );
};
```

### usePrevious Hook

```tsx
// usePrevious.ts
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// Usage
const Component = ({ count }: { count: number }) => {
  const prevCount = usePrevious(count);

  return (
    <View>
      <Text>Current: {count}</Text>
      <Text>Previous: {prevCount ?? 'N/A'}</Text>
    </View>
  );
};
```

### useToggle Hook

```tsx
// useToggle.ts
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, setTrue, setFalse }] as const;
};

// Usage
const Component = () => {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);

  return (
    <View>
      <Text>{isOpen ? 'Open' : 'Closed'}</Text>
      <Button title="Toggle" onPress={toggle} />
      <Button title="Open" onPress={setTrue} />
      <Button title="Close" onPress={setFalse} />
    </View>
  );
};
```

### useInterval Hook

```tsx
// useInterval.ts
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current?.();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
};

// Usage
const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setSeconds(prev => prev + 1);
    },
    isRunning ? 1000 : null
  );

  return (
    <View>
      <Text>{seconds}</Text>
      <Button
        title={isRunning ? 'Stop' : 'Start'}
        onPress={() => setIsRunning(!isRunning)}
      />
    </View>
  );
};
```

---

## 🏭 Real Production Examples {#production-examples}

### Example 1: Authentication Hook

```tsx
// useAuth.ts
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const user = await validateToken(token);
          setAuthState({ user, loading: false, error: null });
        } else {
          setAuthState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: 'Failed to check authentication',
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { token, user } = await loginAPI(email, password);
      await AsyncStorage.setItem('authToken', token);
      setAuthState({ user, loading: false, error: null });
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: error.message,
      });
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('authToken');
    setAuthState({ user: null, loading: false, error: null });
  }, []);

  return {
    ...authState,
    login,
    logout,
    isAuthenticated: !!authState.user,
  };
};

// Usage
const LoginScreen = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <View>
      {/* Login form */}
    </View>
  );
};
```

### Example 2: Form Hook with Validation

```tsx
// useForm.ts
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
}

const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule>>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields = {} as Record<keyof T, FormField>;
    Object.keys(initialValues).forEach(key => {
      initialFields[key as keyof T] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    });
    return initialFields;
  });

  const validate = useCallback(
    (name: keyof T, value: any): string | null => {
      const rule = validationRules[name];
      if (!rule) return null;

      if (rule.required && (!value || value.toString().trim() === '')) {
        return 'This field is required';
      }

      if (rule.minLength && value.toString().length < rule.minLength) {
        return `Minimum length is ${rule.minLength}`;
      }

      if (rule.maxLength && value.toString().length > rule.maxLength) {
        return `Maximum length is ${rule.maxLength}`;
      }

      if (rule.pattern && !rule.pattern.test(value.toString())) {
        return 'Invalid format';
      }

      if (rule.custom) {
        return rule.custom(value);
      }

      return null;
    },
    [validationRules]
  );

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));
      setFields(prev => ({
        ...prev,
        [name]: {
          value,
          error: validate(name, value),
          touched: true,
        },
      }));
    },
    [validate]
  );

  const setError = useCallback((name: keyof T, error: string) => {
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], error },
    }));
  }, []);

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(values).forEach(key => {
      const error = validate(key as keyof T, values[key as keyof T]);
      if (error) {
        isValid = false;
        newFields[key as keyof T] = {
          ...newFields[key as keyof T],
          error,
          touched: true,
        };
      }
    });

    setFields(newFields);
    return isValid;
  }, [values, fields, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setFields(() => {
      const initialFields = {} as Record<keyof T, FormField>;
      Object.keys(initialValues).forEach(key => {
        initialFields[key as keyof T] = {
          value: initialValues[key],
          error: null,
          touched: false,
        };
      });
      return initialFields;
    });
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.values(fields).every(field => !field.error);
  }, [fields]);

  return {
    values,
    fields,
    setValue,
    setError,
    validateAll,
    reset,
    isValid,
  };
};

// Usage
const SignupForm = () => {
  const { values, fields, setValue, validateAll, isValid } = useForm(
    {
      email: '',
      password: '',
      confirmPassword: '',
    },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 8,
      },
      confirmPassword: {
        required: true,
        custom: (value) =>
          value !== values.password ? 'Passwords do not match' : null,
      },
    }
  );

  const handleSubmit = () => {
    if (validateAll()) {
      // Submit form
    }
  };

  return (
    <View>
      <TextInput
        value={values.email}
        onChangeText={(text) => setValue('email', text)}
        placeholder="Email"
      />
      {fields.email.touched && fields.email.error && (
        <Text style={styles.error}>{fields.email.error}</Text>
      )}
      {/* More fields */}
    </View>
  );
};
```

### Example 3: Infinite Scroll Hook

```tsx
// useInfiniteScroll.ts
interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<T[]>;
  initialPage?: number;
  hasMore?: (data: T[]) => boolean;
}

const useInfiniteScroll = <T,>({
  fetchFn,
  initialPage = 1,
  hasMore = () => true,
}: UseInfiniteScrollOptions<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMoreData, setHasMoreData] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMoreData) return;

    try {
      setLoading(true);
      setError(null);
      const newData = await fetchFn(page);
      
      if (newData.length === 0) {
        setHasMoreData(false);
      } else {
        setData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
        setHasMoreData(hasMore(newData));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMoreData, fetchFn, hasMore]);

  const refresh = useCallback(async () => {
    setData([]);
    setPage(initialPage);
    setHasMoreData(true);
    setError(null);
    await loadMore();
  }, [initialPage, loadMore]);

  useEffect(() => {
    loadMore();
  }, []); // Load initial data

  return {
    data,
    loading,
    error,
    loadMore,
    refresh,
    hasMoreData,
  };
};

// Usage
const ProductList = () => {
  const { data, loading, loadMore, hasMoreData } = useInfiniteScroll({
    fetchFn: async (page) => {
      const response = await fetch(`/api/products?page=${page}`);
      return response.json();
    },
  });

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ProductItem product={item} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator /> : null
      }
    />
  );
};
```

### Example 4: Network Status Hook

```tsx
// useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Get initial state
    NetInfo.fetch().then(state => {
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
const App = () => {
  const { isConnected, isOffline } = useNetworkStatus();

  return (
    <View>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text>No internet connection</Text>
        </View>
      )}
      {/* Rest of app */}
    </View>
  );
};
```

---

## 🎯 Best Practices

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Include all dependencies** - Missing dependencies in useEffect/useCallback/useMemo can cause bugs
3. **Don't overuse useMemo/useCallback** - Only use when there's a performance benefit
4. **Custom hooks must start with "use"** - This is a React convention
5. **Clean up effects** - Always return cleanup functions from useEffect when needed
6. **Use functional updates** - When state depends on previous state, use the function form

---

This guide covers all essential React Hooks with practical examples! 🚀


