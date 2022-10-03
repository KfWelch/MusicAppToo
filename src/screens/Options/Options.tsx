import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, SectionList, SectionListData, SectionListRenderItem, Switch, Text, TextInput, useColorScheme, View } from "react-native";
import NumericInput from "react-native-numeric-input";
import { useDispatch } from "react-redux";
import { colorScheme } from "../../constant/Color";
import { setOptionByName } from "../../state/actions/Options";
import { useTypedSelector } from "../../state/reducers";
import { splitCamelCaseToWords } from "../../utils/stringUtils";
import styles from "./Options.style";

enum TypeofTypes {
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean'
}

type SectionData = {
    optionName: string;
    variableName: string;
    value: any;
}

interface SectionListSection {
    title: string;
    data: SectionData[];
}

const Options = () => {
    const options = useTypedSelector(state => state.Options);
    const dispatch = useDispatch();
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';
    const scheme = isDarkMode ? 'dark' : 'light';

    const optionsArray = Object.entries(options);
    // This is to remove the _persist "option" that is present due to redux-persist
    optionsArray.pop();
    const sections: SectionListSection[] = [];
    const sectionDatas: SectionData[] = [];

    optionsArray.forEach(option => {
        const nameArray = option[0].split(splitCamelCaseToWords);
        const optionName = nameArray.slice(1).join(' ');
        sectionDatas.push({
            optionName,
            variableName: option[0],
            value: option[1]
        });
    });

    sectionDatas.forEach(sectionData => {
        const title = sectionData.variableName.split(splitCamelCaseToWords)[0];

        const sectionIndex = sections.findIndex(section => section.title === title);
        if (sectionIndex >= 0) {
            sections[sectionIndex].data.push(sectionData);
        } else {
            sections.push({
                title,
                data: [sectionData]
            });
        }
    });


    const boolSettingCard = (name: string, variableName: string, value: boolean) => (
        <View style={styles.cardView}>
            <Text style={styles.text}>{name}</Text>
            <Switch value={value} onValueChange={value => {
                dispatch(setOptionByName(variableName, value));
            }} />
        </View>
    );

    const numberSettingCard = (name: string, variableName: string, value: number) => (
        <View style={styles.cardView}>
            <Text style={styles.text}>{name}</Text>
            <NumericInput
                value={value}
                onChange={value => {
                    dispatch(setOptionByName(variableName, value));
                }} 
                textColor={colorScheme[scheme].content}
                inputStyle={{
                    backgroundColor: colorScheme[scheme].contentBackground
                }}
                borderColor={colorScheme[scheme].outline}
                rightButtonBackgroundColor={colorScheme[scheme].outline}
                leftButtonBackgroundColor={colorScheme[scheme].outline}
                rounded
            />
        </View>
    );

    const stringSettingCard = (name: string, variableName: string, value: string) => (
        <View style={styles.cardView}>
            <Text style={styles.text}>{name}</Text>
            <TextInput
                value={value}
                onChange={value => {
                    dispatch(setOptionByName(variableName, value));
                }}
                autoCorrect={false}
                style={{
                    color: colorScheme[scheme].content,
                    backgroundColor: colorScheme[scheme].contentBackground,
                    borderColor: colorScheme[scheme].outline,
                    borderWidth: 1
                }}
            />
        </View>
    );

    const renderItem: SectionListRenderItem<SectionData, SectionListSection> = ({ item }) => {
        const valueType = typeof item.value;
        switch (valueType) {
            case TypeofTypes.BOOLEAN:
                return boolSettingCard(item.optionName, item.variableName, item.value);
            case TypeofTypes.NUMBER:
                return numberSettingCard(item.optionName, item.variableName, item.value);
            default:
                return stringSettingCard(item.optionName, item.variableName, item.value);
        }
    };

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView>
            <SectionList
                sections={sections}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={(item, index) => `${item.variableName}-${index}`}
            />
        </SafeAreaView>
    )
};

export default Options;
