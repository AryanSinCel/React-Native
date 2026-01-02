# State Management in React Native - Complete Guide

This guide covers all major state management solutions for React Native applications.

## 📋 Table of Contents
1. [Context API](#context-api)
2. [Redux](#redux)
3. [Redux Toolkit](#redux-toolkit)
4. [Zustand](#zustand)
5. [Best Practices](#best-practices)

---

## 🎯 Context API {#context-api}

Context API is React's built-in solution for sharing state across components.

### Basic Context Setup

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Create Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Create Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// 4. Usage
const App = () => {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
};

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme === 'light' ? '#fff' : '#000' }}>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};
```

### Multiple Contexts

```tsx
// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // Login logic
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usage
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MyApp />
      </AuthProvider>
    </ThemeProvider>
  );
};
```

### Context with useReducer

```tsx
import { useReducer, createContext, useContext } from 'react';

interface State {
  count: number;
  todos: string[];
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'REMOVE_TODO'; payload: number };

const initialState: State = {
  count: 0,
  todos: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter((_, i) => i !== action.payload),
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Usage
const Counter = () => {
  const { state, dispatch } = useApp();
  
  return (
    <View>
      <Text>{state.count}</Text>
      <Button title="+" onPress={() => dispatch({ type: 'INCREMENT' })} />
      <Button title="-" onPress={() => dispatch({ type: 'DECREMENT' })} />
    </View>
  );
};
```

### Performance Optimization

```tsx
// Split contexts to prevent unnecessary re-renders
const UserContext = createContext<User | null>(null);
const UserActionsContext = createContext<UserActions | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Memoize actions to prevent re-renders
  const actions = useMemo(
    () => ({
      updateUser: (userData: User) => setUser(userData),
      clearUser: () => setUser(null),
    }),
    []
  );

  return (
    <UserContext.Provider value={user}>
      <UserActionsContext.Provider value={actions}>
        {children}
      </UserActionsContext.Provider>
    </UserContext.Provider>
  );
};
```

---

## 🔄 Redux {#redux}

Redux is a predictable state container for JavaScript apps.

### Installation

```bash
npm install redux react-redux
npm install --save-dev @types/react-redux
```

### Basic Redux Setup

```tsx
// store/types.ts
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const ADD_TODO = 'ADD_TODO';

// store/actions.ts
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });
export const addTodo = (text: string) => ({ type: ADD_TODO, payload: text });

// store/reducer.ts
interface State {
  count: number;
  todos: string[];
}

const initialState: State = {
  count: 0,
  todos: [],
};

const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    case ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload] };
    default:
      return state;
  }
};

export default reducer;

// store/index.ts
import { createStore } from 'redux';
import reducer from './reducer';

export const store = createStore(reducer);

// App.tsx
import { Provider } from 'react-redux';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <MyApp />
    </Provider>
  );
};

// Component usage
import { useSelector, useDispatch } from 'react-redux';

const Counter = () => {
  const count = useSelector((state: State) => state.count);
  const dispatch = useDispatch();

  return (
    <View>
      <Text>{count}</Text>
      <Button
        title="+"
        onPress={() => dispatch(increment())}
      />
      <Button
        title="-"
        onPress={() => dispatch(decrement())}
      />
    </View>
  );
};
```

### Redux with TypeScript

```tsx
// store/types.ts
export interface RootState {
  counter: CounterState;
  todos: TodosState;
}

export interface CounterState {
  count: number;
}

export interface TodosState {
  items: string[];
}

// store/actions.ts
export interface IncrementAction {
  type: 'INCREMENT';
}

export interface DecrementAction {
  type: 'DECREMENT';
}

export interface AddTodoAction {
  type: 'ADD_TODO';
  payload: string;
}

export type CounterAction = IncrementAction | DecrementAction;
export type TodoAction = AddTodoAction;

// store/reducers/counterReducer.ts
const counterReducer = (
  state: CounterState = { count: 0 },
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// store/reducers/index.ts
import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import todosReducer from './todosReducer';

export const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer,
});

// store/index.ts
import { createStore } from 'redux';
import { rootReducer } from './reducers';

export const store = createStore(rootReducer);
export type AppDispatch = typeof store.dispatch;
```

---

## 🛠️ Redux Toolkit {#redux-toolkit}

Redux Toolkit is the official, opinionated way to write Redux logic.

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### Basic Redux Toolkit Setup

```tsx
// store/slices/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

