import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ArtistScreen from "../screens/ArtistScreen/ArtistScreen";
import Home from "../screens/Home/Home";
import { useTypedSelector } from "../state/reducers";

export type HomeStackNavigatorParams = {
    Home: undefined;
    ArtistScreen: undefined;
};
const Stack = createNativeStackNavigator<HomeStackNavigatorParams>();

export const HomeNavigator = () => {
    const currentArtist = useTypedSelector(state => state.Albums.selectedArtist);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerTitle: 'Home'
                    }}
                />
                <Stack.Screen
                    name="ArtistScreen"
                    component={ArtistScreen}
                    options={{
                        headerTitle: `${currentArtist && currentArtist.artist || 'Artist'}`
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
