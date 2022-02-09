import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    scrollView: {
        height: 300,
        alignSelf: 'center'
    },
    songCardView: {
        borderWidth: 1,
        borderRadius: 10
    }
});

export default styles;
