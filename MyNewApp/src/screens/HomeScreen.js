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

const LIMIT = 10;

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch products with pagination
  const fetchProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${LIMIT}&skip=${page * LIMIT}`
      );
      const data = await response.json();

      setProducts(prev => [...prev, ...data.products]);

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

  // Load first page
  useEffect(() => {
    fetchProducts();
  }, []);

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
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={fetchProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;
