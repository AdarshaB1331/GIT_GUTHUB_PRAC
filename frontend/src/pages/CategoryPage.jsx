import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();

  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);
  console.log(products);

  return <div>CP</div>;
};

export default CategoryPage;
