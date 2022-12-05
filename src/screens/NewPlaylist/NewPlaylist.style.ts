import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 7
    },
    flatListView: {
        flex: 1
    },
    selectedMusicView: {
        height: '85%'
    },
    selectedAlbums: {
        flexBasis: 'auto',
        flexShrink: 1,
        flexGrow: 4
    },
    selectedSongs: {
        flexBasis: 'auto',
        flexShrink: 1,
        flexGrow: 2
    },
    titleText: {
        fontSize: 18,
        alignSelf: 'center'
    },
    textInput: {
        borderRadius: 10
    },
    makeButtonView: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;
