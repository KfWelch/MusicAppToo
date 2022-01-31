import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        width: width * .95,
        flexDirection: 'column',
        borderRadius: 7,
        borderWidth: 1
    },
    lineContainer: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    mainItem: {
        flexDirection: 'column'
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
        borderRadius: 7,
        borderWidth: 1
    }
});

export default styles;