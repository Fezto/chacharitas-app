import React, { useState, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Text, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

import imageMap from '../utils/imageMap';

type Product = {
  id: number;
  name: string;
  price: number;
  images: { url: string }[];
};

type ProductsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Products'>;

const ProductsScreen = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getLocalImage = (url?: string) => {
    if (url && imageMap[url]) {
      return imageMap[url];
    }
    return require('../assets/defaultImage.png');
  };

  const fetchProducts = async () => {
    try {
      setLoading(true); // asegúrate de mostrar loader en cada refresh
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recarga al volver a enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
      <Card style={styles.card} key={item.id}>
        <Image source={getLocalImage(item.images?.[0]?.url)} style={styles.image} />
        <Card.Content>
          <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
          <Text variant="bodyMedium">${item.price}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#836FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FAB para agregar producto */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: '#bceeff' }]}
        onPress={() => navigation.navigate('CreateProduct')}
        label="Publicar"
      />
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3fd',
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    height: 180,
    width: '100%',
    resizeMode: 'cover',
  },
  name: {
    marginTop: 8,
    color: '#836FFF',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f3fd',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#836FFF',
  },
});
