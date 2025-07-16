import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, Card } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              ¡Bienvenido!
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Esta es la pantalla principal
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Chacharitas es una plataforma diseñada para fomentar el consumo responsable, 
              ofreciendo productos sostenibles para bebés que permiten apoyar la economía familiar 
              y darle una segunda vida a la ropa y accesorios infantiles.
            </Text>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Products')}
              buttonColor="#836FFF"
              textColor="#fff"
              style={styles.button}
            >
              Ver productos
            </Button>
            <Button
              mode="contained"
              onPress={handleLogout}
              buttonColor="#B19CD9"
              textColor="#fff"
              style={styles.button}
            >
              Cerrar sesión
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f7f3fd',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  container: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {
    marginBottom: 8,
    color: '#836FFF',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 16,
    color: '#666',
    textAlign: 'center',
    fontSize: 18,
  },
  description: {
    color: '#444',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 24,
  },
  button: {
    marginTop: 10,
  },
});
