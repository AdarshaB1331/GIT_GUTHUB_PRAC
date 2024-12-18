import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch prodcuts", loading: false });
      toast.error(error.response.data.error || "Failed to fetch prodcuts");
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    console.log("Toggling product:", productId);
    try {
      const res = await axios.patch(`/products/${productId}`);
      console.log("Response data:", res.data);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId
            ? { ...product, isFeautured: res.data.isFeautured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating product:", error);
      set({ loading: false });
      toast.error("Failed to update product");
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });

    try {
      await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.error || "Failed to delete the product"
      );
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
}));
