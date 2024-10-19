import React from "react";
import { Modal, View, Text, Pressable } from "react-native";

interface RubricModalProps {
    visible: boolean;
    onClose: () => void;
    criteria?: string;
}

const RubricModal: React.FC<RubricModalProps> = ({ visible, onClose, criteria }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                    <Text className="font-bold text-gray-500"> Criteria </Text>
                    <Text className="text-justify mb-4">{criteria || 'No criteria provided'}</Text>
                    <Pressable onPress={onClose} style={{ alignSelf: 'center' }}>
                        <Text style={{ color: 'blue' }}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default RubricModal;



