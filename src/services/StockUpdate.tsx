import instance from "@/utils/AxiosInstance";

const StockUpdate = async (id: number, transactionType: string, quantity: number) => {
  try {
    const response = await instance.patch(`products/stock/update/${id}/`, {
      transaction_type: transactionType,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update stock.");
  }
};

export default StockUpdate;
