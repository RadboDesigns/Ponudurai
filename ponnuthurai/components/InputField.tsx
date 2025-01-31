import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { InputFieldProps } from "../types/types";

const InputField = ({
  label,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  className,
  editable = true,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg font-rubik text-primary-100 mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative rounded-lg border-primary-200 border-2 bg-white-200 ${
              !editable ? 'opacity-50' : ''
            } ${containerStyle}`}
          >
            <TextInput
              className={`rounded-full p-4 font-rubik text-[15px] flex-1 ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              editable={editable}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;