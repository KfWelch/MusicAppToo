import React, { useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import styles from "./DropDownCard.style";

interface DropDownCardProps {
    mainItem: string;
    subItems: string[];
    onItemClick: (text: string) => void;
}

const DropDownCard = (props: DropDownCardProps) => {
    const { mainItem, subItems, onItemClick } = props;
    const [showSubItems, setShowSubItems] = useState(false);

    const subItemsItemView = ({ item }: { item: string }) => (
        <View style={{ ...styles.subItemsView, paddingLeft: 30 }}>
            <TouchableOpacity onPress={() => onItemClick(item)}>
                <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
        </View>
    );

    const subItemsView = () => showSubItems && (
        <FlatList
            data={subItems}
            renderItem={subItemsItemView}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.lineContainer}>
                <TouchableOpacity onPress={() => onItemClick(mainItem)}>
                    <Text style={styles.text}>{mainItem}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowSubItems(!showSubItems)}>
                    <Icon name={showSubItems ? 'minus' : 'down'} size={50} color="#000000" />
                </TouchableOpacity>
            </View>
            {subItemsView()}
        </SafeAreaView>
    );
};

export default DropDownCard;
