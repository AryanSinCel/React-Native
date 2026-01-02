/**
 * Lists Examples - ScrollView, FlatList, SectionList
 * Demonstrates different list components and their use cases
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

// ============================================
// SCROLLVIEW EXAMPLES
// ============================================

export const ScrollViewExample = () => {
  const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScrollView Example</Text>
      <Text style={styles.subtitle}>Good for small, static lists</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const HorizontalScrollView = () => {
  const items = Array.from({ length: 20 }, (_, i) => `Card ${i + 1}`);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horizontal ScrollView</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContent}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.horizontalCard}>
            <Text style={styles.cardText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ============================================
// FLATLIST EXAMPLES
// ============================================

export const BasicFlatList = () => {
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i.toString(),
    title: `Item ${i + 1}`,
    description: `This is item number ${i + 1} in the list`,
  }));

  const renderItem = ({ item }: { item: typeof data[0] }) => (
    <View style={styles.flatListItem}>
      <Text style={styles.flatListTitle}>{item.title}</Text>
      <Text style={styles.flatListDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlatList Example</Text>
      <Text style={styles.subtitle}>Optimized for large lists (100 items)</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export const RefreshableFlatList = () => {
  const [data, setData] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      title: `Item ${i + 1}`,
    }))
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newData = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i.toString(),
      title: `Refreshed Item ${i + 1}`,
    }));
    setData(newData);
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pull-to-Refresh FlatList</Text>
      <Text style={styles.subtitle}>Pull down to refresh</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.flatListItem}>
            <Text style={styles.flatListTitle}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={styles.list}
      />
    </View>
  );
};

export const InfiniteScrollFlatList = () => {
  const [data, setData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i.toString(),
      title: `Item ${i + 1}`,
    }))
  );
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newData = Array.from({ length: 20 }, (_, i) => ({
      id: (data.length + i).toString(),
      title: `Item ${data.length + i + 1}`,
    }));

    setData((prevData) => [...prevData, ...newData]);
    setLoading(false);
  }, [data.length, loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Infinite Scroll FlatList</Text>
      <Text style={styles.subtitle}>Scroll to bottom to load more</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.flatListItem}>
            <Text style={styles.flatListTitle}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" style={styles.loader} /> : null
        }
        style={styles.list}
      />
    </View>
  );
};

export const HorizontalFlatList = () => {
  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i.toString(),
    title: `Card ${i + 1}`,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horizontal FlatList</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.horizontalCard}>
            <Text style={styles.cardText}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContent}
      />
    </View>
  );
};

export const FlatListWithSeparators = () => {
  const data = Array.from({ length: 20 }, (_, i) => ({
    id: i.toString(),
    title: `Item ${i + 1}`,
  }));

  const ItemSeparator = () => <View style={styles.separator} />;

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>List Header</Text>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>List Footer</Text>
    </View>
  );

  const EmptyComponent = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No items found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlatList with Separators & Headers</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.flatListItem}>
            <Text style={styles.flatListTitle}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={EmptyComponent}
        style={styles.list}
      />
    </View>
  );
};

// ============================================
// SECTIONLIST EXAMPLES
// ============================================

export const BasicSectionList = () => {
  const DATA = [
    {
      title: 'Fruits',
      data: ['Apple', 'Banana', 'Orange', 'Grape', 'Mango'],
    },
    {
      title: 'Vegetables',
      data: ['Carrot', 'Broccoli', 'Spinach', 'Tomato', 'Cucumber'],
    },
    {
      title: 'Dairy',
      data: ['Milk', 'Cheese', 'Yogurt', 'Butter'],
    },
    {
      title: 'Grains',
      data: ['Rice', 'Wheat', 'Oats', 'Barley'],
    },
  ];

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.sectionItem}>
      <Text style={styles.sectionItemText}>{item}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SectionList Example</Text>
      <Text style={styles.subtitle}>Grouped data with section headers</Text>
      <SectionList
        sections={DATA}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => item + index}
        stickySectionHeadersEnabled={true}
        style={styles.list}
      />
    </View>
  );
};

export const ComplexSectionList = () => {
  const [sections, setSections] = useState([
    {
      id: '1',
      title: 'To Do',
      data: [
        { id: '1', task: 'Buy groceries', completed: false },
        { id: '2', task: 'Finish project', completed: false },
        { id: '3', task: 'Call dentist', completed: false },
      ],
    },
    {
      id: '2',
      title: 'In Progress',
      data: [
        { id: '4', task: 'Write documentation', completed: false },
        { id: '5', task: 'Review code', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Completed',
      data: [
        { id: '6', task: 'Setup project', completed: true },
        { id: '7', task: 'Design UI', completed: true },
      ],
    },
  ]);

  const toggleTask = (sectionId: string, taskId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            data: section.data.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            ),
          };
        }
        return section;
      })
    );
  };

  const renderItem = ({
    item,
    section,
  }: {
    item: { id: string; task: string; completed: boolean };
    section: { id: string; title: string };
  }) => (
    <TouchableOpacity
      style={styles.sectionItem}
      onPress={() => toggleTask(section.id, item.id)}
    >
      <Text
        style={[
          styles.sectionItemText,
          item.completed && styles.completedText,
        ]}
      >
        {item.task}
      </Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; data: any[] };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        {section.title} ({section.data.length})
      </Text>
    </View>
  );

  const renderSectionFooter = ({
    section,
  }: {
    section: { data: any[] };
  }) => (
    <View style={styles.sectionFooter}>
      <Text style={styles.footerText}>
        {section.data.length} item(s) in this section
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complex SectionList</Text>
      <Text style={styles.subtitle}>Task list with sections</Text>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={true}
        style={styles.list}
      />
    </View>
  );
};

// ============================================
// MAIN EXAMPLE APP
// ============================================

export const ListsExampleApp = () => {
  const [activeTab, setActiveTab] = useState<'scrollview' | 'flatlist' | 'sectionlist'>('scrollview');

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Lists Examples</Text>

      {/* Tab Navigation */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scrollview' && styles.activeTab]}
          onPress={() => setActiveTab('scrollview')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'scrollview' && styles.activeTabText,
            ]}
          >
            ScrollView
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'flatlist' && styles.activeTab]}
          onPress={() => setActiveTab('flatlist')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'flatlist' && styles.activeTabText,
            ]}
          >
            FlatList
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sectionlist' && styles.activeTab]}
          onPress={() => setActiveTab('sectionlist')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'sectionlist' && styles.activeTabText,
            ]}
          >
            SectionList
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'scrollview' && (
          <ScrollView>
            <ScrollViewExample />
            <HorizontalScrollView />
          </ScrollView>
        )}

        {activeTab === 'flatlist' && (
          <ScrollView>
            <BasicFlatList />
            <RefreshableFlatList />
            <InfiniteScrollFlatList />
            <HorizontalFlatList />
            <FlatListWithSeparators />
          </ScrollView>
        )}

        {activeTab === 'sectionlist' && (
          <ScrollView>
            <BasicSectionList />
            <ComplexSectionList />
          </ScrollView>
        )}
      </View>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 16,
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
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  scrollView: {
    maxHeight: 200,
  },
  scrollContent: {
    padding: 10,
  },
  item: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  horizontalContent: {
    padding: 10,
  },
  horizontalCard: {
    width: 120,
    height: 100,
    backgroundColor: '#2196f3',
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    maxHeight: 300,
  },
  listContent: {
    padding: 10,
  },
  flatListItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  flatListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  flatListDescription: {
    fontSize: 14,
    color: '#666',
  },
  loader: {
    padding: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
  },
  header: {
    padding: 15,
    backgroundColor: '#e3f2fd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  footer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  sectionHeader: {
    backgroundColor: '#2196f3',
    padding: 15,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionItemText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  sectionFooter: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default ListsExampleApp;


