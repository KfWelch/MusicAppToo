import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        flexWrap: 'nowrap'
    },
    subtitle: {
        fontSize: 14
    },
    cardView: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 100,
        alignSelf: 'stretch',
        alignContent: 'center'
    },
    infoView: {
        flexDirection: 'column',
        width: '50%'
    }
});

export default styles;