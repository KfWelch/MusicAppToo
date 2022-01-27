import { DarkTheme, DefaultTheme, NavigationContainer, NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Pressable, useColorScheme, View } from "react-native";
import TrackPlayer, { State, usePlaybackState } from "react-native-track-player";
import Icon from "react-native-vector-icons/AntDesign";
import ArtistScreen from "../screens/ArtistScreen/ArtistScreen";
import Home from "../screens/Home/Home";
import Options from "../screens/Options/Options";
import { useTypedSelector } from "../state/reducers";
import styles from "./HomeNavigator.style";

export type HomeStackNavigatorParams = {
    Home: undefined;
    ArtistScreen: undefined;
    Options: undefined;
};
const Stack = createNativeStackNavigator<HomeStackNavigatorParams>();

export const HomeNavigator = () => {
    const options = useTypedSelector(state => state.Options);
    const colorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : colorScheme === 'dark';
    const currentArtist = useTypedSelector(state => state.Albums.selectedArtist);
    const playbackState = usePlaybackState();
    const playing = playbackState === State.Playing;

    const playable = () => {
        switch (playbackState) {
            case State.Playing:
            case State.Paused:
            case State.Buffering:
                return true;
            default:
                return false;
        }
    };

    const playbackButton = () => playable() && (playing ? (
        <Pressable onPress={TrackPlayer.pause} onLongPress={TrackPlayer.stop}>
            <Icon name="caretright" size={20} />
        </Pressable>
    ) : (
        <Pressable onPress={TrackPlayer.play}>
            <Icon name="pause" size={20} />
        </Pressable>
    ));

    const optionsButton = (navigation: NavigationProp<any>) => (
        <Pressable onPress={() => navigation.navigate('Options')}>
            <Icon name="setting" size={20} />
        </Pressable>
    );

    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={({ navigation }) => ({
                        headerTitle: 'Home',
                        headerRight: () => (
                            <View style={styles.headerContainer}>
                                {optionsButton(navigation)}
                                {playbackButton()}
                            </View>
                        )
                    })}
                />
                <Stack.Screen
                    name="ArtistScreen"
                    component={ArtistScreen}
                    options={{
                        headerTitle: `${currentArtist && currentArtist.artist || 'Artist'}`
                    }}
                />
                <Stack.Screen
                    name="Options"
                    component={Options}
                    options={{
                        headerTitle: 'Options'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
