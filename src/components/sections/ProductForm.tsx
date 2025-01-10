import { useState } from "react";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormFieldComponent from "../form/FormWrapper";
import { Modal } from "../modal/ProductModal";
import { useMutation, useQueryClient } from "react-query";
import ProductsServices from "@/services/Products";
import useToast from "@/hooks/UseToast";
import { formSchema } from "./FormValidateShema";

type FormSchema = z.infer<typeof formSchema>;

export default function ProductCreationForm() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      product_code: "",
      total_stock: 0,
      hsn_code: "",
      product_image: null,
      isFavourite: false,
      product_id: 0,
      variants: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const { mutate, isLoading, isError, isSuccess } = useMutation(
    ProductsServices.addProduct,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
        showToast({
          message: "Product added successfully",
          variant: "success",
        });
        form.reset();
        closeModal();
      },
      onError: (error: any) => {
        let errorMessage = "An error occurred"; // Default message
      
        if (error?.response?.data) {
          console.log("Error response data:", error.response.data);
      
          // Extract the first error message dynamically
          const errorData = error.response.data;
      
          // Find the first key in the error object and its associated messages
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            errorMessage = errorData[firstKey][0]; // Get the first message
          } else {
            errorMessage =
              typeof errorData === "string"
                ? errorData
                : JSON.stringify(errorData); // Fallback to JSON string
          }
        } else {
          // Handle cases where response data is not available
          errorMessage = error.message || "Something went wrong";
        }
      
        // Show the extracted message in the toast
        showToast({ message: errorMessage, variant: "error" });
      },
      
      
    }
  );

  const onSubmit: SubmitHandler<FormSchema> = (values) => {
    console.log("On submit: ", values);

    const formData = new FormData();

    formData.append("product_name", values.product_name);
    formData.append("product_code", values.product_code);
    formData.append("total_stock", String(values.total_stock));
    formData.append("product_id", String(values.product_id));
    formData.append("hsn_code", values.hsn_code || "");

    if (values.product_image) {
      formData.append("product_image", values.product_image);
    }

    formData.append("is_favourite", String(values.isFavourite));

    if (values.variants && values.variants.length > 0) {
      formData.append("variants", JSON.stringify(values.variants));
    }

    mutate({ formData });
  };

  const closeModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to add an option to a variant
  function addOption(variantIndex: number) {
    const currentOptions = form.getValues(`variants.${variantIndex}.options`);
    currentOptions.push("");
    update(variantIndex, {
      ...form.getValues(`variants.${variantIndex}`),
      options: currentOptions,
    });
  }

  // Function to remove an option from a variant
  function removeOption(variantIndex: number, optionIndex: number) {
    const currentOptions = form.getValues(`variants.${variantIndex}.options`);
    currentOptions.splice(optionIndex, 1);
    update(variantIndex, {
      ...form.getValues(`variants.${variantIndex}`),
      options: currentOptions,
    });
  }

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Fields */}
          <div className="space-y-4">
            <FormFieldComponent
              form={form}
              name="product_name"
              label="Product Name"
              description="Provide a descriptive name for the product."
              type="text"
              placeholder="Enter product name"
            />
            <FormFieldComponent
              form={form}
              name="product_code"
              label="Product Code"
              description="A unique identifier for the product (e.g., SKU)."
              type="text"
              placeholder="Enter product code"
            />
            <FormFieldComponent
              form={form}
              name="total_stock"
              label="Total Stock"
              description="Specify the total quantity available in stock."
              type="number"
              placeholder="Enter total stock"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 0;
                form.setValue("total_stock", value);
              }}
            />
            <FormFieldComponent
              form={form}
              name="product_id"
              label="Product ID"
              description="Specify the total Product ID."
              type="number"
              placeholder="Enter Product ID"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 0;
                form.setValue("product_id", value);
              }}
            />
            <FormFieldComponent
              form={form}
              name="hsn_code"
              label="HSN Code (Optional)"
              description="Harmonized System Nomenclature Code for tax purposes (if applicable)."
              type="text"
              placeholder="Enter HSN code (if applicable)"
            />
            <FormFieldComponent
              form={form}
              name="product_image"
              label="Product Image"
              description="Upload an image to represent the product."
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                form.setValue("product_image", file);
              }}
            />
            <FormFieldComponent
              form={form}
              name="isFavourite"
              label="Mark as Favourite"
              description="Mark this product as a favourite for easy access."
              type="checkbox"
            />
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Variants
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 border p-4 rounded-md">
                {/* Variant Name */}
                <div className="flex flex-col space-y-2">
                  <input
                    {...form.register(`variants.${index}.variant_name`)}
                    placeholder="Variant Name (e.g., Size)"
                    className="input p-2 border border-gray-300 rounded-md"
                  />
                  {/* Variant Options */}
                  <div className="space-y-2">
                    {form
                      .getValues(`variants.${index}.options`)
                      .map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-2"
                        >
                          <input
                            {...form.register(
                              `variants.${index}.options.${optionIndex}`
                            )}
                            defaultValue={option}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="input p-2 border border-gray-300 rounded-md"
                          />
                          <Button
                            type="button"
                            onClick={() => removeOption(index, optionIndex)}
                            className="text-red-600"
                          >
                            Remove Option
                          </Button>
                        </div>
                      ))}
                    <Button
                      type="button"
                      onClick={() => addOption(index)}
                      className="text-green-600"
                    >
                      Add Option
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ variant_name: "", options: [""] })}
            >
              Add Variant
            </Button>
          </div>

          <Button type="submit">Create Product</Button>
        </form>
      </FormProvider>
    </Modal>
  );
}
