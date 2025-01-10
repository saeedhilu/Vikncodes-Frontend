import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockUpdate from "@/services/StockUpdate";
import { useQueryClient } from "react-query";
import useToast from "@/hooks/UseToast";
const StockUpdateDialog = ({
  product,
  isOpen,
  onClose,
}: {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [transactionType, setTransactionType] = React.useState("sale");
  const [quantity, setQuantity] = React.useState(0);
  const queryClient = useQueryClient();
  const showToast = useToast();
  const handleUpdateStock = async () => {
    if (quantity <= 0) {
        showToast({ message: "Please select  a quantity to update to the current quantity ", variant:"error"})
        return
    }
    

    try {
      await StockUpdate(product.id, transactionType, quantity);
      showToast({ message: "Stock updated successfully!", variant: "success" });
      queryClient.invalidateQueries("products");
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast({ message: error.message, variant: "error" });
      } else {
        showToast({
          message: "An unexpected error occurred",
          variant: "error",
        });
      }
    }
  };

  return (
    <Dialog  open={isOpen} onOpenChange={onClose} > 
      <DialogTrigger asChild>
        <Button>Update Stock</Button>
      </DialogTrigger>
      <DialogContent className="h-auto">
        <DialogHeader>
          <DialogTitle>Update Stock for {product.product_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label>Transaction Type:</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="sale">Sale</option>
              <option value="purchase">Purchase</option>
            </select>
          </div>
          <div>
            <label>Quantity:</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStock}>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockUpdateDialog;
