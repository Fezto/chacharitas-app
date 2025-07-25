import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Modal, TouchableOpacity, FlatList } from 'react-native';
import { TextInput, Button, Text, Checkbox } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Products'>;

const UpdateProductScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { productId } = route.params as { productId: number };

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [genders, setGenders] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);

  const [brandId, setBrandId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [colorIds, setColorIds] = useState<number[]>([]);
  const [genderIds, setGenderIds] = useState<number[]>([]);
  const [materialIds, setMaterialIds] = useState<number[]>([]);
  const [sizeIds, setSizeIds] = useState<number[]>([]);

  const [modalVisible, setModalVisible] = useState<{ field: string | null }>({ field: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        brandsRes, categoriesRes, colorsRes, gendersRes, materialsRes, sizesRes, productRes
      ] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/brands/`),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/categories/`),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/colors/`),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/genders/`),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/materials/`),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/sizes/`),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`)
      ]);

      if (!productRes.ok) throw new Error('Error al obtener producto');

      setBrands(await brandsRes.json());
      setCategories(await categoriesRes.json());
      setColors(await colorsRes.json());
      setGenders(await gendersRes.json());
      setMaterials(await materialsRes.json());
      setSizes(await sizesRes.json());

      const product = await productRes.json();
      setName(product.name);
      setPrice(product.price.toString());
      setQuantity(product.quantity?.toString() || '');
      setDescription(product.description || '');
      setBrandId(product.brand?.id || null);
      setCategoryId(product.category?.id || null);
      setColorIds(product.colors.map((c: any) => c.id));
      setGenderIds(product.genders.map((g: any) => g.id));
      setMaterialIds(product.materials.map((m: any) => m.id));
      setSizeIds(product.sizes.map((s: any) => s.id));

      setLoading(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cargar la información');
    }
  };

  const toggleSelection = (
    id: number,
    selectedArray: number[],
    setSelectedArray: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    if (selectedArray.includes(id)) {
      setSelectedArray(selectedArray.filter(i => i !== id));
    } else {
      setSelectedArray([...selectedArray, id]);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          quantity: quantity ? parseInt(quantity) : null,
          brand_id: brandId,
          category_id: categoryId,
          description,
          color_ids: colorIds,
          gender_ids: genderIds,
          material_ids: materialIds,
          size_ids: sizeIds,
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar el producto');

      Alert.alert('Producto actualizado');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo actualizar');
    }
  };

  const renderMultiSelectModal = (
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<{ field: string | null }>>,
    title: string,
    data: { id: number; name: string }[],
    selectedIds: number[],
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
  ) => (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>{`Selecciona ${title}`}</Text>
          <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => toggleSelection(item.id, selectedIds, setSelectedIds)}
              >
                <Checkbox status={selectedIds.includes(item.id) ? 'checked' : 'unchecked'} />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button onPress={() => setVisible({ field: null })} style={{ marginTop: 12 }}>Cerrar</Button>
        </View>
      </View>
    </Modal>
  );

  if (loading) return <Text>Cargando producto...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Editar producto</Text>

      <TextInput label="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput label="Cantidad" value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={styles.input} />
      <TextInput label="Descripción" value={description} onChangeText={setDescription} multiline style={styles.input} />

      <Button mode="outlined" onPress={() => setModalVisible({ field: 'brand' })} style={styles.dropdownButton}>
        {brands.find(b => b.id === brandId)?.name || 'Selecciona marca'}
      </Button>
      <Button mode="outlined" onPress={() => setModalVisible({ field: 'category' })} style={styles.dropdownButton}>
        {categories.find(c => c.id === categoryId)?.name || 'Selecciona categoría'}
      </Button>

      <Button mode="outlined" onPress={() => setModalVisible({ field: 'colors' })} style={styles.dropdownButton}>
        {colorIds.length > 0 ? `${colorIds.length} colores seleccionados` : 'Selecciona colores'}
      </Button>

      <Button mode="outlined" onPress={() => setModalVisible({ field: 'genders' })} style={styles.dropdownButton}>
        {genderIds.length > 0 ? `${genderIds.length} géneros seleccionados` : 'Selecciona géneros'}
      </Button>

      <Button mode="outlined" onPress={() => setModalVisible({ field: 'materials' })} style={styles.dropdownButton}>
        {materialIds.length > 0 ? `${materialIds.length} materiales seleccionados` : 'Selecciona materiales'}
      </Button>

      <Button mode="outlined" onPress={() => setModalVisible({ field: 'sizes' })} style={styles.dropdownButton}>
        {sizeIds.length > 0 ? `${sizeIds.length} tallas seleccionadas` : 'Selecciona tallas'}
      </Button>

      {/* Modales simples para marca y categoría */}
      {modalVisible.field === 'brand' && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text variant="titleMedium" style={{ marginBottom: 12 }}>Selecciona marca</Text>
              <FlatList
                data={brands}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setBrandId(item.id);
                      setModalVisible({ field: null });
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button onPress={() => setModalVisible({ field: null })}>Cerrar</Button>
            </View>
          </View>
        </Modal>
      )}

      {modalVisible.field === 'category' && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text variant="titleMedium" style={{ marginBottom: 12 }}>Selecciona categoría</Text>
              <FlatList
                data={categories}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setCategoryId(item.id);
                      setModalVisible({ field: null });
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button onPress={() => setModalVisible({ field: null })}>Cerrar</Button>
            </View>
          </View>
        </Modal>
      )}

      {/* Modales multi selección para colores, géneros, materiales y tallas */}
      {modalVisible.field === 'colors' && renderMultiSelectModal(true, setModalVisible, 'colores', colors, colorIds, setColorIds)}
      {modalVisible.field === 'genders' && renderMultiSelectModal(true, setModalVisible, 'géneros', genders, genderIds, setGenderIds)}
      {modalVisible.field === 'materials' && renderMultiSelectModal(true, setModalVisible, 'materiales', materials, materialIds, setMaterialIds)}
      {modalVisible.field === 'sizes' && renderMultiSelectModal(true, setModalVisible, 'tallas', sizes, sizeIds, setSizeIds)}

      <Button mode="contained" onPress={handleUpdate} style={{ marginTop: 24 }}>
        Guardar cambios
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  dropdownButton: {
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 6,
    maxHeight: '80%',
    padding: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default UpdateProductScreen;
