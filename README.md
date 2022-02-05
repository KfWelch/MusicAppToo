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

## Redux Sagas
Currently there is no expectations to be using any service calls with this app, but it is there for future reference

# Important to note for running the app
## Music file types supported:
    - MP3
    - MP4 (Possibly)
    - FLAC

This is due to a restriction with JSMediaTags, as these are the only filetypes that have metadata in a readable form for this package as of yet
