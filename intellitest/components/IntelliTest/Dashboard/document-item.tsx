import { X, FileText, FileImage } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


enum fileTypes {
    "text",
    "image"
}

type DocumentItemProps = {
    fileName: string;
    fileType: fileTypes;
    id: string;
    isRemoved: boolean;
    onPress: (id: string) => void;
    };

const DocumentItem: React.FC<DocumentItemProps> = ({ fileName, fileType, id, isRemoved, onPress }) => {
    return (
        <View className="mt-5 px-4 py-2 bg-white rounded-lg border border-gray-100">
            <View className="flex flex-row gap-3">
                {/* switch between FileText and FileImage depending on the fileType */}
                {fileType === fileTypes.image ? <FileImage size={23} color ="#4ade80"/> : <FileText size={23} color ="#4ade80"/>}
                <Text className="text-lg text-black font-bold">{fileName}</Text>
                {/* floating X top right */}
                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                    <X size={25} color ="#000" onPress={()=> onPress(id)}/>
                </View>
            </View>
        </View>
    );
}

export { DocumentItem };