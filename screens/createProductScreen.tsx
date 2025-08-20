import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { TextInput, Button, Text, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Products">;

type Brand = { id: number; name: string };
type Category = { id: number; name: string };
type Color = { id: number; name: string };
type Gender = { id: number; name: string };
type Material = { id: number; name: string };
type Size = { id: number; name: string };

const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

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
  const [colorIds, setColorIds] = useState<number[]>([]);
  const [genderIds, setGenderIds] = useState<number[]>([]);
  const [materialIds, setMaterialIds] = useState<number[]>([]);
  const [sizeIds, setSizeIds] = useState<number[]>([]);

  // Modales visibles
  const [modalVisible, setModalVisible] = useState<{ field: string | null }>({
    field: null,
  });

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchColors();
    fetchGenders();
    fetchMaterials();
    fetchSizes();
  }, []);

  // Funciones para fetch (igual que antes)
  const fetchBrands = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/brands/`);
      if (!res.ok) throw new Error("Error al obtener marcas");
      setBrands(await res.json());
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo cargar las marcas");
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/categories/`);
      if (!res.ok) throw new Error("Error al obtener categorías");
      setCategories(await res.json());
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo cargar las categorías");
    }
  };
  const fetchColors = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/colors/`);
      if (!res.ok) throw new Error("Error al obtener colores");
      setColors(await res.json());
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo cargar los colores");
    }
  };
  const fetchGenders = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/genders/`);
      if (!res.ok) throw new Error("Error al obtener géneros");
      setGenders(await res.json());
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo cargar los géneros");
    }
  };
  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/materials/`);
      if (!res.ok) throw new Error("Error al obtener materiales");
      setMaterials(await res.json());
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo cargar los materiales");
    }
  };
  const fetchSizes = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/sizes/`);
      if (!res.ok) throw new Error("Error al obtener tallas");
      setSizes(await res.json());
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo cargar las tallas");
    }
  };

  // Función para toggle selection múltiple
  const toggleSelection = (
    id: number,
    selectedArray: number[],
    setSelectedArray: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    if (selectedArray.includes(id)) {
      setSelectedArray(selectedArray.filter((i) => i !== id));
    } else {
      setSelectedArray([...selectedArray, id]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !brandId || !categoryId) {
      Alert.alert(
        "Faltan campos obligatorios",
        "Completa al menos nombre, precio, marca y categoría."
      );
      return;
    }

    try {
      // Preparar datos compatibles con tu API actualizada
      const productData = {
        name,
        price: parseFloat(price),
        quantity: quantity ? parseInt(quantity) : null,
        description: description || null,
        user_id: 1, // Hardcodeado por ahora
        brand_id: brandId,
        category_id: categoryId,
        // Enviar arrays directamente (compatible con tu API actualizada)
        color_ids: colorIds.length > 0 ? colorIds : [],
        gender_ids: genderIds.length > 0 ? genderIds : [],
        material_ids: materialIds.length > 0 ? materialIds : [],
        size_ids: sizeIds.length > 0 ? sizeIds : [],
      };

      console.log(
        "📤 Enviando datos del producto:",
        JSON.stringify(productData, null, 2)
      );

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/products/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const responseText = await response.text();
      console.log("📥 Respuesta del servidor:", responseText);

      if (!response.ok) {
        let errorMessage = "Error al crear el producto";
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              // Errores de validación de FastAPI/Pydantic
              errorMessage = errorData.detail
                .map((err: any) => `${err.loc?.join(".")}: ${err.msg}`)
                .join("\n");
            } else if (typeof errorData.detail === "string") {
              errorMessage = errorData.detail;
            }
          }
        } catch (e) {
          errorMessage = `Error ${response.status}: ${
            responseText || response.statusText
          }`;
        }
        throw new Error(errorMessage);
      }

      const createdProduct = JSON.parse(responseText);
      console.log("✅ Producto creado exitosamente:", createdProduct);

      Alert.alert("¡Éxito!", `Producto "${name}" publicado exitosamente`, [
        { text: "OK", onPress: () => navigation.navigate("Products") },
      ]);
    } catch (e: any) {
      console.error("❌ Error detallado:", e);
      Alert.alert("Error", e.message || "No se pudo crear el producto");
    }
  };

  // Render para selección múltiple en modal
  const renderMultiSelectModal = (
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<{ field: string | null }>>,
    title: string,
    data: { id: number; name: string }[],
    selectedIds: number[],
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => setVisible({ field: null })}
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text
            variant="titleMedium"
            style={{ marginBottom: 12 }}
          >{`Selecciona ${title}`}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() =>
                  toggleSelection(item.id, selectedIds, setSelectedIds)
                }
              >
                <Checkbox
                  status={
                    selectedIds.includes(item.id) ? "checked" : "unchecked"
                  }
                />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button
            onPress={() => setVisible({ field: null })}
            style={{ marginTop: 12 }}
          >
            Cerrar
          </Button>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Crear nuevo producto
      </Text>

      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
      />

      {/* Dropdowns simples para brand y category */}
      <Button
        mode="outlined"
        onPress={() => setModalVisible({ field: "brand" })}
        style={styles.dropdownButton}
      >
        {brands.find((b) => b.id === brandId)?.name || "Selecciona marca"}
      </Button>
      <Button
        mode="outlined"
        onPress={() => setModalVisible({ field: "category" })}
        style={styles.dropdownButton}
      >
        {categories.find((c) => c.id === categoryId)?.name ||
          "Selecciona categoría"}
      </Button>

      {/* Botones para abrir modal multiselección - Ahora opcionales */}
      <Button
        mode="outlined"
        onPress={() => setModalVisible({ field: "colors" })}
        style={styles.dropdownButton}
      >
        {colorIds.length > 0
          ? colors
              .filter((c) => colorIds.includes(c.id))
              .map((c) => c.name)
              .join(", ")
          : "Selecciona colores (opcional)"}
      </Button>

      <Button
        mode="outlined"
        onPress={() => setModalVisible({ field: "genders" })}
        style={styles.dropdownButton}
      >
        {genderIds.length > 0
          ? genders
              .filter((g) => genderIds.includes(g.id))
              .map((g) => g.name)
              .join(", ")
          : "Selecciona géneros (opcional)"}
      </Button>

      <Button
        mode="outlined"
        onPress={() => setModalVisible({ field: "materials" })}
        style={styles.dropdownButton}
      >
        {materialIds.length > 0
          ? materials
              .filter((m) => materialIds.includes(m.id))
              .map((m) => m.name)
              .join(", ")
          : "Selecciona materiales (opcional)"}
      </Button>

      <Button
        mode="outlined"
        onPress={() => setModalVisible({ field: "sizes" })}
        style={styles.dropdownButton}
      >
        {sizeIds.length > 0
          ? sizes
              .filter((s) => sizeIds.includes(s.id))
              .map((s) => s.name)
              .join(", ")
          : "Selecciona tallas (opcional)"}
      </Button>

      {/* Renderizamos el modal según qué campo abrir */}
      {modalVisible.field === "brand" && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible({ field: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                Selecciona marca
              </Text>
              <FlatList
                data={brands}
                keyExtractor={(item) => item.id.toString()}
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
              <Button
                onPress={() => setModalVisible({ field: null })}
                style={{ marginTop: 12 }}
              >
                Cerrar
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {modalVisible.field === "category" && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible({ field: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                Selecciona categoría
              </Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
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
              <Button
                onPress={() => setModalVisible({ field: null })}
                style={{ marginTop: 12 }}
              >
                Cerrar
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {modalVisible.field === "colors" &&
        renderMultiSelectModal(
          true,
          setModalVisible,
          "colores",
          colors,
          colorIds,
          setColorIds
        )}

      {modalVisible.field === "genders" &&
        renderMultiSelectModal(
          true,
          setModalVisible,
          "géneros",
          genders,
          genderIds,
          setGenderIds
        )}

      {modalVisible.field === "materials" &&
        renderMultiSelectModal(
          true,
          setModalVisible,
          "materiales",
          materials,
          materialIds,
          setMaterialIds
        )}

      {modalVisible.field === "sizes" &&
        renderMultiSelectModal(
          true,
          setModalVisible,
          "tallas",
          sizes,
          sizeIds,
          setSizeIds
        )}

      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 24 }}>
        Crear producto
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 6,
    maxHeight: "80%",
    padding: 16,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
});

export default CreateProductScreen;
