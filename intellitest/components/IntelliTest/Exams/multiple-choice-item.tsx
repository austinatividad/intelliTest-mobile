import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MultipleChoiceItemProps {
    text: string;
    isSelected: boolean; // Whether this item is selected
    onSelect: () => void; // Handler for when this item is selected
}

export const MultipleChoiceItem: React.FC<MultipleChoiceItemProps> = ({ text, isSelected, onSelect }) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                isSelected ? styles.selected : styles.default, // Apply selected style if true
            ]}
            onPress={onSelect}
        >
            <Text style={[styles.text, isSelected && styles.selectedText]}>{text}</Text>

            {/* text that says "Selected" on the right side if isSelected */}
            {isSelected && <Text style={styles.selectedText}>Selected</Text>}
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
        borderColor: 'gray', // Default border color
        backgroundColor: 'white',
    },
    selected: {
        borderColor: '#808080', // Neutral border color
        backgroundColor: '#F0F0F0', // Neutral background color
    },
    text: {
        fontSize: 16,
    },
    selectedText: {
        fontWeight: 'bold',
        color: '#808080',
    },
});
