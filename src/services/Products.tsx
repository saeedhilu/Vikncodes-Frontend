import instance from '@/utils/AxiosInstance';

const ProductsServices = {
  // Add async to use await
  addProduct: async ({ formData }: any) => {
    console.log('Form data is:', formData);
    
    const response = await instance.post('/products/products-create/', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  
  // Add pagination support in the getProducts method
  getProducts: async (page: number = 1) => {
    // Constructing the URL with pagination
    const response = await instance.get('/products/products/', {
      params: { page }  // Pass page number as a query parameter
    });

    // Returning the full response, including pagination info
    return response.data;
  },
};

export default ProductsServices;
