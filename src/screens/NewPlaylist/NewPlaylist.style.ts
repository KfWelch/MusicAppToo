import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 7
    },
    flatListView: {
        flex: 1
    },
    selectedAlbums: {
        flexBasis: 'auto',
        flexShrink: 1,
        flexGrow: 2
    },
    selectedSongs: {
        flexBasis: 'auto',
        flexShrink: 1,
        flexGrow: 1
    },
    titleText: {
        fontSize: 18,
        alignSelf: 'center'
    },
    textInput: {
        borderRadius: 10
    },
    makeButtonView: {
        alignSelf: 'flex-end'
    }
});

export default styles;
