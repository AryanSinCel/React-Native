# React Native Examples - How to Use

This folder contains practical, runnable examples for all React Native concepts.

## 📁 Files

1. **ComponentsExample.tsx** - Functional & Class Components
2. **PropsStateExample.tsx** - Props and State with interactions
3. **StylingFlexboxExample.tsx** - Styling and Flexbox layouts
4. **ListsExample.tsx** - ScrollView, FlatList, SectionList

## 🚀 How to Run Examples

### Option 1: Replace App.tsx temporarily

1. Open `App.tsx` in the root directory
2. Import and use any example:

```tsx
// Example: Using ComponentsExample
import ComponentsExampleApp from './examples/ComponentsExample';

export default ComponentsExampleApp;
```

### Option 2: Create a navigation system

You can create a simple navigation to switch between examples:

```tsx
// In App.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ComponentsExampleApp from './examples/ComponentsExample';
import PropsStateExampleApp from './examples/PropsStateExample';
import StylingFlexboxExampleApp from './examples/StylingFlexboxExample';
import ListsExampleApp from './examples/ListsExample';

const App = () => {
  const [currentExample, setCurrentExample] = useState<string | null>(null);

  const examples = [
    { name: 'Components', component: ComponentsExampleApp },
    { name: 'Props & State', component: PropsStateExampleApp },
    { name: 'Styling & Flexbox', component: StylingFlexboxExampleApp },
    { name: 'Lists', component: ListsExampleApp },
  ];

  if (currentExample) {
    const Example = examples.find(e => e.name === currentExample)?.component;
    return Example ? (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentExample(null)}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Example />
      </View>
    ) : null;
  }

  return (
    <View style={styles.menu}>
      <Text style={styles.title}>React Native Examples</Text>
      {examples.map((example) => (
        <TouchableOpacity
          key={example.name}
          style={styles.button}
          onPress={() => setCurrentExample(example.name)}
        >
          <Text style={styles.buttonText}>{example.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196f3',
  },
});

export default App;
```

## 📚 What Each Example Covers

### ComponentsExample.tsx
- ✅ Functional components
- ✅ Class components
- ✅ Component with props
- ✅ Component with state (hooks)
- ✅ Component lifecycle (class)

### PropsStateExample.tsx
- ✅ Basic props
- ✅ Props with TypeScript
- ✅ Multiple state variables
- ✅ Object state
- ✅ Array state
- ✅ Props + State interaction
- ✅ Todo list example
- ✅ Form handling

### StylingFlexboxExample.tsx
- ✅ Inline styles
- ✅ StyleSheet API
- ✅ Combined styles
- ✅ Common style properties
- ✅ flexDirection
- ✅ justifyContent
- ✅ alignItems
- ✅ flex property
- ✅ Complete layout example

### ListsExample.tsx
- ✅ ScrollView (vertical & horizontal)
- ✅ FlatList (basic, refreshable, infinite scroll)
- ✅ SectionList (basic & complex)
- ✅ List headers/footers
- ✅ Separators
- ✅ Empty states

## 💡 Tips

1. **Read the code comments** - Each example has detailed comments explaining what's happening
2. **Modify the examples** - Try changing values, adding features, or breaking things to learn
3. **Check the main guide** - Refer to `REACT_NATIVE_GUIDE.md` for detailed explanations
4. **Experiment** - Combine concepts from different examples

## 🔧 Troubleshooting

If you get import errors:
- Make sure the file paths are correct
- Check that TypeScript types are properly imported
- Ensure all dependencies are installed (`npm install`)

Happy learning! 🚀


