import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";
import FetchMusicComponent from "../components/FetchMusicComponent/FetchMusicComponent";
import { colorScheme } from "../constant/Color";
import Options from "../screens/Options/Options";
import { useTypedSelector } from "../state/reducers";
import HomeStack from "./HomeStackNavigator";

export type HomeDrawerNavParams = {
    HomeStack: undefined;
    Options: undefined;
    GetMusic: undefined;
}

const Drawer = createDrawerNavigator<HomeDrawerNavParams>();

const darkTheme = {
    dark: true,
    colors: {
        primary: 'crimson',
        background: colorScheme.dark.background,
        card: 'darkred',
        text: colorScheme.dark.content,
        border: colorScheme.dark.outline,
        notification: 'red'
    }
};

const lightTheme = {
    dark: false,
    colors: {
        primary: 'blue',
        background: colorScheme.light.background,
        card: 'skyblue',
        text: colorScheme.light.content,
        border: colorScheme.light.outline,
        notification: 'royalblue'
    }
}

const HomeNavigator = () => {
    const options = useTypedSelector(state => state.Options);
    const colorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : colorScheme === 'dark';

    return (
        <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
            <Drawer.Navigator initialRouteName="HomeStack">
                <Drawer.Screen
                    name="HomeStack"
                    component={HomeStack}
                    options={{
                        headerTitle: 'Music App Too'
                    }}
                />
                <Drawer.Screen name="Options" component={Options} />
                <Drawer.Screen name="GetMusic" component={FetchMusicComponent} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default HomeNavigator
