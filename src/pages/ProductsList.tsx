import ProductCreationForm from "@/components/sections/ProductForm";
import { DataTable } from "@/components/sections/ProjectListTable";
import React from "react";

const ProductsList = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Title Section */}
      <h1 className="text-3xl font-bold text-center mb-8">Product List</h1>

      {/* Product Creation Form Section */}
      <div className="mb-8   flex justify-end">
        <ProductCreationForm />
      </div>

      {/* Data Table Section */}
      <div >
        <DataTable />
      </div>
    </div>
  );
};

export default ProductsList;
