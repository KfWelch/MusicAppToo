import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '95%',
        flexDirection:'column'
    },
    indexNumber: {
        fontSize: 18
    },
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
