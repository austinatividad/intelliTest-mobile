import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MultipleChoiceItemProps {
    text: string;
    isCorrect: boolean; // Whether this item is the correct answer
}

export const MultipleChoiceItem: React.FC<MultipleChoiceItemProps> = ({ text, isCorrect }) => {
    const [selected, setSelected] = useState<boolean | null>(null); // State to track selection

    // Function to handle selection
    const handleSelect = () => {
        setSelected(true);
    };

    return (
        <TouchableOpacity 
            style={[
                styles.container, 
                styles.default
            ]} 
            onPress={handleSelect}
        >
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
};

// Styles for different states
const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 2,
        borderRadius: 8,
    },
    default: {
        borderColor: 'gray', // Default black border
    },
    text: {
        fontSize: 16,
    },
});
