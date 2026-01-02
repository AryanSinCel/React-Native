# Custom Hooks Library

This directory contains reusable custom hooks that can be used throughout your React Native application.

## 📁 Available Hooks

### 1. `useCounter.ts`
Counter functionality with increment, decrement, and reset.

```tsx
import { useCounter } from './hooks/useCounter';

const MyComponent = () => {
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

### 2. `useToggle.ts`
Toggle functionality with multiple control methods.

```tsx
import { useToggle } from './hooks/useToggle';

const MyComponent = () => {
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

### 3. `useDebounce.ts`
Delays updating a value until after a specified delay (useful for search inputs).

```tsx
import { useDebounce } from './hooks/useDebounce';

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

### 4. `usePrevious.ts`
Returns the previous value of a state or prop.

```tsx
import { usePrevious } from './hooks/usePrevious';

const MyComponent = ({ count }: { count: number }) => {
  const prevCount = usePrevious(count);
  
  return (
    <View>
      <Text>Current: {count}</Text>
      <Text>Previous: {prevCount ?? 'N/A'}</Text>
    </View>
  );
};
```

### 5. `useInterval.ts`
Runs a callback at specified intervals.

```tsx
import { useInterval } from './hooks/useInterval';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  useInterval(
    () => {
      setSeconds(prev => prev + 1);
    },
    isRunning ? 1000 : null // null stops the interval
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

### 6. `useFetch.ts`
Fetches data from an API with loading and error states.

```tsx
import { useFetch } from './hooks/useFetch';

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

## 🚀 Usage

1. Import the hook you need:
```tsx
import { useCounter } from './hooks/useCounter';
```

2. Use it in your component:
```tsx
const MyComponent = () => {
  const { count, increment } = useCounter(0);
  // ... use the hook
};
```

## 📝 Adding New Hooks

When creating a new custom hook:

1. Create a new file in the `hooks/` directory
2. Name it starting with `use` (e.g., `useMyHook.ts`)
3. Export the hook function
4. Add TypeScript types for parameters and return values
5. Document usage in this README

## 💡 Best Practices

- Always use TypeScript for type safety
- Use `useCallback` for functions returned from hooks
- Use `useMemo` when appropriate for computed values
- Clean up effects (timers, subscriptions, etc.)
- Include JSDoc comments for complex hooks

## 🔗 Related Documentation

- See `REACT_HOOKS_GUIDE.md` for detailed explanations
- See `examples/HooksExample.tsx` for usage examples


