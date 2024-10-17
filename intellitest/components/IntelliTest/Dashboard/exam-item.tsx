import React from 'react';
import { View, Text } from 'react-native';

type ExamItemProps = {
    examName: string;
    examStatus: string;
};

const ExamItem: React.FC<ExamItemProps> = ({ examName, examStatus }) => {
return (
    <View className="w-11/12 mt-5 p-4 bg-white rounded-lg border border-gray-300">
        <Text className="text-lg text-black font-bold">{examName}</Text>
        <Text className="text-base text-gray-500">{examStatus}</Text>
    </View>
);
};

export { ExamItem };
