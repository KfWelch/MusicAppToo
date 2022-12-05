import { StyleSheet } from 'react-native';

export const SongCardHeight = 85;
export const MARGIN = 5;

const styles = StyleSheet.create({
    indexNumber: {
        fontSize: 18
    },
    title: {
        fontSize: 16,
        flexWrap: 'wrap'
    },
    subtitle: {
        fontSize: 14
    },
    cardView: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        height: SongCardHeight,
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: MARGIN
    },
    infoView: {
        flexDirection: 'column',
        width: '60%'
    },
    border: {
        borderWidth: 1
    }
});

export default styles;
