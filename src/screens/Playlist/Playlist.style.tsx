import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        flex: 1
    },
    controlBar: {
        flexDirection: 'row',
        height: 75,
        padding: 15,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 1
    },
    controlBarColumn: {
        flexDirection: 'column'
    },
    controlBarColumnTitle: {
        fontSize: 16
    },
    flatListView: {
        flex: 1
    },
    albumsView: {
        flex: 2
    },
    songsView: {
        flex: 1
    },
    songsFlatlist: {
        height: '60%'
    }
});

export default styles;
