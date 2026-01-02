/**
 * Forms & Validation Examples
 * Demonstrates TextInput, Formik, Yup, Controlled vs Uncontrolled inputs
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';

// ============================================
// BASIC TEXTINPUT EXAMPLES
// ============================================

export const BasicTextInputExample = () => {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic TextInput Examples</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Simple Input</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter text"
          value={text}
          onChangeText={setText}
        />
        <Text style={styles.valueText}>Value: {text}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email Input</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.valueText}>Value: {email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Password Input</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.valueText}>
          Value: {password.replace(/./g, '•')}
        </Text>
      </View>
    </View>
  );
};

// ============================================
// VALIDATED INPUT EXAMPLE
// ============================================

export const ValidatedInputExample = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);

    if (!text) {
      setError('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validated Input Example</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Email with Validation</Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Enter email"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!error && email ? (
          <Text style={styles.successText}>✓ Valid email</Text>
        ) : null}
      </View>
    </View>
  );
};

// ============================================
// MULTI-INPUT FORM
// ============================================

export const MultiInputFormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      Alert.alert('Success', 'Form is valid!', [
        { text: 'OK', onPress: () => console.log('Form data:', formData) },
      ]);
    } else {
      Alert.alert('Validation Error', 'Please fix the errors');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Multi-Input Form</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Enter your name"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Enter your phone"
          value={formData.phone}
          onChangeText={(text) => updateField('phone', text)}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(text) => updateField('password', text)}
          secureTextEntry
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ============================================
// CONTROLLED VS UNCONTROLLED
// ============================================

export const ControlledVsUncontrolledExample = () => {
  // Controlled Input
  const [controlledValue, setControlledValue] = useState('');

  // Uncontrolled Input
  const uncontrolledRef = useRef<TextInput>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState('');

  const getUncontrolledValue = () => {
    // Note: TextInput doesn't have a direct .value property in React Native
    // This is a demonstration of the concept
    Alert.alert('Uncontrolled Value', `Value: ${uncontrolledValue}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controlled vs Uncontrolled</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Controlled Input</Text>
        <Text style={styles.description}>
          Value is controlled by React state. Re-renders on every keystroke.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Controlled input"
          value={controlledValue}
          onChangeText={setControlledValue}
        />
        <Text style={styles.valueText}>Value: {controlledValue}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setControlledValue('')}
        >
          <Text style={styles.buttonText}>Reset (Easy with controlled)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uncontrolled Input</Text>
        <Text style={styles.description}>
          Value is stored in the component. No re-renders on keystroke.
        </Text>
        <TextInput
          ref={uncontrolledRef}
          style={styles.input}
          placeholder="Uncontrolled input"
          defaultValue=""
          onChangeText={setUncontrolledValue}
        />
        <Text style={styles.valueText}>Value: {uncontrolledValue}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            uncontrolledRef.current?.clear();
            setUncontrolledValue('');
          }}
        >
          <Text style={styles.buttonText}>Clear (Harder with uncontrolled)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={getUncontrolledValue}>
          <Text style={styles.buttonText}>Get Value</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// REUSABLE INPUT COMPONENT
// ============================================

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  touched?: boolean;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  error,
  touched,
  ...props
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, touched && error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {touched && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export const ReusableInputExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate on change
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    if (field === 'name') {
      if (!value.trim()) {
        newErrors.name = 'Name is required';
      } else if (value.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      } else {
        delete newErrors.name;
      }
    }

    if (field === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
    }

    setErrors(newErrors);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reusable Input Component</Text>

      <Input
        label="Name"
        value={formData.name}
        onChangeText={(text) => updateField('name', text)}
        onBlur={() => {
          setTouched((prev) => ({ ...prev, name: true }));
          validateField('name', formData.name);
        }}
        error={errors.name}
        touched={touched.name}
        placeholder="Enter your name"
      />

      <Input
        label="Email"
        value={formData.email}
        onChangeText={(text) => updateField('email', text)}
        onBlur={() => {
          setTouched((prev) => ({ ...prev, email: true }));
          validateField('email', formData.email);
        }}
        error={errors.email}
        touched={touched.email}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const FormsExampleApp = () => {
  const [activeTab, setActiveTab] = useState<
    'basic' | 'validated' | 'multi' | 'controlled' | 'reusable'
  >('basic');

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'validated', label: 'Validated' },
    { id: 'multi', label: 'Multi-Input' },
    { id: 'controlled', label: 'Controlled' },
    { id: 'reusable', label: 'Reusable' },
  ] as const;

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Forms & Validation Examples</Text>
      <Text style={styles.note}>
        Note: Formik and Yup examples require installation
      </Text>

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
        {activeTab === 'basic' && <BasicTextInputExample />}
        {activeTab === 'validated' && <ValidatedInputExample />}
        {activeTab === 'multi' && <MultiInputFormExample />}
        {activeTab === 'controlled' && <ControlledVsUncontrolledExample />}
        {activeTab === 'reusable' && <ReusableInputExample />}
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
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#fff3cd',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 4,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  inputError: {
    borderColor: '#f44336',
  },
  inputContainer: {
    marginBottom: 15,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    marginTop: 5,
  },
  successText: {
    fontSize: 12,
    color: '#4caf50',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FormsExampleApp;


