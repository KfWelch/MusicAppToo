import React, { useState } from 'react';
import {
    FlexStyle,
    Pressable,
    SafeAreaView,
    useColorScheme,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import { color } from '../../../constant/Color';
import { useTypedSelector } from '../../../state/reducers';
import styles from './ComponentDropDown.style';

interface DropDownProps {
    mainItemCard: JSX.Element;
    subItemFlatlist: JSX.Element;
    style?: FlexStyle;
}

const ComponentDropDown = (props: DropDownProps) => {
    const { mainItemCard, subItemFlatlist, style } = props;
    const options = useTypedSelector(state => state.Options);
    const colorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : colorScheme === 'dark';
    const [showSubItems, setShowSubItems] = useState(false);

    const styleOverrides = style;

    return (
        <SafeAreaView style={{
            ...styles.container,
            borderColor: isDarkMode ? color.DARK_RED : color.DARK_SLATE_BLUE,
            ...styleOverrides
        }}>
            <View style={styles.lineContainer}>
                {mainItemCard}
                <Pressable onPress={() => setShowSubItems(!showSubItems)}>
                    <Icon name={showSubItems ? 'minus' : 'down'} size={50} />
                </Pressable>
            </View>
            {showSubItems && subItemFlatlist}
        </SafeAreaView>
    );
};

export default ComponentDropDown;
