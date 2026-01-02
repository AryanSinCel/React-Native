/**
 * Components Example - Functional and Class Components
 * Run this by importing it in App.tsx
 */

import React, { Component, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';

// ============================================
// FUNCTIONAL COMPONENTS
// ============================================

// Simple Functional Component
export const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native!</Text>
    </View>
  );
};

// Functional Component with State (using hooks)
export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>Count: {count}</Text>
      <View style={styles.buttonRow}>
        <Button title="Decrement" onPress={() => setCount(count - 1)} />
        <Button title="Increment" onPress={() => setCount(count + 1)} />
        <Button title="Reset" onPress={() => setCount(0)} />
      </View>
    </View>
  );
};

// Functional Component with Props
interface UserCardProps {
  name: string;
  age: number;
  email: string;
}

export const UserCard: React.FC<UserCardProps> = ({ name, age, email }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.cardText}>Age: {age}</Text>
      <Text style={styles.cardText}>{email}</Text>
    </View>
  );
};

// ============================================
// CLASS COMPONENTS
// ============================================

interface CounterState {
  count: number;
}

export class ClassCounter extends Component<{}, CounterState> {
  constructor(props: {}) {
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

  reset = () => {
    this.setState({ count: 0 });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.count}>Count: {this.state.count}</Text>
        <View style={styles.buttonRow}>
          <Button title="Decrement" onPress={this.decrement} />
          <Button title="Increment" onPress={this.increment} />
          <Button title="Reset" onPress={this.reset} />
        </View>
      </View>
    );
  }
}

// ============================================
// COMPLETE EXAMPLE APP
// ============================================

export const ComponentsExampleApp = () => {
  const [showCounter, setShowCounter] = useState(true);

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Components Examples</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Functional Component with Props</Text>
        <UserCard name="John Doe" age={25} email="john@example.com" />
        <UserCard name="Jane Smith" age={30} email="jane@example.com" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Functional Component with State</Text>
        <Counter />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Class Component with State</Text>
        <ClassCounter />
      </View>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowCounter(!showCounter)}
      >
        <Text style={styles.toggleButtonText}>
          {showCounter ? 'Hide' : 'Show'} Counter
        </Text>
      </TouchableOpacity>

      {showCounter && <Counter />}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComponentsExampleApp;


