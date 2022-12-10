import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
        height: 80,
        alignSelf: 'stretch',
        borderRadius: 7,
        borderWidth: 1
    },
    infoView: {
        flexDirection: 'column'
    },
    flatlistSeparator: {
        height: 3
    }
});

export default styles;
