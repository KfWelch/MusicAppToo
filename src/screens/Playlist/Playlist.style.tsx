import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column'
    },
    controlBar: {
        flexDirection: 'row',
        height: 75,
        padding: 15,
        justifyContent: 'space-evenly'
    },
    controlBarColumn: {
        flexDirection: 'column'
    },
    controlBarColumnTitle: {
        fontSize: 16
    }
});

export default styles;
