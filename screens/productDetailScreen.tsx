import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Chip, Button, Dialog, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import imageMap from '../utils/imageMap';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  route: ProductDetailScreenRouteProp;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  brand?: { name: string };
  category?: { name: string };
  images?: { url: string }[];
  colors?: { name: string }[];
  genders?: { name: string }[];
  materials?: { name: string }[];
  sizes?: { name: string }[];
};

const ProductDetailScreen: React.FC<Props> = ({ route }) => {
  const { productId } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const getLocalImage = (url?: string) => {
    if (url && imageMap[url]) {
      return imageMap[url];
    }
    return require('../assets/defaultImage.png');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleEdit = () => {
    navigation.navigate('UpdateProduct', { productId }); 
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
      navigation.goBack();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteDialogVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#836FFF" />
        <Text>Cargando producto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Producto no disponible</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={getLocalImage(product.images?.[0]?.url)} style={styles.image} />

        <Text variant="headlineMedium" style={styles.title}>{product.name}</Text>
        <Text variant="titleMedium" style={styles.price}>${product.price}</Text>

        <Text variant="bodyMedium" style={styles.description}>
          {product.description ?? 'Sin descripción disponible.'}
        </Text>

        <Text style={styles.label}>Marca:</Text>
        <Text style={styles.text}>{product.brand?.name ?? 'Desconocida'}</Text>

        <Text style={styles.label}>Categoría:</Text>
        <Text style={styles.text}>{product.category?.name ?? 'Desconocida'}</Text>

        <Text style={styles.label}>Colores:</Text>
        <View style={styles.chipContainer}>
          {(product.colors ?? []).map((color, i) => (
            <Chip key={i.toString()} style={styles.chip}>{color.name}</Chip>
          ))}
          {(product.colors ?? []).length === 0 && <Text style={styles.text}>No disponible</Text>}
        </View>

        <Text style={styles.label}>Géneros:</Text>
        <View style={styles.chipContainer}>
          {(product.genders ?? []).map((gender, i) => (
            <Chip key={i.toString()} style={styles.chip}>{gender.name}</Chip>
          ))}
          {(product.genders ?? []).length === 0 && <Text style={styles.text}>No disponible</Text>}
        </View>

        <Text style={styles.label}>Materiales:</Text>
        <View style={styles.chipContainer}>
          {(product.materials ?? []).map((material, i) => (
            <Chip key={i.toString()} style={styles.chip}>{material.name}</Chip>
          ))}
          {(product.materials ?? []).length === 0 && <Text style={styles.text}>No disponible</Text>}
        </View>

        <Text style={styles.label}>Tallas:</Text>
        <View style={styles.chipContainer}>
          {(product.sizes ?? []).map((size, i) => (
            <Chip key={i.toString()} style={styles.chip}>{size.name}</Chip>
          ))}
          {(product.sizes ?? []).length === 0 && <Text style={styles.text}>No disponible</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleEdit} style={styles.editButton}>
            Editar producto
          </Button>
          <Button mode="contained" buttonColor="#FF6B6B" onPress={() => setDeleteDialogVisible(true)}>
            Eliminar producto
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Confirmar eliminación</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de que quieres eliminar este producto?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleDelete}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f3fd',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    color: '#836FFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    color: '#444',
    marginBottom: 16,
  },
  description: {
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#836FFF',
    marginBottom: 4,
  },
  text: {
    marginBottom: 12,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#B19CD9',
    marginRight: 8,
    marginBottom: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#836FFF',
  },
});
