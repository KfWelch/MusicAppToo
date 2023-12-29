# MusicAppToo

## Description
This app is to be a music player that allows for, well, playing music.  Some specific things about it, however, is that it allows for some specialized randomization algorithms for playlists.  Namely, this includes an algorithm that will allow the user to choose some albums to, while they are randomized throughout the playlist, remain ordered with respect to themselves.  This is particularly useful for albums which, when played in order, convey a story through the songs they play.

## Installation
For development, you will need your IDE, and if you wish to use Android Studio, you will need to make sure you have downloaded and installed the correct SDK.  In general, you will also need to have Java JDK 11 installed on your system.  Because this is a React Native project, you will also need yarn or npm, the latter of which was used to build this project.

Versions here used:
    - Node 16 LTS with prepackaged NPM
    - Android Studio 2020.3.1 Patch 4 (optional?)
    - JDK 11

## Running the App
With this app I have had most success running it with two terminals, one running `npm start` and the second running `npm run android`.

Currently running on a Galaxy Note 10, Android version 12

For this project to work when building a release on Windows, you will need to go into the node_modules folder, in the react-native package, and locate the react.gradle file.  In this file, on lines 118-120, a variable called `prebuiltHermesPath` is generated to locate the hermes binary file, but on Windows, this file ends with a `.exe` extension.  For the build to recognize the binary, you will need to change this variable definition to:

```groovy
    def prebuiltHermesPath = "node_modules/react-native/sdks/hermesc/%OS-BIN%/%HERMESC%"
        .replaceAll("%OS-BIN%", getHermesOSBin())
        .replace('/' as char, File.separatorChar)
        .replace("%HERMESC%", Os.isFamily(Os.FAMILY_WINDOWS) ? 'hermesc.exe' : 'hermesc');
```

Additionally in node_modules, in the jsmediatags package, the file `jsmediatags.min.js` under the dist folder needs to be renamed to `jsmediatags.js` for metro to recognize it

## Redux Sagas
Currently there is no expectations to be using any service calls with this app, but it is there for future reference

# Important to note for running the app
## Music file types supported:
    - MP3
    - MP4 (Possibly)
    - FLAC

This is due to a restriction with JSMediaTags, as these are the only filetypes that have metadata in a readable form for this package as of yet
