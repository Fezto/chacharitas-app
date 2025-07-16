import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigation/types';

import WelcomeScreen from './screens/welcomeScreen';
import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/homeScreen';
import RegisterScreen from './screens/registerScreen';
import ProductsScreen from './screens/productsScreen';
import ProductDetailScreen from './screens/productDetailScreen';
import CreateProductScreen from './screens/createProductScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}