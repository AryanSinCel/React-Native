# Forms & Validation in React Native - Complete Guide

This guide covers everything about building forms and validating user input in React Native.

## 📋 Table of Contents
1. [TextInput Examples](#textinput)
2. [Formik](#formik)
3. [Yup Validation](#yup)
4. [Controlled vs Uncontrolled Inputs](#controlled-uncontrolled)
5. [Best Practices](#best-practices)

---

## 📝 TextInput Examples {#textinput}

### Basic TextInput

```tsx
import { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const BasicInput = () => {
  const [text, setText] = useState('');

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
      />
      <Text>You typed: {text}</Text>
    </View>
  );
};
```

### TextInput with Validation

```tsx
const ValidatedInput = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text && !emailRegex.test(text)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  return (
    <View>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};
```

### Multiple Inputs

```tsx
const MultiInputForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
      console.log('Form data:', formData);
      // Submit form
    }
  };

  return (
    <View>
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => updateField('name', text)}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => updateField('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => updateField('phone', text)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => updateField('password', text)}
        secureTextEntry
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};
```

### TextInput Props

```tsx
<TextInput
  // Basic props
  value={text}
  onChangeText={setText}
  placeholder="Enter text"
  
  // Styling
  style={styles.input}
  placeholderTextColor="#999"
  
  // Keyboard
  keyboardType="default" // default, email-address, numeric, phone-pad, etc.
  autoCapitalize="none" // none, sentences, words, characters
  autoCorrect={false}
  autoComplete="off" // off, email, password, etc.
  
  // Security
  secureTextEntry={true} // For passwords
  textContentType="password" // iOS only
  
  // Behavior
  editable={true}
  multiline={false}
  maxLength={100}
  numberOfLines={4} // For multiline
  
  // Events
  onFocus={() => console.log('Focused')}
  onBlur={() => console.log('Blurred')}
  onSubmitEditing={() => console.log('Submitted')}
  
  // Refs
  ref={inputRef}
/>
```

---

## 🎯 Formik {#formik}

Formik is a popular library for building forms in React Native.

### Installation

```bash
npm install formik
```

### Basic Formik Example

```tsx
import { Formik } from 'formik';
import { View, TextInput, Button, Text } from 'react-native';

const BasicFormikForm = () => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <TextInput
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
          />
          <Button onPress={handleSubmit} title="Submit" />
        </View>
      )}
    </Formik>
  );
};
```

### Formik with useFormik Hook

```tsx
import { useFormik } from 'formik';

const FormikHookExample = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      age: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
      />
      {formik.touched.name && formik.errors.name && (
        <Text style={styles.error}>{formik.errors.name}</Text>
      )}

      <TextInput
        placeholder="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        keyboardType="email-address"
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={styles.error}>{formik.errors.email}</Text>
      )}

      <Button onPress={formik.handleSubmit} title="Submit" />
    </View>
  );
};
```

### Formik with Validation

```tsx
const FormikWithValidation = () => {
  const validate = (values: any) => {
    const errors: any = {};

    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length < 2) {
      errors.name = 'Must be at least 2 characters';
    }

    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={{ name: '', email: '' }}
      validate={validate}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View>
          <TextInput
            placeholder="Name"
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
          />
          {touched.name && errors.name && (
            <Text style={styles.error}>{errors.name}</Text>
          )}

          <TextInput
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
          />
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}

          <Button
            onPress={handleSubmit}
            title="Submit"
            disabled={isSubmitting}
          />
        </View>
      )}
    </Formik>
  );
};
```

---

## ✅ Yup Validation {#yup}

Yup is a schema validation library that works great with Formik.

### Installation

```bash
npm install yup
```

### Basic Yup Schema

```tsx
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  age: Yup.number()
    .min(18, 'Must be at least 18 years old')
    .max(100, 'Invalid age')
    .required('Age is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});
```

### Formik + Yup Example

```tsx
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const FormikYupForm = () => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          console.log(values);
          setSubmitting(false);
        }, 1000);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View>
          <TextInput
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
          />
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}

          <TextInput
            placeholder="Password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            secureTextEntry
          />
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <Button
            onPress={handleSubmit}
            title="Submit"
            disabled={isSubmitting}
          />
        </View>
      )}
    </Formik>
  );
};
```

### Common Yup Validations

```tsx
const schema = Yup.object().shape({
  // String validations
  name: Yup.string()
    .required('Required')
    .min(2, 'Too short')
    .max(50, 'Too long')
    .matches(/^[a-zA-Z ]+$/, 'Only letters and spaces'),

  // Email
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),

  // Number
  age: Yup.number()
    .typeError('Must be a number')
    .positive('Must be positive')
    .integer('Must be an integer')
    .min(18, 'Must be at least 18')
    .max(100, 'Must be less than 100')
    .required('Required'),

  // Date
  birthDate: Yup.date()
    .max(new Date(), 'Cannot be in the future')
    .required('Required'),

  // Array
  tags: Yup.array()
    .min(1, 'At least one tag required')
    .of(Yup.string()),

  // Conditional validation
  password: Yup.string().when('hasPassword', {
    is: true,
    then: (schema) => schema.required('Password is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Custom validation
  username: Yup.string()
    .test('is-available', 'Username is taken', async (value) => {
      // Async validation
      const available = await checkUsernameAvailability(value);
      return available;
    }),
});
```

---

## 🎮 Controlled vs Uncontrolled Inputs {#controlled-uncontrolled}

### Controlled Inputs

Controlled inputs have their value controlled by React state.

```tsx
const ControlledInput = () => {
  const [value, setValue] = useState('');

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder="Controlled input"
    />
  );
};
```

**Pros:**
- Full control over value
- Easy validation
- Can reset programmatically
- Better for forms

**Cons:**
- More code
- Re-renders on every keystroke

### Uncontrolled Inputs

Uncontrolled inputs store their value in the DOM/component itself.

```tsx
import { useRef } from 'react';

const UncontrolledInput = () => {
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    const value = inputRef.current?.value || '';
    console.log('Value:', value);
  };

  return (
    <TextInput
      ref={inputRef}
      placeholder="Uncontrolled input"
      defaultValue=""
    />
  );
};
```

**Pros:**
- Less code
- Better performance (no re-renders)
- Good for simple inputs

**Cons:**
- Harder to validate
- Can't reset easily
- Less control

### When to Use Each

**Use Controlled when:**
- Building forms
- Need validation
- Need to reset values
- Need to format input
- Building complex forms

**Use Uncontrolled when:**
- Simple inputs
- Performance is critical
- Don't need validation
- One-time value retrieval

### Hybrid Approach

```tsx
const HybridInput = () => {
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    // Validate or format
    const formatted = text.toUpperCase();
    setValue(formatted);
  };

  const reset = () => {
    setValue('');
    inputRef.current?.clear();
  };

  return (
    <TextInput
      ref={inputRef}
      value={value}
      onChangeText={handleChange}
      placeholder="Hybrid input"
    />
  );
};
```

---

## ✅ Best Practices {#best-practices}

### 1. Create Reusable Input Component

```tsx
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
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, touched && error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {touched && error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
```

### 2. Form Validation Hook

```tsx
const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: Yup.ObjectSchema<any>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user types
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const setFieldTouched = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validate = async () => {
    if (!validationSchema) return true;

    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach(error => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (onSubmit: (values: T) => void) => {
    const isValid = await validate();
    if (isValid) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validate,
    handleSubmit,
  };
};
```

### 3. Form Component Pattern

```tsx
const SignupForm = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, 'Too short').required('Required'),
  });

  const form = useForm(
    { name: '', email: '', password: '' },
    validationSchema
  );

  const onSubmit = async (values: typeof form.values) => {
    // Submit form
    console.log(values);
  };

  return (
    <View>
      <Input
        label="Name"
        value={form.values.name}
        onChangeText={(text) => form.setValue('name', text)}
        onBlur={() => form.setFieldTouched('name')}
        error={form.errors.name}
        touched={form.touched.name}
      />

      <Input
        label="Email"
        value={form.values.email}
        onChangeText={(text) => form.setValue('email', text)}
        onBlur={() => form.setFieldTouched('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        error={form.errors.email}
        touched={form.touched.email}
      />

      <Input
        label="Password"
        value={form.values.password}
        onChangeText={(text) => form.setValue('password', text)}
        onBlur={() => form.setFieldTouched('password')}
        secureTextEntry
        error={form.errors.password}
        touched={form.touched.password}
      />

      <Button
        title="Sign Up"
        onPress={() => form.handleSubmit(onSubmit)}
      />
    </View>
  );
};
```

### 4. Error Handling

```tsx
const handleSubmit = async (values: any) => {
  try {
    setSubmitting(true);
    const response = await api.post('/signup', values);
    // Success
  } catch (error) {
    if (error.response?.data?.errors) {
      // Server validation errors
      setErrors(error.response.data.errors);
    } else {
      // Network or other errors
      Alert.alert('Error', 'Something went wrong');
    }
  } finally {
    setSubmitting(false);
  }
};
```

### 5. Accessibility

```tsx
<TextInput
  accessibilityLabel="Email input"
  accessibilityHint="Enter your email address"
  accessibilityRole="textbox"
  autoComplete="email"
  textContentType="emailAddress"
/>
```

---

This guide covers all essential form and validation concepts! 🚀


