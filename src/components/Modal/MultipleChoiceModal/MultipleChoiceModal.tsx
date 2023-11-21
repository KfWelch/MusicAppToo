import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import styles from './MultipleChoiceModal.style';
import colorScheme from '../../../constant/Color';

interface MultipleChoiceModalProps<T> {
    title: string;
    description: string;
    choices: T[];
    onConfirm: (choice: T) => void;
    onCancel: () => void;
    isVisible: boolean;
    isDarkMode: boolean;
}

const MultipleChoiceModal = <T extends unknown>(props: MultipleChoiceModalProps<T>) => {
    const {
        title,
        description,
        choices,
        onConfirm,
        onCancel,
        isVisible,
        isDarkMode
    } = props;

    const currentScheme = colorScheme[isDarkMode ? 'dark' : 'light'];
    const borderColor = currentScheme.outline;
    const backgroundColor = currentScheme.background;

    const renderChoice = ({ item }: { item: T }) => (
        <Pressable
            onPress={() => onConfirm(item)}
            style={{ ...styles.optionView, borderColor, backgroundColor: currentScheme.contentBackground }}
        >
            <Text style={styles.optionText}>{item}</Text>
        </Pressable>
    );

    return (
        <ReactNativeModal
            isVisible={isVisible}
            onBackButtonPress={onCancel}
            onBackdropPress={onCancel}
        >
            <View style={{...styles.container, borderColor, backgroundColor }}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.descriptionText}>{description}</Text>
                <FlatList
                    data={choices}
                    renderItem={renderChoice}
                />
                <Pressable onPress={onCancel}>
                    <Text style={styles.descriptionText}>Cancel</Text>
                </Pressable>
            </View>
        </ReactNativeModal>
    )
};

export default MultipleChoiceModal;
