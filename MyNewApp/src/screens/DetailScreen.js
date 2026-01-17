import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Loader from '../components/Loader';

export default function DetailScreen({ route, navigation }) {
  const { theme, toggleTheme } = useTheme();
  const { product } = route.params;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait 1 second after navigation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    toggleButton: {
      padding: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
    },
    image: {
      height: 250,
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 5,
    },
    price: {
      fontSize: 16,
      color: 'green',
      marginBottom: 10,
    },
    description: {
      fontSize: 14,
      color: theme.colors.text,
    },
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Detail</Text>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
          <Ionicons name={theme.dark ? 'sunny' : 'moon'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
      />
      <Text style={styles.title}>
        {product.title}
      </Text>
      <Text style={styles.price}>₹ {product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
}
