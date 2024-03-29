import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        flex: 1
    },
    controlBar: {
        flexDirection: 'row',
        height: 75,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 1
    },
    controlBarColumn: {
        flexDirection: 'column',
        width: '35%'
    },
    controlBarColumnTitle: {
        fontSize: 16
    },
    content: {
        flex: 7
    },
    flatListView: {
        flex: 1
    },
    albumsView: {
        flex: 3,
        marginTop: 10
    },
    songsView: {
        flex: 2
    },
    songsFlatlist: {
        height: '60%'
    },
    sectionSeparator: {
        borderBottomWidth: 1,
        width: '95%',
        alignSelf: 'center',
        marginVertical: 5
    },
    separator: {
        height: 5
    },
    optionButton: {
        borderWidth: 1,
        borderRadius: 15,
        padding: 5,
        alignItems: 'center',
        margin: 2
    }
});

export default styles;
