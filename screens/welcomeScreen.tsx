import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Ajusta la ruta si es distinta

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logoChacharitas.png')} // Asegúrate que exista el logo
        style={styles.logo}
      />
      <Text style={styles.title}>¡Bienvenido a Chacharitas!</Text>
      <Text style={styles.subtitle}>
        Vistiendo al futuro con recuerdos sostenibles.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.secondaryButtonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#BFA2DB', // lila pastel
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#A2D2FF', // azul pastel
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
