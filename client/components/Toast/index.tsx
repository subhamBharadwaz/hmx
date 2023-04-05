import { useToast, ToastPosition } from "@chakra-ui/react";

interface IToast {
  id: string;
  position?: ToastPosition;
  title: string;
  description?: string;
  status: "info" | "warning" | "success" | "error" | "loading";
}

export const Toast = () => {
  const toast = useToast();

  const addToast = (props: IToast): void => {
    const { id, position, title, description, status } = props;
    if (!toast.isActive(id)) {
      toast({
        id,
        position: position || "top-right",
        title,
        description,
        status,
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return { addToast };
};
