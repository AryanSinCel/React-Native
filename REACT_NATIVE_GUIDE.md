# React Native Complete Guide: Components, JSX, Props, State, Styling & Lists

## 📦 Table of Contents
1. [Components (Functional & Class)](#components)
2. [JSX Deep Explanation](#jsx)
3. [Props with Examples](#props)
4. [State with Examples](#state)
5. [Styling in React Native](#styling)
6. [Flexbox Layout in Depth](#flexbox)
7. [ScrollView vs FlatList vs SectionList](#lists)

---

## 🧩 Components (Functional & Class) {#components}

### Functional Components (Recommended - Modern Approach)

Functional components are JavaScript functions that return JSX. They're simpler, cleaner, and the recommended way to write React Native components.

#### Basic Functional Component

```tsx
import React from 'react';
import { View, Text } from 'react-native';

// Simple functional component
function WelcomeScreen() {
  return (
    <View>
      <Text>Welcome to React Native!</Text>
    </View>
  );
}

export default WelcomeScreen;
```

#### Functional Component with Arrow Function

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Arrow function component
const Button = () => {
  const handlePress = () => {
    console.log('Button pressed!');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>Click Me</Text>
    </TouchableOpacity>
  );
};

export default Button;
```

#### Functional Component with TypeScript

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserCardProps {
  name: string;
  age: number;
  email: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, age, email }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.age}>Age: {age}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 16,
    color: '#666',
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
});

export default UserCard;
```

---

### Class Components (Legacy - Still Supported)

Class components use ES6 classes and have access to lifecycle methods. They're less commonly used now but still supported.

#### Basic Class Component

```tsx
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class WelcomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to React Native!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default WelcomeScreen;
```

#### Class Component with State

```tsx
import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  decrement = () => {
    this.setState({ count: this.state.count - 1 });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.count}>{this.state.count}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Decrement" onPress={this.decrement} />
          <Button title="Increment" onPress={this.increment} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default Counter;
```

#### Class Component with Lifecycle Methods

```tsx
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class LifecycleExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Component created',
    };
    console.log('Constructor called');
  }

  componentDidMount() {
    console.log('Component mounted');
    this.setState({ message: 'Component mounted' });
  }

  componentDidUpdate() {
    console.log('Component updated');
  }

  componentWillUnmount() {
    console.log('Component will unmount');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LifecycleExample;
```

### When to Use Each

- **Functional Components**: Use for 99% of cases. Simpler, cleaner, better performance with hooks.
- **Class Components**: Only if you need specific lifecycle methods not available in hooks, or working with legacy code.

---

## 🎨 JSX Deep Explanation {#jsx}

JSX (JavaScript XML) is a syntax extension that lets you write HTML-like code in JavaScript.

### What is JSX?

JSX is **NOT** HTML. It's a syntax that gets transformed into JavaScript function calls.

#### JSX Transformation

```tsx
// This JSX:
<View style={styles.container}>
  <Text>Hello</Text>
</View>

// Gets transformed to:
React.createElement(
  View,
  { style: styles.container },
  React.createElement(Text, null, 'Hello')
);
```

### JSX Rules

#### 1. Must Return a Single Root Element

```tsx
// ❌ WRONG - Multiple root elements
function BadComponent() {
  return (
    <View>First</View>
    <View>Second</View>
  );
}

// ✅ CORRECT - Single root element
function GoodComponent() {
  return (
    <View>
      <View>First</View>
      <View>Second</View>
    </View>
  );
}

// ✅ CORRECT - Using Fragment (no extra View)
function GoodComponent2() {
  return (
    <>
      <View>First</View>
      <View>Second</View>
    </>
  );
}
```

#### 2. Self-Closing Tags Must Have `/`

```tsx
// ✅ CORRECT
<View />
<TextInput />
<Image />

// ❌ WRONG
<View>
<TextInput>
```

#### 3. Use `className` → `style` (React Native doesn't use className)

```tsx
// ❌ WRONG - className doesn't exist in React Native
<View className="container">

// ✅ CORRECT - Use style prop
<View style={styles.container}>
```

#### 4. JavaScript Expressions in JSX

```tsx
function ExpressionExample() {
  const name = 'John';
  const age = 25;
  const isActive = true;
  const items = ['Apple', 'Banana', 'Cherry'];

  return (
    <View>
      {/* String interpolation */}
      <Text>Hello, {name}!</Text>
      
      {/* Math expressions */}
      <Text>Age: {age + 5}</Text>
      
      {/* Conditional rendering */}
      {isActive && <Text>User is active</Text>}
      {!isActive && <Text>User is inactive</Text>}
      
      {/* Ternary operator */}
      <Text>{age >= 18 ? 'Adult' : 'Minor'}</Text>
      
      {/* Array mapping */}
      {items.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
      
      {/* Function calls */}
      <Text>{new Date().toLocaleDateString()}</Text>
    </View>
  );
}
```

#### 5. JSX Attributes (Props)

```tsx
function AttributeExample() {
  return (
    <View>
      {/* String props */}
      <Text testID="my-text">Hello</Text>
      
      {/* Number props */}
      <View style={{ width: 100, height: 100 }} />
      
      {/* Boolean props */}
      <TextInput editable={true} />
      <TextInput editable={false} />
      {/* Shorthand for boolean true */}
      <TextInput editable />
      
      {/* Object props */}
      <View style={{ backgroundColor: 'blue', padding: 10 }} />
      
      {/* Array props */}
      <View style={[{ padding: 10 }, { margin: 5 }]} />
      
      {/* Function props */}
      <TouchableOpacity onPress={() => console.log('Pressed')} />
    </View>
  );
}
```

#### 6. Comments in JSX

```tsx
function CommentExample() {
  return (
    <View>
      {/* This is a comment in JSX */}
      <Text>Visible content</Text>
      {/* 
        Multi-line
        comment
      */}
    </View>
  );
}
```

#### 7. Conditional Rendering Patterns

```tsx
function ConditionalRendering() {
  const user = { name: 'John', isLoggedIn: true };
  const items = [];
  const error = null;

  return (
    <View>
      {/* Pattern 1: && operator */}
      {user.isLoggedIn && <Text>Welcome, {user.name}!</Text>}
      
      {/* Pattern 2: Ternary operator */}
      {user.isLoggedIn ? (
        <Text>Welcome back!</Text>
      ) : (
        <Text>Please log in</Text>
      )}
      
      {/* Pattern 3: Early return */}
      {items.length === 0 && <Text>No items</Text>}
      
      {/* Pattern 4: Null/undefined check */}
      {error && <Text>Error: {error}</Text>}
      
      {/* Pattern 5: Multiple conditions */}
      {user.isLoggedIn && user.name ? (
        <Text>Hello, {user.name}</Text>
      ) : (
        <Text>Guest user</Text>
      )}
    </View>
  );
}
```

---

## 📥 Props with Examples {#props}

Props (Properties) are read-only data passed from parent to child components.

### Basic Props

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Child component receiving props
const Greeting = (props) => {
  return (
    <View>
      <Text>Hello, {props.name}!</Text>
      <Text>You are {props.age} years old.</Text>
    </View>
  );
};

// Parent component passing props
const App = () => {
  return (
    <View style={styles.container}>
      <Greeting name="John" age={25} />
      <Greeting name="Jane" age={30} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default App;
```

### Destructuring Props

```tsx
// Instead of props.name, props.age
const Greeting = ({ name, age }) => {
  return (
    <View>
      <Text>Hello, {name}!</Text>
      <Text>Age: {age}</Text>
    </View>
  );
};
```

### Props with Default Values

```tsx
const Button = ({ title, onPress, color = 'blue', disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor: color }]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

// Usage
<Button title="Click Me" onPress={() => {}} />
<Button title="Disabled" disabled color="gray" />
```

### Props with TypeScript

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  color = 'blue',
  disabled = false,
  size = 'medium',
}) => {
  const sizeStyles = {
    small: { padding: 8, fontSize: 12 },
    medium: { padding: 12, fontSize: 16 },
    large: { padding: 16, fontSize: 20 },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: color, opacity: disabled ? 0.5 : 1 },
        sizeStyles[size],
      ]}
    >
      <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Button;
```

### Passing Functions as Props

```tsx
// Parent Component
const Parent = () => {
  const handleButtonPress = (message) => {
    console.log(message);
    alert(message);
  };

  return (
    <View>
      <ChildComponent onAction={handleButtonPress} />
    </View>
  );
};

// Child Component
const ChildComponent = ({ onAction }) => {
  return (
    <TouchableOpacity onPress={() => onAction('Button was pressed!')}>
      <Text>Press Me</Text>
    </TouchableOpacity>
  );
};
```

### Passing Objects and Arrays as Props

```tsx
interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
    hobbies: string[];
  };
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <View>
        <Text>Hobbies:</Text>
        {user.hobbies.map((hobby, index) => (
          <Text key={index}>- {hobby}</Text>
        ))}
      </View>
    </View>
  );
};

// Usage
const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  hobbies: ['Reading', 'Coding', 'Gaming'],
};

<UserCard user={user} />
```

### Children Prop

```tsx
// Container component that accepts children
const Card = ({ children, title }) => {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

// Usage
<Card title="User Info">
  <Text>Name: John</Text>
  <Text>Age: 25</Text>
</Card>
```

### Props Validation (PropTypes - Optional)

```tsx
import PropTypes from 'prop-types';

const UserProfile = ({ name, age, email }) => {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{age}</Text>
      <Text>{email}</Text>
    </View>
  );
};

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
};

UserProfile.defaultProps = {
  name: 'Guest',
  age: 0,
  email: 'no-email@example.com',
};
```

---

## 🔄 State with Examples {#state}

State is data that can change over time and causes the component to re-render when updated.

### useState Hook (Functional Components)

#### Basic State

```tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} />
      <Button title="Reset" onPress={() => setCount(0)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 32,
    marginBottom: 20,
  },
});

export default Counter;
```

#### Multiple State Variables

```tsx
const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Age"
        value={age.toString()}
        onChangeText={(text) => setAge(parseInt(text) || 0)}
        style={styles.input}
        keyboardType="numeric"
      />
      <Switch
        value={isSubscribed}
        onValueChange={setIsSubscribed}
      />
      <Text>Subscribed: {isSubscribed ? 'Yes' : 'No'}</Text>
    </View>
  );
};
```

#### Object State

```tsx
const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0,
  });

  const updateName = (name) => {
    setUser({ ...user, name });
  };

  const updateEmail = (email) => {
    setUser({ ...user, email });
  };

  const updateAge = (age) => {
    setUser({ ...user, age });
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={user.name}
        onChangeText={updateName}
      />
      <TextInput
        placeholder="Email"
        value={user.email}
        onChangeText={updateEmail}
      />
      <TextInput
        placeholder="Age"
        value={user.age.toString()}
        onChangeText={(text) => updateAge(parseInt(text) || 0)}
      />
    </View>
  );
};
```

#### Array State

```tsx
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputText, done: false }]);
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a todo"
          style={styles.input}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      {todos.map((todo) => (
        <View key={todo.id} style={styles.todoItem}>
          <TouchableOpacity onPress={() => toggleTodo(todo.id)}>
            <Text style={todo.done && styles.completed}>{todo.text}</Text>
          </TouchableOpacity>
          <Button title="Delete" onPress={() => deleteTodo(todo.id)} />
        </View>
      ))}
    </View>
  );
};
```

#### Functional State Updates

```tsx
const Counter = () => {
  const [count, setCount] = useState(0);

  // ❌ WRONG - Multiple rapid updates might not work correctly
  const incrementMultiple = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Only increments by 1, not 3!
  };

  // ✅ CORRECT - Use functional updates
  const incrementMultipleCorrect = () => {
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    // Correctly increments by 3
  };

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment x3 (Wrong)" onPress={incrementMultiple} />
      <Button title="Increment x3 (Correct)" onPress={incrementMultipleCorrect} />
    </View>
  );
};
```

#### State with useEffect (Side Effects)

```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const DataFetcher = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setData({ message: 'Data loaded successfully!' });
        setError(null);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array = run once on mount

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error}</Text>;
  return <Text>{data?.message}</Text>;
};
```

### State in Class Components

```tsx
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  decrement = () => {
    this.setState({ count: this.state.count - 1 });
  };

  // Functional setState
  incrementMultiple = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
    this.setState((prevState) => ({ count: prevState.count + 1 }));
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return (
      <View>
        <Text>Count: {this.state.count}</Text>
        <Button title="Increment" onPress={this.increment} />
        <Button title="Decrement" onPress={this.decrement} />
      </View>
    );
  }
}
```

### State vs Props

```tsx
// Props: Data passed from parent (read-only)
const Child = ({ name }) => {
  return <Text>{name}</Text>; // Can't change name here
};

// State: Data managed within component (mutable)
const Parent = () => {
  const [count, setCount] = useState(0); // Can change count here
  return (
    <View>
      <Child name="John" />
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
};
```

---

## 🎨 Styling in React Native {#styling}

React Native doesn't use CSS. Instead, it uses JavaScript objects for styling.

### StyleSheet API (Recommended)

```tsx
import { StyleSheet, View, Text } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>React Native</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default App;
```

### Inline Styles

```tsx
const App = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
        Inline Style
      </Text>
    </View>
  );
};
```

### Combining Styles (Array Syntax)

```tsx
const App = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={[styles.text, isActive && styles.activeText]}>
        Combined Styles
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  activeText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
```

### Common Style Properties

```tsx
const styles = StyleSheet.create({
  example: {
    // Layout
    width: 100,
    height: 100,
    minWidth: 50,
    maxWidth: 200,
    minHeight: 50,
    maxHeight: 200,

    // Spacing
    margin: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginHorizontal: 10, // left + right
    marginVertical: 10, // top + bottom

    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,

    // Positioning
    position: 'absolute', // 'relative' | 'absolute'
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,

    // Colors
    backgroundColor: '#ffffff',
    color: '#000000', // For Text components
    opacity: 0.5, // 0 to 1

    // Borders
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Elevation (Android)
    elevation: 5,

    // Text (for Text components)
    fontSize: 16,
    fontWeight: 'normal', // 'normal' | 'bold' | '100' | '200' | ... | '900'
    fontStyle: 'normal', // 'normal' | 'italic'
    textAlign: 'center', // 'auto' | 'left' | 'right' | 'center' | 'justify'
    textDecorationLine: 'none', // 'none' | 'underline' | 'line-through' | 'underline line-through'
    textTransform: 'none', // 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    letterSpacing: 0,
    lineHeight: 20,

    // Overflow
    overflow: 'hidden', // 'visible' | 'hidden' | 'scroll'
  },
});
```

### Platform-Specific Styles

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 10,
    ...Platform.select({
      ios: {
        backgroundColor: '#f0f0f0',
      },
      android: {
        backgroundColor: '#ffffff',
      },
    }),
  },
});
```

### Dynamic Styles Based on State

```tsx
const Button = ({ title, isActive }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive && styles.buttonActive,
        { backgroundColor: isActive ? '#007AFF' : '#CCCCCC' },
      ]}
    >
      <Text style={[styles.text, isActive && styles.textActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#666',
  },
  textActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
```

---

## 📐 Flexbox Layout in Depth {#flexbox}

Flexbox is the primary layout system in React Native. It's designed for one-dimensional layouts.

### Container Properties (Parent)

#### flexDirection

Controls the direction of flex items.

```tsx
const FlexDirectionExample = () => {
  return (
    <View>
      {/* Default: column (vertical) */}
      <View style={[styles.container, { flexDirection: 'column' }]}>
        <View style={styles.box} />
        <View style={styles.box} />
        <View style={styles.box} />
      </View>

      {/* row (horizontal) */}
      <View style={[styles.container, { flexDirection: 'row' }]}>
        <View style={styles.box} />
        <View style={styles.box} />
        <View style={styles.box} />
      </View>
    </View>
  );
};
```

#### justifyContent

Aligns items along the main axis.

```tsx
const JustifyContentExample = () => {
  return (
    <View>
      {/* flex-start (default) */}
      <View style={[styles.container, { justifyContent: 'flex-start' }]}>
        <View style={styles.box} />
      </View>

      {/* center */}
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <View style={styles.box} />
      </View>

      {/* flex-end */}
      <View style={[styles.container, { justifyContent: 'flex-end' }]}>
        <View style={styles.box} />
      </View>

      {/* space-between */}
      <View style={[styles.container, { justifyContent: 'space-between' }]}>
        <View style={styles.box} />
        <View style={styles.box} />
        <View style={styles.box} />
      </View>

      {/* space-around */}
      <View style={[styles.container, { justifyContent: 'space-around' }]}>
        <View style={styles.box} />
        <View style={styles.box} />
        <View style={styles.box} />
      </View>

      {/* space-evenly */}
      <View style={[styles.container, { justifyContent: 'space-evenly' }]}>
        <View style={styles.box} />
        <View style={styles.box} />
        <View style={styles.box} />
      </View>
    </View>
  );
};
```

#### alignItems

Aligns items along the cross axis.

```tsx
const AlignItemsExample = () => {
  return (
    <View>
      {/* stretch (default) */}
      <View style={[styles.container, { alignItems: 'stretch' }]}>
        <View style={styles.box} />
      </View>

      {/* flex-start */}
      <View style={[styles.container, { alignItems: 'flex-start' }]}>
        <View style={styles.box} />
      </View>

      {/* center */}
      <View style={[styles.container, { alignItems: 'center' }]}>
        <View style={styles.box} />
      </View>

      {/* flex-end */}
      <View style={[styles.container, { alignItems: 'flex-end' }]}>
        <View style={styles.box} />
      </View>

      {/* baseline */}
      <View style={[styles.container, { alignItems: 'baseline' }]}>
        <Text style={{ fontSize: 20 }}>Text</Text>
        <Text style={{ fontSize: 30 }}>Text</Text>
      </View>
    </View>
  );
};
```

#### flexWrap

Controls whether items wrap to new lines.

```tsx
const FlexWrapExample = () => {
  return (
    <View>
      {/* nowrap (default) */}
      <View style={[styles.container, { flexWrap: 'nowrap' }]}>
        {[...Array(10)].map((_, i) => (
          <View key={i} style={styles.box} />
        ))}
      </View>

      {/* wrap */}
      <View style={[styles.container, { flexWrap: 'wrap' }]}>
        {[...Array(10)].map((_, i) => (
          <View key={i} style={styles.box} />
        ))}
      </View>
    </View>
  );
};
```

### Item Properties (Child)

#### flex

Controls how much space an item takes relative to siblings.

```tsx
const FlexExample = () => {
  return (
    <View style={styles.container}>
      {/* Takes 1 part of available space */}
      <View style={[styles.box, { flex: 1, backgroundColor: 'red' }]} />
      
      {/* Takes 2 parts of available space */}
      <View style={[styles.box, { flex: 2, backgroundColor: 'blue' }]} />
      
      {/* Takes 1 part of available space */}
      <View style={[styles.box, { flex: 1, backgroundColor: 'green' }]} />
    </View>
  );
};
```

#### alignSelf

Overrides parent's alignItems for specific item.

```tsx
const AlignSelfExample = () => {
  return (
    <View style={[styles.container, { alignItems: 'flex-start' }]}>
      <View style={[styles.box, { alignSelf: 'flex-start' }]} />
      <View style={[styles.box, { alignSelf: 'center' }]} />
      <View style={[styles.box, { alignSelf: 'flex-end' }]} />
    </View>
  );
};
```

### Complete Flexbox Example

```tsx
const CompleteFlexboxExample = () => {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Header</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text>Sidebar</Text>
        </View>

        {/* Main Area */}
        <View style={styles.main}>
          <View style={styles.card}>
            <Text>Card 1</Text>
          </View>
          <View style={styles.card}>
            <Text>Card 2</Text>
          </View>
          <View style={styles.card}>
            <Text>Card 3</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Footer</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 100,
    backgroundColor: '#e0e0e0',
    padding: 10,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-around',
  },
  card: {
    width: '45%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footer: {
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## 📜 ScrollView vs FlatList vs SectionList {#lists}

### ScrollView

**Use when**: You have a small, static list of items that all render at once.

**Pros**:
- Simple to use
- Good for small lists
- All items render immediately

**Cons**:
- Poor performance with many items
- All items in memory at once
- No built-in optimization

#### ScrollView Example

```tsx
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const ScrollViewExample = () => {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}
      scrollEnabled={true}
    >
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  item: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
});

export default ScrollViewExample;
```

#### ScrollView with Horizontal Scrolling

```tsx
const HorizontalScrollView = () => {
  const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalContainer}
    >
      {items.map((item, index) => (
        <View key={index} style={styles.horizontalItem}>
          <Text>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
```

---

### FlatList

**Use when**: You have a large, dynamic list that needs performance optimization.

**Pros**:
- Virtualized (only renders visible items)
- Built-in performance optimizations
- Pull-to-refresh support
- Infinite scroll support
- Separator support
- Empty state support

**Cons**:
- Slightly more complex than ScrollView
- Requires data in array format

#### Basic FlatList Example

```tsx
import { FlatList, View, Text, StyleSheet } from 'react-native';

const FlatListExample = () => {
  const data = Array.from({ length: 1000 }, (_, i) => ({
    id: i.toString(),
    title: `Item ${i + 1}`,
    description: `This is item number ${i + 1}`,
  }));

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default FlatListExample;
```

#### FlatList with Pull-to-Refresh

```tsx
const RefreshableFlatList = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return Array.from({ length: 20 }, (_, i) => ({
      id: i.toString(),
      title: `Item ${i + 1}`,
    }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const newData = await fetchData();
    setData(newData);
    setRefreshing(false);
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};
```

#### FlatList with Infinite Scroll

```tsx
const InfiniteScrollFlatList = () => {
  const [data, setData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i.toString(),
      title: `Item ${i + 1}`,
    }))
  );
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newData = Array.from({ length: 20 }, (_, i) => ({
      id: (data.length + i).toString(),
      title: `Item ${data.length + i + 1}`,
    }));
    
    setData([...data, ...newData]);
    setLoading(false);
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator size="small" /> : null
      }
    />
  );
};
```

#### FlatList with Separator and Empty State

```tsx
const AdvancedFlatList = () => {
  const [data, setData] = useState([]);

  const ItemSeparator = () => <View style={styles.separator} />;

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No items found</Text>
    </View>
  );

  const HeaderComponent = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>List Header</Text>
    </View>
  );

  const FooterComponent = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>List Footer</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={EmptyComponent}
      ListHeaderComponent={HeaderComponent}
      ListFooterComponent={FooterComponent}
    />
  );
};
```

#### Horizontal FlatList

```tsx
const HorizontalFlatList = () => {
  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i.toString(),
    title: `Card ${i + 1}`,
  }));

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View style={styles.horizontalCard}>
          <Text>{item.title}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalContainer}
    />
  );
};
```

---

### SectionList

**Use when**: You need to group items into sections with headers.

**Pros**:
- Built-in section headers/footers
- Virtualized (performance optimized)
- Supports sticky headers
- Good for categorized data

**Cons**:
- Requires data in specific format (sections array)
- More complex than FlatList

#### Basic SectionList Example

```tsx
import { SectionList, View, Text, StyleSheet } from 'react-native';

const SectionListExample = () => {
  const DATA = [
    {
      title: 'Fruits',
      data: ['Apple', 'Banana', 'Orange', 'Grape'],
    },
    {
      title: 'Vegetables',
      data: ['Carrot', 'Broccoli', 'Spinach', 'Tomato'],
    },
    {
      title: 'Dairy',
      data: ['Milk', 'Cheese', 'Yogurt', 'Butter'],
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SectionList
      sections={DATA}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item, index) => item + index}
      stickySectionHeadersEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
  },
  sectionHeader: {
    backgroundColor: '#007AFF',
    padding: 15,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SectionListExample;
```

#### SectionList with Complex Data

```tsx
const ComplexSectionList = () => {
  const [sections, setSections] = useState([
    {
      id: '1',
      title: 'To Do',
      data: [
        { id: '1', task: 'Buy groceries', completed: false },
        { id: '2', task: 'Finish project', completed: false },
      ],
    },
    {
      id: '2',
      title: 'In Progress',
      data: [
        { id: '3', task: 'Write documentation', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Completed',
      data: [
        { id: '4', task: 'Setup project', completed: true },
        { id: '5', task: 'Design UI', completed: true },
      ],
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={[styles.taskText, item.completed && styles.completed]}>
        {item.task}
      </Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderSectionFooter = ({ section }) => (
    <View style={styles.sectionFooter}>
      <Text style={styles.footerText}>
        {section.data.length} item(s)
      </Text>
    </View>
  );

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled={true}
    />
  );
};
```

---

## 📊 Comparison Table

| Feature | ScrollView | FlatList | SectionList |
|---------|-----------|----------|-------------|
| **Use Case** | Small, static lists | Large, dynamic lists | Grouped/categorized data |
| **Performance** | Poor with many items | Excellent (virtualized) | Excellent (virtualized) |
| **Memory** | All items in memory | Only visible items | Only visible items |
| **Sections** | ❌ No | ❌ No | ✅ Yes |
| **Pull to Refresh** | Manual implementation | ✅ Built-in | ✅ Built-in |
| **Infinite Scroll** | Manual implementation | ✅ Built-in | ✅ Built-in |
| **Sticky Headers** | ❌ No | ❌ No | ✅ Yes |
| **Complexity** | Simple | Medium | Medium-High |
| **Data Format** | Array | Array | Sections array |

---

## 🎯 When to Use Each

### Use ScrollView when:
- ✅ Small list (< 50 items)
- ✅ All items need to render immediately
- ✅ Simple vertical/horizontal scrolling
- ✅ Mixed content (not just a list)

### Use FlatList when:
- ✅ Large list (50+ items)
- ✅ Dynamic data that changes
- ✅ Need performance optimization
- ✅ Need pull-to-refresh or infinite scroll
- ✅ Simple list without sections

### Use SectionList when:
- ✅ Need to group items into sections
- ✅ Want section headers/footers
- ✅ Need sticky section headers
- ✅ Categorized data (e.g., contacts by letter, tasks by status)

---

## 💡 Best Practices

1. **Always use `keyExtractor`** in FlatList/SectionList for performance
2. **Use `getItemLayout`** if item heights are fixed (further optimization)
3. **Avoid inline functions** in renderItem (use useCallback)
4. **Use `removeClippedSubviews`** for very long lists
5. **Set `initialNumToRender`** to control initial render count
6. **Use `maxToRenderPerBatch`** to control batch size

```tsx
const OptimizedFlatList = () => {
  const renderItem = useCallback(({ item }) => (
    <ItemComponent item={item} />
  ), []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
};
```

---

This guide covers all the essential concepts you need to build React Native applications! 🚀


