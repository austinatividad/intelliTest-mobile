import React from 'react';
import { View } from 'react-native';
import { Input } from "@/components/ui/input"; // Assuming your Input component is here

// Define the prop types
type InputWithIconProps = {
  icon: React.ReactNode; // The icon prop is expected to be a React node (e.g., a component)
} & React.ComponentPropsWithoutRef<typeof Input>; // Include other props passed to the Input component

const InputWithIcon: React.FC<InputWithIconProps> = ({ icon, ...props }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1, // Optional: if you want to add a border to the container
        borderRadius: 8, // Optional: rounded corners
        paddingHorizontal: 10, // Space between the border and the content
      }}
    >
      {/* Icon placed on the left */}
      <View>
        {icon}
      </View>

      {/* Input field */}
      <Input 
        {...props}
        style={{ flex: 1 }} // Ensure the input field takes the remaining space
        className="w-full border-0"
      />
    </View>
  );
};
export { InputWithIcon };
