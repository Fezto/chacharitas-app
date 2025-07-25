import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, Button } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tus datos');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token } = response.data;
      await AsyncStorage.setItem('token', access_token);
      Alert.alert('Éxito', 'Sesión iniciada correctamente');

      navigation.navigate('Home');
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail;
      if (detail === 'Credenciales inválidas') {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      } else {
        Alert.alert('Error', detail || 'Error de red');
      }
    } finally {
      setLoading(false); // Aquí se asegura que loading vuelva a false
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/login.png')} style={styles.image} resizeMode="contain" />

      <Text variant="headlineMedium" style={styles.title}>
        Iniciar sesión
      </Text>

      <TextInput
        label="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
        buttonColor="#B19CD9"
      >
        Iniciar sesión
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        textColor="#836FFF"
        style={{ marginTop: 16 }}
      >
        ¿No tienes cuenta? Regístrate
      </Button>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3fd',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: '100%',
    height: 180,
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#836FFF',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
});
