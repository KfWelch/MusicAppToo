import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    title: {
        fontSize: 16
    },
    subtitle: {
        fontSize: 14
    },
    cardView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        height: 70
    },
    infoView: {
        flexDirection: 'column'
    }
});

export default styles;