import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 30,
        padding: 12,
        alignItems: 'center'
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    descriptionText: {
        fontSize: 20,
        margin: 7,
        marginBottom: 9
    },
    optionView: {
        alignItems: 'center',
        marginVertical: 4,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 40
    },
    optionText: {
        fontSize: 18
    }
});

export default styles;
