export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Products: undefined;
    ProductDetail: { productId: number };
    CreateProduct: undefined;
    UpdateProduct: {productId: number};
  };