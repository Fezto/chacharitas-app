import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Products'>;

type Brand = { id: number; name: string };
type Category = { id: number; name: string };
type Color = { id: number; name: string };
type Gender = { id: number; name: string };
type Material = { id: number; name: string };
type Size = { id: number; name: string };

const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  // Datos dropdowns
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  // Selecciones
  const [brandId, setBrandId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [colorId, setColorId] = useState<number | null>(null);
  const [genderId, setGenderId] = useState<number | null>(null);
  const [materialId, setMaterialId] = useState<number | null>(null);
  const [sizeId, setSizeId] = useState<number | null>(null);

  // Menús visibles
  const [brandMenuVisible, setBrandMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [colorMenuVisible, setColorMenuVisible] = useState(false);
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [materialMenuVisible, setMaterialMenuVisible] = useState(false);
  const [sizeMenuVisible, setSizeMenuVisible] = useState(false);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchColors();
    fetchGenders();
    fetchMaterials();
    fetchSizes();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/brands/`);
      if (!res.ok) throw new Error('Error al obtener marcas');
      setBrands(await res.json());
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cargar las marcas');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/categories/`);
      if (!res.ok) throw new Error('Error al obtener categorías');
      setCategories(await res.json());
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cargar las categorías');
    }
  };

  const fetchColors = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/colors/`);
      if (!res.ok) throw new Error('Error al obtener colores');
      setColors(await res.json());
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cargar los colores');
    }
  };

  const fetchGenders = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/genders/`);
      if (!res.ok) throw new Error('Error al obtener géneros');
      setGenders(await res.json());
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cargar los géneros');
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/materials/`);
      if (!res.ok) throw new Error('Error al obtener materiales');
      setMaterials(await res.json());
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cargar los materiales');
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/sizes/`);
      if (!res.ok) throw new Error('Error al obtener tallas');
      setSizes(await res.json());
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cargar las tallas');
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !brandId || !categoryId || !colorId || !genderId || !materialId || !sizeId) {
      Alert.alert('Faltan campos obligatorios', 'Completa todos los campos obligatorios.');
      return;
    }
  
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            price: parseFloat(price),
            quantity: quantity ? parseInt(quantity) : undefined,
            description,
            user_id: 1,
            brand_id: brandId,
            category_id: categoryId,
            color_id: colorId,  
            gender_id: genderId,
            material_id: materialId,
            size_id: sizeId,
          }),
      });
  
      if (!response.ok) throw new Error('Error al crear el producto');
  
      Alert.alert('Producto creado');
      navigation.navigate('Products');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el producto');
    }
  };

  return (

    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Crear nuevo producto</Text>

      <TextInput label="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput label="Cantidad" value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={styles.input} />
      <TextInput label="Descripción" value={description} onChangeText={setDescription} multiline style={styles.input} />

      {/* Dropdowns */}
      {[
        { label: 'Marca', data: brands, id: brandId, setId: setBrandId, visible: brandMenuVisible, setVisible: setBrandMenuVisible },
        { label: 'Categoría', data: categories, id: categoryId, setId: setCategoryId, visible: categoryMenuVisible, setVisible: setCategoryMenuVisible },
        { label: 'Color', data: colors, id: colorId, setId: setColorId, visible: colorMenuVisible, setVisible: setColorMenuVisible },
        { label: 'Género', data: genders, id: genderId, setId: setGenderId, visible: genderMenuVisible, setVisible: setGenderMenuVisible },
        { label: 'Material', data: materials, id: materialId, setId: setMaterialId, visible: materialMenuVisible, setVisible: setMaterialMenuVisible },
        { label: 'Talla', data: sizes, id: sizeId, setId: setSizeId, visible: sizeMenuVisible, setVisible: setSizeMenuVisible },
      ].map(({ label, data, id, setId, visible, setVisible }) => (
        <View key={label} style={styles.dropdownContainer}>
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setVisible(true)}
                style={styles.dropdownButton}
              >
                { data.find(item => item.id === id)?.name || `Selecciona ${label.toLowerCase()}` }

              </Button>
            }
          >
            {data.map(item => (
              <Menu.Item
                key={item.id}
                onPress={() => {
                  setId(item.id);
                  setVisible(false);
                }}
                title={item.name}
              />
            ))}
          </Menu>
        </View>
      ))}

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Publicar producto
      </Button>
    </ScrollView>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#f7f3fd',
      flexGrow: 1,
    },
    title: {
      marginBottom: 16,
      color: '#836FFF',
      fontWeight: 'bold',
      fontSize: 24,
      textAlign: 'center',
    },
    input: {
      marginBottom: 12,
      backgroundColor: '#fff',
      borderRadius: 4,
    },
    dropdownContainer: {
      marginBottom: 12,
    },
    dropdownButton: {
      justifyContent: 'flex-start',
      backgroundColor: '#e6f0d9',
      borderColor: '#a2c28d',
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 12,
    },
    button: {
      marginTop: 16,
      backgroundColor: '#836FFF',
      borderRadius: 6,
      paddingVertical: 8,
    },
  });
  
