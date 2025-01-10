import { FC } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext, UseFormReturn } from "react-hook-form"; // Importing types for the form

interface FormFieldProps {
  name: string;
  label: string;
  description: string;
  type: "text" | "number" | "file" | "checkbox" | "json";
  placeholder?: string;
  value?: any;
  onChange?: (e: any) => void;
  form: UseFormReturn<any>; // Add form prop type here
}

const FormFieldComponent: FC<FormFieldProps> = ({
  name,
  label,
  description,
  type,
  placeholder,
  value,
  onChange,
  form, // Get form from props
}) => {
  const { control } = useFormContext(); // Ensure we're using form context properly

  return (
    <FormField
      control={control} // Pass control from form context
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "text" || type === "number" || type === "file" ? (
              <Input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) =>
                  onChange ? onChange(e) : field.onChange(e.target.value)
                }
              />
            ) : type === "checkbox" ? (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            ) : type === "json" ? (
              <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) =>
                  onChange ? onChange(e) : field.onChange(e.target.value)
                }
              />
            ) : null}
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldComponent;
