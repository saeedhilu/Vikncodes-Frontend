import { z } from "zod";
// Zod schema for form validation
export const formSchema = z.object({
    product_name: z
      .string()
      .min(2, { message: "Product name must be at least 2 characters." })
      .max(100, { message: "Product name cannot exceed 100 characters." }),
    product_code: z.string().min(1, { message: "Product code is required." }),
    total_stock: z
      .number({ invalid_type_error: "Stock must be a number." })
      .min(0, { message: "Stock must be a positive number." }),
    product_id: z
      .number({ invalid_type_error: "Product ID must be a number." })
      .min(0, { message: "Product Id must be a positive number." }),
    hsn_code: z.string().optional(),
    product_image: z
      .any()
      .refine((file) => file instanceof File || file === null, {
        message: "Please upload a valid image.",
      })
      .optional(),
    isFavourite: z.boolean().optional(),
    variants: z
      .array(
        z.object({
          variant_name: z
            .string()
            .min(1, { message: "Variant name is required." }),
          options: z
            .array(z.string())
            .min(1, { message: "At least one option is required." }),
        })
      )
      .optional(),
  });