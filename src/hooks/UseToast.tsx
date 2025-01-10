import { Toaster, toast } from 'sonner';

type ShowToast =  {
    message: string;
    variant?: "success" | "error" | "info";
    duration?: number;       
}
const useToast = () => {
    
    const showToast = ({message, variant = "success", duration = 2000}:ShowToast) => {
        console.log('Message adn variant is :', message, variant);


        const toastOptions = {
            default: {
                title: "Notification",
                description: message,
                duration,
            },
            success: {
                title: "Success",
                description: message,
                duration,
                variant: "success",
            },
            error: {
                title: "Error",
                description: message,
                duration,
                variant: "error",
            },
            info: {
                title: "Information",
                description: message,
                duration,
                variant: "info",
            },
        };

        const options = toastOptions[variant] || toastOptions.default;
        const { title, description, ...restOptions } = options;

        toast[variant](`${title}: ${description}`);
    };

   
    return showToast;
};

export default useToast;

export const ToastNotificationProvider = () => (
    <Toaster  richColors position="top-right" />
);