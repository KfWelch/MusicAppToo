import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        width: '95%',
        flexDirection: 'column',
        borderColor: '#000000',
        borderRadius: 7,
        borderWidth: 1
    },
    lineContainer: {
        height: 75,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 16
    },
    dropDownButton: {
        height: 60,
        width: 60
    },
    subItemsView: {
        height: 60,
        paddingLeft: 30,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#000000',
        borderRadius: 7,
        borderWidth: 1
    }
});

export default styles;
