import React, { FC } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle  } from "lucide-react";  
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}  >
      <DialogTrigger asChild>
        <Button>Add New Product <PlusCircle size={24}  />  </Button>
      </DialogTrigger >
      <DialogContent>
        <DialogTitle>Create a new Product </DialogTitle>
        <DialogDescription>
          Fill out the product details below.
        </DialogDescription>
        {children}
        <DialogFooter>
          <DialogClose onClick={onClose}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
