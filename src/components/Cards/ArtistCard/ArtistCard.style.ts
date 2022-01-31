import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        flexWrap: 'wrap'
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
        height: 70,
        alignSelf: 'stretch'
    },
    infoView: {
        flexDirection: 'column'
    }
});

export default styles;