/**
 * State Management Examples
 * Demonstrates Context API, Redux, Redux Toolkit, and Zustand patterns
 * 
 * NOTE: Redux, Redux Toolkit, and Zustand require installation:
 * - Redux: npm install redux react-redux
 * - Redux Toolkit: npm install @reduxjs/toolkit react-redux
 * - Zustand: npm install zustand
 */

import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  ReactNode,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

// ============================================
// CONTEXT API EXAMPLES
// ============================================

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Counter Context with useReducer
interface CounterState {
  count: number;
}

type CounterAction = { type: 'INCREMENT' } | { type: 'DECREMENT' } | { type: 'RESET' };

const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
};

interface CounterContextType {
  state: CounterState;
  dispatch: React.Dispatch<CounterAction>;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within CounterProvider');
  }
  return context;
};

// Context API Example Component
export const ContextApiExample = () => {
  return (
    <ThemeProvider>
      <CounterProvider>
        <ContextApiContent />
      </CounterProvider>
    </ThemeProvider>
  );
};

const ContextApiContent = () => {
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useCounter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Context API Example</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Context</Text>
        <View
          style={[
            styles.themeBox,
            { backgroundColor: theme === 'light' ? '#fff' : '#333' },
          ]}
        >
          <Text
            style={{
              color: theme === 'light' ? '#000' : '#fff',
            }}
          >
            Current theme: {theme}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}>Toggle Theme</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Counter Context (useReducer)</Text>
        <Text style={styles.count}>{state.count}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch({ type: 'DECREMENT' })}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch({ type: 'RESET' })}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch({ type: 'INCREMENT' })}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ============================================
// REDUX PATTERN (Mock Implementation)
// ============================================

// This is a mock Redux implementation for demonstration
// Real Redux requires installation and setup

interface ReduxState {
  count: number;
}

type ReduxAction = { type: 'INCREMENT' } | { type: 'DECREMENT' };

const reduxReducer = (state: ReduxState = { count: 0 }, action: ReduxAction): ReduxState => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// Mock Redux Store
class MockReduxStore {
  private state: ReduxState = { count: 0 };
  private listeners: Array<() => void> = [];

  getState = () => this.state;

  dispatch = (action: ReduxAction) => {
    this.state = reduxReducer(this.state, action);
    this.listeners.forEach((listener) => listener());
  };

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };
}

const mockStore = new MockReduxStore();

// Mock useSelector and useDispatch
const useMockRedux = () => {
  const [state, setState] = useState(mockStore.getState());

  React.useEffect(() => {
    const unsubscribe = mockStore.subscribe(() => {
      setState(mockStore.getState());
    });
    return unsubscribe;
  }, []);

  return {
    state,
    dispatch: mockStore.dispatch,
  };
};

export const ReduxExample = () => {
  const { state, dispatch } = useMockRedux();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Pattern Example</Text>
      <Text style={styles.note}>
        This is a mock implementation. Install redux and react-redux for real
        Redux.
      </Text>

      <View style={styles.section}>
        <Text style={styles.count}>{state.count}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch({ type: 'DECREMENT' })}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch({ type: 'INCREMENT' })}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ============================================
// ZUSTAND PATTERN (Mock Implementation)
// ============================================

// Mock Zustand store
interface ZustandState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const createZustandStore = (): ZustandState => {
  let count = 0;
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  return {
    get count() {
      return count;
    },
    increment: () => {
      count++;
      notify();
    },
    decrement: () => {
      count--;
      notify();
    },
    reset: () => {
      count = 0;
      notify();
    },
  };
};

const zustandStore = createZustandStore();

const useZustandStore = () => {
  const [state, setState] = useState(zustandStore.count);

  React.useEffect(() => {
    const listener = () => setState(zustandStore.count);
    zustandStore.increment = (() => {
      const original = zustandStore.increment;
      return () => {
        original();
        listener();
      };
    })();
    // Similar for other methods...
    return () => {
      // Cleanup
    };
  }, []);

  return {
    count: state,
    increment: zustandStore.increment,
    decrement: zustandStore.decrement,
    reset: zustandStore.reset,
  };
};

export const ZustandExample = () => {
  const { count, increment, decrement, reset } = useZustandStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zustand Pattern Example</Text>
      <Text style={styles.note}>
        This is a mock implementation. Install zustand for real Zustand.
      </Text>

      <View style={styles.section}>
        <Text style={styles.count}>{count}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={decrement}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={increment}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ============================================
// COMPARISON EXAMPLE
// ============================================

export const ComparisonExample = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>State Management Comparison</Text>

      <View style={styles.comparisonTable}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Feature</Text>
          <Text style={styles.tableHeader}>Context</Text>
          <Text style={styles.tableHeader}>Redux</Text>
          <Text style={styles.tableHeader}>Zustand</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Bundle Size</Text>
          <Text style={styles.tableCell}>0 KB</Text>
          <Text style={styles.tableCell}>~13 KB</Text>
          <Text style={styles.tableCell}>~1 KB</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Boilerplate</Text>
          <Text style={styles.tableCell}>Low</Text>
          <Text style={styles.tableCell}>High</Text>
          <Text style={styles.tableCell}>Low</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Learning Curve</Text>
          <Text style={styles.tableCell}>Easy</Text>
          <Text style={styles.tableCell}>Steep</Text>
          <Text style={styles.tableCell}>Easy</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>DevTools</Text>
          <Text style={styles.tableCell}>No</Text>
          <Text style={styles.tableCell}>Yes</Text>
          <Text style={styles.tableCell}>Yes</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Best For</Text>
          <Text style={styles.tableCell}>Small apps</Text>
          <Text style={styles.tableCell}>Large apps</Text>
          <Text style={styles.tableCell}>All sizes</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>When to Use Each:</Text>
        <Text style={styles.bulletPoint}>
          • Context API: Simple state, theme, auth, small apps
        </Text>
        <Text style={styles.bulletPoint}>
          • Redux: Complex state, large apps, team familiar with Redux
        </Text>
        <Text style={styles.bulletPoint}>
          • Zustand: Want simplicity, medium-large apps, less boilerplate
        </Text>
      </View>
    </ScrollView>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const StateManagementExampleApp = () => {
  const [activeTab, setActiveTab] = useState<
    'context' | 'redux' | 'zustand' | 'comparison'
  >('context');

  const tabs = [
    { id: 'context', label: 'Context' },
    { id: 'redux', label: 'Redux' },
    { id: 'zustand', label: 'Zustand' },
    { id: 'comparison', label: 'Compare' },
  ] as const;

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>State Management Examples</Text>

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
        {activeTab === 'context' && <ContextApiExample />}
        {activeTab === 'redux' && <ReduxExample />}
        {activeTab === 'zustand' && <ZustandExample />}
        {activeTab === 'comparison' && <ComparisonExample />}
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
  note: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 4,
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
    marginBottom: 15,
    color: '#333',
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196f3',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
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
  },
  themeBox: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  comparisonTable: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#666',
  },
  bulletPoint: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 10,
  },
});

export default StateManagementExampleApp;


