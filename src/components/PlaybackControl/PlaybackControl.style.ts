import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        flexDirection: 'column',
        alignItems: 'center'
    },
    progressContainer: {
        height: 35,
        width: .95 * width,
        flexDirection: 'column'
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    controlsContainer: {
        height: 75,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});

export default styles;
