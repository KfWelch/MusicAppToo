import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        margin: 10,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        flex: 1
    },
    itemSeparator: {
        height: 5
    },
    itemView: {
        borderWidth: 1,
        padding: 15,
        borderColor: '#000000',
        borderRadius: 5
    },
    loadingLPView: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    }
});

export default styles;
