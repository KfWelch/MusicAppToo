import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface EnumPickerProps<Type> {
    Type;
    value: Type;
    onSelectValue: (value: Type) => void;
    defaultValue: Type;
}

function EnumPicker<_Type>(props: EnumPickerProps<_Type>) {
    const { Type, value, onSelectValue, defaultValue } = props;
    const [showItems, setShowItems] = useState(false);

    useEffect(() => {
        onSelectValue(defaultValue);
    }, []);
    
    const itemsView = () => showItems && (
        <FlatList
            data={Object.values(Type)}
            renderItem={({ item }: { item: typeof Type }) => (
                <Pressable onPress={() => {
                    onSelectValue(item);
                    setShowItems(false);
                }}>
                    <Text>{item}</Text>
                </Pressable>
            )}
        />
    );

    return (
        <View>
            <Pressable onPress={() => setShowItems(!showItems)}>
                <Text>{value}</Text>
            </Pressable>
            {itemsView()}
        </View>
    );
};

export default EnumPicker;
