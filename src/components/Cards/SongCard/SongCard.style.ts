import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    indexNumber: {
        fontSize: 18,
        flexWrap: 'wrap'
    },
    title: {
        fontSize: 16
    },
    subtitle: {
        fontSize: 14
    },
    cardView: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        height: 85,
        alignSelf: 'stretch'
    },
    infoView: {
        flexDirection: 'column'
    }
});

export default styles;
