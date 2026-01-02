/**
 * Props and State Examples
 * Demonstrates props, state, and their interactions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

// ============================================
// PROPS EXAMPLES
// ============================================

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  color = 'blue',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: color, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

interface UserCardProps {
  user: {
    name: string;
    email: string;
    age: number;
  };
  onEdit?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{user.name}</Text>
      <Text style={styles.cardText}>Email: {user.email}</Text>
      <Text style={styles.cardText}>Age: {user.age}</Text>
      {onEdit && (
        <CustomButton title="Edit" onPress={onEdit} color="green" />
      )}
    </View>
  );
};

// ============================================
// STATE EXAMPLES
// ============================================

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter</Text>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.buttonRow}>
        <CustomButton
          title="-"
          onPress={() => setCount(count - 1)}
          color="red"
        />
        <CustomButton
          title="Reset"
          onPress={() => setCount(0)}
          color="gray"
        />
        <CustomButton
          title="+"
          onPress={() => setCount(count + 1)}
          color="green"
        />
      </View>
    </View>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState<Array<{ id: number; text: string; done: boolean }>>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputText, done: false },
      ]);
      setInputText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a todo"
          style={styles.input}
          onSubmitEditing={addTodo}
        />
        <CustomButton title="Add" onPress={addTodo} color="blue" />
      </View>
      {todos.map((todo) => (
        <View key={todo.id} style={styles.todoItem}>
          <TouchableOpacity
            onPress={() => toggleTodo(todo.id)}
            style={styles.todoContent}
          >
            <Text
              style={[styles.todoText, todo.done && styles.todoDone]}
            >
              {todo.text}
            </Text>
          </TouchableOpacity>
          <CustomButton
            title="Delete"
            onPress={() => deleteTodo(todo.id)}
            color="red"
          />
        </View>
      ))}
      {todos.length === 0 && (
        <Text style={styles.emptyText}>No todos yet. Add one above!</Text>
      )}
    </View>
  );
};

const UserForm = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    isSubscribed: false,
  });

  const handleSubmit = () => {
    alert(`User: ${user.name}\nEmail: ${user.email}\nAge: ${user.age}\nSubscribed: ${user.isSubscribed}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Form</Text>
      <TextInput
        placeholder="Name"
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Age"
        value={user.age}
        onChangeText={(text) => setUser({ ...user, age: text })}
        style={styles.input}
        keyboardType="numeric"
      />
      <View style={styles.switchContainer}>
        <Text>Subscribe to newsletter</Text>
        <Switch
          value={user.isSubscribed}
          onValueChange={(value) => setUser({ ...user, isSubscribed: value })}
        />
      </View>
      <CustomButton title="Submit" onPress={handleSubmit} color="blue" />
    </View>
  );
};

// ============================================
// PROPS + STATE INTERACTION
// ============================================

const ParentComponent = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
  });

  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  const handleEdit = () => {
    setEditMode(true);
    setTempUser(user);
  };

  const handleSave = () => {
    setUser(tempUser);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setTempUser(user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Props + State Interaction</Text>
      {editMode ? (
        <View>
          <TextInput
            placeholder="Name"
            value={tempUser.name}
            onChangeText={(text) => setTempUser({ ...tempUser, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={tempUser.email}
            onChangeText={(text) => setTempUser({ ...tempUser, email: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Age"
            value={tempUser.age.toString()}
            onChangeText={(text) =>
              setTempUser({ ...tempUser, age: parseInt(text) || 0 })
            }
            style={styles.input}
            keyboardType="numeric"
          />
          <View style={styles.buttonRow}>
            <CustomButton title="Cancel" onPress={handleCancel} color="red" />
            <CustomButton title="Save" onPress={handleSave} color="green" />
          </View>
        </View>
      ) : (
        <View>
          <UserCard user={user} onEdit={handleEdit} />
        </View>
      )}
    </View>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const PropsStateExampleApp = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Props & State Examples</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Counter (State)</Text>
        <Counter />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Todo List (State)</Text>
        <TodoList />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. User Form (State)</Text>
        <UserForm />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Props + State</Text>
        <ParentComponent />
      </View>
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
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
  },
  todoDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default PropsStateExampleApp;


