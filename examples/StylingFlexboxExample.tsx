/**
 * Styling and Flexbox Examples
 * Demonstrates various styling techniques and Flexbox layouts
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// ============================================
// STYLING EXAMPLES
// ============================================

const StylingBasics = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Styling Basics</Text>
      
      {/* Inline Styles */}
      <View style={{ padding: 10, backgroundColor: '#e3f2fd', marginBottom: 10 }}>
        <Text>Inline Style</Text>
      </View>

      {/* StyleSheet */}
      <View style={styles.box}>
        <Text>StyleSheet Style</Text>
      </View>

      {/* Combined Styles */}
      <View style={[styles.box, { backgroundColor: '#c8e6c9' }]}>
        <Text>Combined Styles</Text>
      </View>

      {/* Conditional Styles */}
      <View style={[styles.box, styles.highlighted]}>
        <Text>Conditional Style</Text>
      </View>
    </View>
  );
};

const CommonProperties = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Common Style Properties</Text>
      
      {/* Spacing */}
      <View style={styles.spacingExample}>
        <View style={styles.spacingBox}>
          <Text>Margin</Text>
        </View>
        <View style={styles.spacingBox}>
          <Text>Padding</Text>
        </View>
      </View>

      {/* Borders */}
      <View style={styles.borderExample}>
        <Text>Border Example</Text>
      </View>

      {/* Shadow (iOS) / Elevation (Android) */}
      <View style={styles.shadowExample}>
        <Text>Shadow/Elevation</Text>
      </View>

      {/* Colors and Opacity */}
      <View style={styles.colorExample}>
        <Text style={styles.colorText}>Color & Opacity</Text>
      </View>
    </View>
  );
};

// ============================================
// FLEXBOX EXAMPLES
// ============================================

const FlexDirectionExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>flexDirection</Text>
      
      <Text style={styles.subtitle}>Column (default - vertical)</Text>
      <View style={[styles.flexContainer, { flexDirection: 'column' }]}>
        <View style={styles.flexBox}><Text>1</Text></View>
        <View style={styles.flexBox}><Text>2</Text></View>
        <View style={styles.flexBox}><Text>3</Text></View>
      </View>

      <Text style={styles.subtitle}>Row (horizontal)</Text>
      <View style={[styles.flexContainer, { flexDirection: 'row' }]}>
        <View style={styles.flexBox}><Text>1</Text></View>
        <View style={styles.flexBox}><Text>2</Text></View>
        <View style={styles.flexBox}><Text>3</Text></View>
      </View>
    </View>
  );
};

const JustifyContentExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>justifyContent</Text>
      
      {['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].map((justify) => (
        <View key={justify} style={styles.justifyItem}>
          <Text style={styles.subtitle}>{justify}</Text>
          <View style={[styles.flexContainer, { justifyContent: justify as any }]}>
            <View style={styles.flexBox}><Text>1</Text></View>
            <View style={styles.flexBox}><Text>2</Text></View>
            <View style={styles.flexBox}><Text>3</Text></View>
          </View>
        </View>
      ))}
    </View>
  );
};

const AlignItemsExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>alignItems</Text>
      
      {['flex-start', 'center', 'flex-end', 'stretch'].map((align) => (
        <View key={align} style={styles.alignItem}>
          <Text style={styles.subtitle}>{align}</Text>
          <View style={[styles.flexContainer, { alignItems: align as any, height: 80 }]}>
            <View style={[styles.flexBox, { height: 40 }]}><Text>1</Text></View>
            <View style={[styles.flexBox, { height: 60 }]}><Text>2</Text></View>
            <View style={[styles.flexBox, { height: 50 }]}><Text>3</Text></View>
          </View>
        </View>
      ))}
    </View>
  );
};

const FlexExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>flex Property</Text>
      
      <View style={[styles.flexContainer, { height: 100 }]}>
        <View style={[styles.flexBox, { flex: 1, backgroundColor: '#ffcdd2' }]}>
          <Text>flex: 1</Text>
        </View>
        <View style={[styles.flexBox, { flex: 2, backgroundColor: '#c8e6c9' }]}>
          <Text>flex: 2</Text>
        </View>
        <View style={[styles.flexBox, { flex: 1, backgroundColor: '#bbdefb' }]}>
          <Text>flex: 1</Text>
        </View>
      </View>
    </View>
  );
};

const CompleteLayoutExample = () => {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Header</Text>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarText}>Sidebar</Text>
        </View>

        {/* Main Area */}
        <View style={styles.main}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Card 1</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>Card 2</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>Card 3</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer</Text>
      </View>
    </View>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const StylingFlexboxExampleApp = () => {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.screenTitle}>Styling & Flexbox Examples</Text>
      
      <StylingBasics />
      <CommonProperties />
      <FlexDirectionExample />
      <JustifyContentExample />
      <AlignItemsExample />
      <FlexExample />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Complete Layout Example</Text>
        <CompleteLayoutExample />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#666',
  },
  box: {
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  highlighted: {
    backgroundColor: '#ffeb3b',
    borderWidth: 2,
    borderColor: '#fbc02d',
  },
  spacingExample: {
    flexDirection: 'row',
    gap: 10,
  },
  spacingBox: {
    flex: 1,
    padding: 15,
    margin: 10,
    backgroundColor: '#e1f5fe',
    borderRadius: 8,
  },
  borderExample: {
    padding: 15,
    borderWidth: 2,
    borderColor: '#2196f3',
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    marginBottom: 10,
  },
  shadowExample: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorExample: {
    padding: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.5)',
    borderRadius: 8,
  },
  colorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  flexContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  flexBox: {
    width: 50,
    height: 50,
    backgroundColor: '#2196f3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  justifyItem: {
    marginBottom: 15,
  },
  alignItem: {
    marginBottom: 15,
  },
  screen: {
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    height: 60,
    backgroundColor: '#2196f3',
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
    justifyContent: 'center',
  },
  sidebarText: {
    fontWeight: 'bold',
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
    height: 80,
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
  cardText: {
    fontWeight: 'bold',
  },
  footer: {
    height: 50,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default StylingFlexboxExampleApp;


