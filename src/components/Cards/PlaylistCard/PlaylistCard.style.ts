import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        alignSelf: 'center'
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
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        height: 70,
        alignSelf: 'stretch'
    },
    infoView: {
        flexDirection: 'column'
    },
    flatlistSeparator: {
        height: 3
    }
});

export default styles;