// store/slices/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = {
  items: [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;
export default todosSlice.reducer;

// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import todosReducer from './slices/todosSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// App.tsx
import { Provider } from 'react-redux';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <MyApp />
    </Provider>
  );
};

// Component usage
import { useAppSelector, useAppDispatch } from './hooks';
import { increment, decrement } from './store/slices/counterSlice';

const Counter = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <View>
      <Text>{count}</Text>
      <Button title="+" onPress={() => dispatch(increment())} />
      <Button title="-" onPress={() => dispatch(decrement())} />
    </View>
  );
};
```

### Async Actions with Redux Toolkit

```tsx
// store/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return response.json();
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default usersSlice.reducer;

// Usage
const UsersList = () => {
  const { users, loading, error } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
};
```

---

## 🐻 Zustand {#zustand}

Zustand is a small, fast, and scalable state management solution.

### Installation

```bash
npm install zustand
```

### Basic Zustand Setup

```tsx
// store/useCounterStore.ts
import create from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage
const Counter = () => {
  const { count, increment, decrement, reset } = useCounterStore();

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

### Zustand with Async Actions

```tsx
// store/useUsersStore.ts
import create from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  removeUser: (id: number) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await response.json();
      set({ users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (id) =>
    set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
}));

// Usage
const UsersList = () => {
  const { users, loading, error, fetchUsers } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
};
```

### Zustand with Middleware

```tsx
import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface AppState {
  count: number;
  increment: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      {
        name: 'app-storage', // Storage key
      }
    )
  )
);
```

### Zustand Selectors (Performance)

```tsx
// Only re-render when specific value changes
const Counter = () => {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <View>
      <Text>{count}</Text>
      <Button title="+" onPress={increment} />
    </View>
  );
};
```

---

## ✅ Best Practices {#best-practices}

### 1. Choose the Right Solution

**Use Context API when:**
- Simple state sharing
- Theme/UI state
- Authentication state
- Small to medium apps

**Use Redux/Redux Toolkit when:**
- Complex state logic
- Large applications
- Need time-travel debugging
- Team familiar with Redux

**Use Zustand when:**
- Want simplicity
- Medium to large apps
- Need performance
- Prefer less boilerplate

### 2. State Structure

```tsx
// Good: Flat, normalized state
interface AppState {
  users: { [id: string]: User };
  posts: { [id: string]: Post };
  currentUserId: string | null;
}

// Bad: Nested, denormalized
interface BadState {
  user: {
    posts: {
      comments: Comment[];
    }[];
  };
}
```

### 3. Keep State Minimal

```tsx
// Good: Store only what you need
interface State {
  userId: string;
  // Don't store derived data
}

// Bad: Storing computed values
interface BadState {
  userId: string;
  userName: string; // Can be derived
  userEmail: string; // Can be derived
}
```

### 4. Use Selectors

```tsx
// Good: Memoized selectors
const selectUserById = (state: RootState, id: string) =>
  state.users[id];

// Usage
const user = useAppSelector((state) => selectUserById(state, userId));
```

### 5. Normalize Data

```tsx
// Normalize API responses
const normalizeUsers = (users: User[]) => {
  return users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<string, User>);
};
```

### 6. Avoid Prop Drilling

```tsx
// Bad: Prop drilling
<App>
  <Header user={user} />
  <Content user={user} />
  <Footer user={user} />
</App>

// Good: Use context/store
const Header = () => {
  const user = useUser(); // From context or store
  // ...
};
```

### 7. Performance Optimization

```tsx
// Memoize selectors
import { createSelector } from '@reduxjs/toolkit';

const selectUsers = (state: RootState) => state.users;
const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter(u => u.active)
);
```

### 8. Type Safety

```tsx
// Always use TypeScript
interface State {
  // Define types
}

type Action = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' };
```

---

## 📊 Comparison Table

| Feature | Context API | Redux | Redux Toolkit | Zustand |
|---------|-------------|-------|---------------|---------|
| **Bundle Size** | 0 KB | ~13 KB | ~13 KB | ~1 KB |
| **Boilerplate** | Low | High | Medium | Low |
| **Learning Curve** | Easy | Steep | Medium | Easy |
| **DevTools** | No | Yes | Yes | Yes |
| **Performance** | Medium | Good | Good | Excellent |
| **TypeScript** | Good | Excellent | Excellent | Excellent |
| **Async Actions** | Manual | Thunks | Built-in | Built-in |
| **Best For** | Small apps | Large apps | Large apps | All sizes |

---

This guide covers all essential state management concepts! 🚀


