import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import DrawerNavigator from './DrawerNavigator';

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <NavigationContainer theme={theme}>
        <DrawerNavigator />
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;
