import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !lastName || !email || !password) {
      Alert.alert('Campos requeridos', 'Por favor llena todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          last_name: lastName,
          second_last_name: secondLastName,
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Registro exitoso', data.msg);
        navigation.replace('Login');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Ocurrió un error al registrarse.');
      }
    } catch (error) {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        label="Nombre(s)"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Apellido paterno"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Apellido materno"
        value={secondLastName}
        onChangeText={setSecondLastName}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
        buttonColor="#A2D2FF"
        textColor="black"
      >
        Registrarse
      </Button>

      <Button onPress={() => navigation.navigate('Login')} style={styles.link} textColor='#836FFF'>
        ¿Ya tienes una cuenta? Inicia sesión
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f7f3fd',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#836FFF',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  link: {
    marginTop: 16,
    alignSelf: 'center',
  },
});

export default RegisterScreen;
