import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import color from '../../../constant/Color';
import { useTypedSelector } from '../../../state/reducers';
import styles from "./DropDownCard.style";

interface DropDownCardProps {
    mainItem: string;
    mainItemHelperText: string;
    subItems: string[];
    onItemClick: (text: string) => void;
}

const DropDownCard = (props: DropDownCardProps) => {
    const { mainItem, mainItemHelperText, subItems, onItemClick } = props;
    const options = useTypedSelector(state => state.Options);
    const colorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : colorScheme === 'dark';
    const [showSubItems, setShowSubItems] = useState(false);

    const subItemsItemView = ({ item }: { item: string }) => (
        <View style={{ ...styles.subItemsView, paddingLeft: 30, borderColor: isDarkMode ? color.DARK_RED : color.DARK_SLATE_BLUE }}>
            <TouchableOpacity onPress={() => onItemClick(item)}>
                <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
        </View>
    );

    const subItemsView = () => showSubItems && (
        <FlatList
            data={subItems}
            renderItem={subItemsItemView}
            keyExtractor={(item, index) => `${item}-${index}`}
        />
    );

    return (
        <SafeAreaView style={{ ...styles.container, borderColor: isDarkMode ? color.DARK_RED : color.DARK_SLATE_BLUE }}>
            <View style={styles.lineContainer}>
                <TouchableOpacity onPress={() => onItemClick(mainItem)} style={styles.mainItem}>
                    <Text style={styles.text}>{mainItem}</Text>
                    <Text style={styles.subText}>{mainItemHelperText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowSubItems(!showSubItems)}>
                    <Icon name={showSubItems ? 'minus' : 'down'} size={50} />
                </TouchableOpacity>
            </View>
            {subItemsView()}
        </SafeAreaView>
    );
};

export default DropDownCard;
