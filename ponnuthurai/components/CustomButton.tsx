// CustomButton.jsx
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { ButtonProps } from "../types/types";


const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
    switch (variant) {
      case "secondary":
        return "bg-gray-500";
      case "danger":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      case "outline":
        return "bg-transparent border-primary-300 border-[0.5px]";
      default:
        return "bg-accent-100";
    }
  };
  
  const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
    switch (variant) {
      case "primary":
        return "text-primary-100";
      case "secondary":
        return "text-primary-300";
      case "danger":
        return "text-red-100";
      case "success":
        return "text-green-100";
      default:
        return "text-white";
    }
  };

const CustomButton = ({
    onPress,
    title,
    bgVariant = "primary",
    textVariant = "default",
    IconLeft,
    IconRight,
    className,
    ...props
  }: ButtonProps) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`w-full rounded-lg p-5 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}`} {...props}
        {...props}
      >
        {IconLeft && <IconLeft />}
        <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
          {title}
        </Text>
        {IconRight && <IconRight />}
      </TouchableOpacity>
    );
  };
  
  export default CustomButton;
