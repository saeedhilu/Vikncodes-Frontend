import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import LoginService from "@/services/Login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/redux/slice/AuthSlice";
import useToast from "@/hooks/UseToast";
import Spinner from "@/components/spinner/Spinner";
import { Card, CardTitle } from "@/components/ui/card";
const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters long." }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Form values submitted:", values);

      const response = await LoginService({ loginData: values });
      console.log("Login Success:", response);

      dispatch(
        login({
          access: response.access,
          refresh: response.refresh,
          user: response.user,
        })
      );
      showToast({ message: "Login Success", variant: "success" });
      navigate("/product");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed! Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Card className=" p-6 ">
        <CardTitle className="text-2xl font-bold text-center mb-4">
          User Login
        </CardTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a valid email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your password must be at least 2 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Error Message */}
            {error && (
              <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full  py-2 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Login"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
