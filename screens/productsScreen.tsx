import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Card, Text, FAB } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

import imageMap from "../utils/imageMap";

type Product = {
  id: number;
  name: string;
  price: number;
  images: { url: string }[];
};

type ProductsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Products"
>;

const ProductsScreen = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getLocalImage = (url?: string) => {
    if (url && imageMap[url]) {
      return imageMap[url];
    }
    return require("../assets/defaultImage.png");
  };

  const fetchProducts = async () => {
    try {
      setLoading(true); // asegúrate de mostrar loader en cada refresh
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/products/`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
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
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.id })
      }
      activeOpacity={0.95}
      style={{ transform: [{ scale: 1 }] }}
    >
      <Card style={styles.card} key={item.id} elevation={3}>
        <View style={styles.imageContainer}>
          <Image
            source={getLocalImage(item.images?.[0]?.url)}
            style={styles.image}
          />
        </View>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium" style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text variant="titleLarge" style={styles.price}>
              ${item.price}
            </Text>
          </View>
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
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* FAB para agregar producto */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: "#bceeff" }]}
        onPress={() => navigation.navigate("CreateProduct")}
        label="Publicar"
      />
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  imageContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
  },
  image: {
    height: 180,
    width: "90%",
    resizeMode: "contain",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  cardContent: {
    padding: 20,
    paddingTop: 16,
  },
  name: {
    color: "#1a202c",
    fontWeight: "700",
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: "left",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f7fafc",
  },
  price: {
    color: "#836FFF",
    fontWeight: "800",
    fontSize: 20,
    letterSpacing: 0.5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#836FFF",
    shadowColor: "#836FFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderRadius: 28,
  },
});
