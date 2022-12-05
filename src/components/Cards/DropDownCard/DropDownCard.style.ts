import { Dimensions, StyleSheet } from 'react-native';

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        width: width * .95,
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
    mainItem: {
        flexDirection: 'column'
    },
    text: {
        fontSize: 16
    },
    subText: {
        fontSize: 14
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
