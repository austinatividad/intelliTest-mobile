import React from "react";
import { Modal, View, Text, Pressable } from "react-native";

interface FeedbackModalProps {
    visible: boolean;
    onClose: () => void;
    feedbackText?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, onClose, feedbackText }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                    <Text className="font-bold text-gray-500"> Feedback </Text>
                    <Text className="text-justify mb-4">{feedbackText || 'No explanation provided'}</Text>
                    <Pressable onPress={onClose} style={{ alignSelf: 'center' }}>
                        <Text style={{ color: 'blue' }}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default FeedbackModal;
