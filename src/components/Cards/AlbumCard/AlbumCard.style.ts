import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        flexWrap: 'nowrap'
    },
    subtitle: {
        fontSize: 14
    },
    subsubtitle: {
        fontSize: 14,
        textAlign: 'center'
    },
    cardView: {
        width: '85%',
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
        marginHorizontal: 10
    }
});

export default styles;