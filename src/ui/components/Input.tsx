import { TextInput } from "react-native";

import { Colors } from "../styleguide/Styleguide";

export const Input = ({
  text,
  onChangeText,
  color,
  borderColor,
  secureTextEntry,
  placeholder,
}: {
  text: string;
  onChangeText: (text: string) => void;
  color?: Colors;
  borderColor?: Colors;
  secureTextEntry?: boolean;
  placeholder?: string;
}) => {
  return (
    <TextInput
      style={{
        color: Colors.primaryText,
        borderWidth: 0.5,
        borderColor: borderColor ?? color,
        borderRadius: 6,
        padding: 12,
        paddingHorizontal: 12,
        backgroundColor: Colors.lightGray,
      }}
      secureTextEntry={secureTextEntry}
      value={text}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  );
};
