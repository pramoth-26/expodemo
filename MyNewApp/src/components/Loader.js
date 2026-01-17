import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Loader() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {
      marginTop: 10,
      fontSize: 16,
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      {/* Loading Symbol */}
      <ActivityIndicator size="large" color={theme.colors.primary} />

      {/* Loading Text */}
      <Text style={styles.text}>Loading products...</Text>
    </View>
  );
}
