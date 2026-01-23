
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme, useStyles } from '../context/ThemeContext';
import { fetchProducts } from '../api/productsApi';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { designSystem } from '../styles/themeUtils';

const { spacing } = designSystem;

const HomeScreen = ({ navigation }) => {
  // Theme context for light/dark mode
  const { theme, toggleTheme } = useTheme();
  const globalStyles = useStyles();
  // Array of products fetched from Firebase
  const [products, setProducts] = useState([]);
  // Sorting option: 'asc', 'desc', or null
  const [sortBy, setSortBy] = useState(null);
  // Selected category filter: 'All' or specific category
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Visibility state for sort/filter modal
  const [modalVisible, setModalVisible] = useState(false);
  // Last document reference for pagination
  const [lastDoc, setLastDoc] = useState(null);
  // Loading state for data fetching
  const [loading, setLoading] = useState(false);
  // Flag to indicate if more products are available for pagination
  const [hasMore, setHasMore] = useState(true);

  // Logout function
  /**
   * Handles user logout by signing out from Firebase Auth
   * @async
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // Fetch products
  /**
   * Fetches initial set of products from Firebase and handles empty collection
   * @async
   */
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(15);
      setProducts(data.products);
      setLastDoc(data.lastDoc);
      setHasMore(data.products.length === 15);

      // If no products, add sample data
      if (data.products.length === 0) {
        console.log('No products found, adding sample data...');
        await addSampleDataIfEmpty();
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more products
  /**
   * Loads additional products for pagination with a delay for better UX
   * @async
   */
  const loadMoreProducts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const data = await fetchProducts(15, lastDoc);
      // Add a 0.5 second delay before showing new items
      setTimeout(() => {
        setProducts(prev => {
          const combined = [...prev, ...data.products];
          const unique = Array.from(
          new Map(combined.map(item => [item.docId, item])).values()
        );
  return unique;
});
        setLastDoc(data.lastDoc);
        setHasMore(data.products.length === 15);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.log('Error fetching more products:', error);
      setLoading(false);
    }
  };

  // Render single product
  /**
   * Renders a single product item in the FlatList
   * @param {Object} item - Product object with title, price, thumbnail, etc.
   * @returns {JSX.Element} Touchable product card
   */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={globalStyles.productCard}
      onPress={() => navigation.navigate('Detail', { product: item })}
    >
      <Image source={{ uri: item.thumbnail }} style={globalStyles.productImage} />
      <View style={globalStyles.productInfo}>
        <Text style={globalStyles.productTitle}>{item.title}</Text>
        <Text style={globalStyles.productPrice}>₹ {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Reload products when category filter changes
  useEffect(() => {
    if (selectedCategory !== 'All') {
      loadProducts();
    }
  }, [selectedCategory]);

  // Add sample data if collection is empty
  /**
   * Adds sample product data to Firestore if the products collection is empty
   * @async
   */
  const addSampleDataIfEmpty = async () => {
    try {
      const sampleProducts = [
        {
          id: 1,
          title: 'iPhone 15 Pro',
          price: 999,
          thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          description: 'Latest iPhone with advanced features',
          category: 'Smartphones'
        },
        {
          id: 2,
          title: 'MacBook Air M3',
          price: 1099,
          thumbnail: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
          description: 'Powerful laptop for professionals',
          category: 'laptops'
        },
        {
          id: 3,
          title: 'AirPods Pro',
          price: 8000,
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/AirPods_Pro_%282nd_generation%29.jpg',
          description: 'Wireless earbuds with noise cancellation',
          category: 'mobile accessories'
        }
      ];

      console.log('Adding sample products...');
      for (const product of sampleProducts) {
        await addDoc(collection(db, 'products'), product);
        console.log(`Added product: ${product.title}`);
      }
      console.log('Sample products added successfully!');

      // Reload products after adding
      loadProducts();
    } catch (error) {
      console.error('Error adding sample products:', error);
    }
  };

  // Filtered and sorted products
  /**
   * Memoized computation of filtered and sorted products based on current filters
   * @returns {Array} Filtered and sorted array of products
   */
  const filteredProducts = useMemo(() => {
    let filtered = products;
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    // Apply price sorting
    if (sortBy === 'asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, sortBy, selectedCategory]);

  // Styles for the HomeScreen component
  const localStyles = StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      marginHorizontal: spacing.lg,
    },
    filterSection: {
      flex: 1,
      marginHorizontal: spacing.sm,
    },
    filterLabel: {
      ...globalStyles.inputLabel,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    checkboxText: {
      marginLeft: spacing.md,
      color: theme.colors.text,
      fontSize: 14,
    },
  });

  // Main render function
  return (
    <View style={globalStyles.container}>
      {/* Header section with title and action buttons */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.heading2}>Products</Text>
        <View style={globalStyles.row}>
          <TouchableOpacity style={{ padding: spacing.md }} onPress={() => setModalVisible(true)}>
            <Ionicons name="filter" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: spacing.md }} onPress={toggleTheme}>
            <Ionicons name={theme.dark ? 'sunny' : 'moon'} size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: spacing.md }} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Product list with infinite scroll */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.docId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
        ListFooterComponent={loading ? <View style={globalStyles.loaderContainer}><Text style={globalStyles.body}>Loading...</Text></View> : null}
      />
      {/* Filter modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modal}>
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.heading2}>Filters</Text>
            <View style={localStyles.filterContainer}>
              <View style={localStyles.filterSection}>
                <Text style={localStyles.filterLabel}>Category:</Text>
                {['All', 'Smartphones', 'laptops', 'mobile accessories', 'home appliances'].map(category => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={localStyles.checkboxContainer}
                  >
                    <Ionicons
                      name={selectedCategory === category ? 'checkmark-circle' : 'radio-button-off'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={localStyles.checkboxText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={localStyles.filterSection}>
                <Text style={localStyles.filterLabel}>Sort by Price:</Text>
                {[
                  { label: 'None', value: null },
                  { label: 'Low to High', value: 'asc' },
                  { label: 'High to Low', value: 'desc' }
                ].map(item => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setSortBy(item.value)}
                    style={localStyles.checkboxContainer}
                  >
                    <Ionicons
                      name={sortBy === item.value ? 'checkmark-circle' : 'radio-button-off'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={localStyles.checkboxText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={globalStyles.primaryButton} onPress={() => setModalVisible(false)}>
              <Text style={globalStyles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
