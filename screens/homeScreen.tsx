import React from 'react';
import { View, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            ¡Bienvenido!
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Esta es la pantalla principal
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleLogout}
            buttonColor="#B19CD9"
            textColor="#fff"
          >
            Cerrar sesión
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3fd',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  },
});
