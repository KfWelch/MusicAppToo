import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        flexDirection: 'column'
    },
    progressContainer: {
        height: 25
    },
    controlsContainer: {
        height: 75,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});

export default styles;
