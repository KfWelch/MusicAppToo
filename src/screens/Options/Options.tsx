import React from "react";
import { FlatList, SafeAreaView, Switch, Text, TextInput, View } from "react-native";
import NumericInput from "react-native-numeric-input";
import { useDispatch } from "react-redux";
import { setOptionByName } from "../../state/actions/Options";
import { useTypedSelector } from "../../state/reducers";
import styles from "./Options.style";

enum TypeofTypes {
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean'
}

const Options = () => {
    const options = useTypedSelector(state => state.Options);
    const dispatch = useDispatch();
    const optionsArray = Object.entries(options);
    // This is to remove the _persist "option" that is present due to redux-persist
    optionsArray.pop();

    const boolSettingCard = (name: string, value: boolean) => (
        <View style={styles.cardView}>
            <Text style={styles.text}>{name}</Text>
            <Switch value={value} onValueChange={value => {
                dispatch(setOptionByName(name, value));
            }} />
        </View>
    );

    const numberSettingCard = (name: string, value: number) => (
        <View style={styles.cardView}>
            <Text style={styles.text}>{name}</Text>
            <NumericInput value={value} onChange={value => {
                dispatch(setOptionByName(name, value));
            }} />
        </View>
    );

    const stringSettingCard = (name: string, value: string) => (
        <View style={styles.cardView}>
            <Text style={styles.text}>{name}</Text>
            <TextInput value={value} onChange={value => {
                dispatch(setOptionByName(name, value));
            }} />
        </View>
    );

    const renderItem = ({ item }: { item: [ key: string, value: any ]}) => {
        const valueType = typeof item[1];
        switch (valueType) {
            case TypeofTypes.BOOLEAN:
                return boolSettingCard(item[0], item[1]);
            case TypeofTypes.NUMBER:
                return numberSettingCard(item[0], item[1]);
            default:
                return stringSettingCard(item[0], item[1]);
        }
    };

    return (
        <SafeAreaView>
            <FlatList
                data={optionsArray}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item[0]}-${index}`}
            />
        </SafeAreaView>
    )
};

export default Options;
