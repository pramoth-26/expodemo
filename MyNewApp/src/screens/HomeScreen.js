import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fetchProducts } from '../api/productsApi';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const LIMIT = 10;

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch products with pagination
  const loadProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const data = await fetchProducts(LIMIT, page * LIMIT);

      setProducts(prev => {
        const newProducts = [...prev, ...data.products];

        // If no products and this is the first load, add sample data
        if (newProducts.length === 0 && page === 0) {
          console.log('No products found, adding sample data...');
          addSampleDataIfEmpty();
        }

        return newProducts;
      });

      if (data.products.length < LIMIT) {
        setHasMore(false);
      }

      setPage(prev => prev + 1);
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render single product
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { product: item })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>₹ {item.price}</Text>
    </TouchableOpacity>
  );

  // Loader at bottom
  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" style={{ marginVertical: 20 }} />;
  };

  // Load first page
  useEffect(() => {
    loadProducts();
  }, []);

  // Add sample data if collection is empty
  const addSampleDataIfEmpty = async () => {
    try {
      const sampleProducts = [
        {
          id: 1,
          title: 'iPhone 15 Pro',
          price: 999,
          thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          description: 'Latest iPhone with advanced features'
        },
        {
          id: 2,
          title: 'MacBook Air M3',
          price: 1099,
          thumbnail: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
          description: 'Powerful laptop for professionals'
        },
        {
          id: 3,
          title: 'AirPods Pro',
          price: 249,
          thumbnail: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c9bf1d?w=400',
          description: 'Wireless earbuds with noise cancellation'
        }
      ];

      console.log('Adding sample products...');
      for (const product of sampleProducts) {
        await addDoc(collection(db, 'products'), product);
        console.log(`Added product: ${product.title}`);
      }
      console.log('Sample products added successfully!');

      // Reload products after adding
      setProducts([]);
      setPage(0);
      setHasMore(true);
      loadProducts();
    } catch (error) {
      console.error('Error adding sample products:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    toggleButton: {
      padding: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      padding: 10,
      marginBottom: 15,
      elevation: 2,
    },
    image: {
      width: '100%',
      height: 180,
      borderRadius: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 8,
      color: theme.colors.text,
    },
    price: {
      fontSize: 14,
      color: 'green',
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
          <Ionicons name={theme.dark ? 'sunny' : 'moon'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={item => item.docId}
        renderItem={renderItem}
        onEndReached={loadProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;
