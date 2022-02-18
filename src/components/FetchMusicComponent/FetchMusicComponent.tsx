
import _ from 'lodash';
import React, { useState } from 'react';
import { Button, SafeAreaView, useColorScheme, View } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import * as RNFS from 'react-native-fs';
import { TagType } from 'jsmediatags/types';
import { Reader } from 'jsmediatags';
// @ts-ignore
import ReactNativeFileReader from 'jsmediatags/build2/ReactNativeFileReader';
import { Circle } from 'react-native-progress';
// @ts-ignore
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import styles from './FetchMusicComponent.style';
import { Album, Artist, Song } from '../../models/MusicModel';
import { useTypedSelector } from '../../state/reducers';
import { useDispatch } from 'react-redux';
import { addAlbum, addArtist, combineMultiDiscAlbums, resetSavedAlbums } from '../../state/actions/Albums';
import { colorScheme } from '../../constant/Color';
import { disclessAlbumName, getAlbumId, getArtistFromPath, getMusicAlbumId, getMusicTrackId } from '../../utils/musicUtils';
import { useNavigation } from '@react-navigation/native';
import { GetMusicAlbum, GetMusicTrack } from '../../models/GetMusicFiles';

interface Progress {
    total: number;
    progress: number;
}

const FetchMusicComponent = () => {
    const artists = useTypedSelector(state => state.Albums.artists);
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [totalArtists, setTotalArtists] = useState(1);
    const [artistProgress, setArtistProgress] = useState(0);
    const [totalAlbums, setTotalAlbums] = useState(1);
    const [albumProgress, setAlbumProgress] = useState(0);
    const [totalSongs, setTotalSongs] = useState(1);
    const [songProgress, setSongProgress] = useState(0);
    const [loadingMusic, setLoadingMusic] = useState(0);
    const [failedSongs, setFailedSongs] = useState(0);
    const [failedAlbums, setFailedAlbums] = useState(0);

    const getProgress = () => {
        const singleArtistProgress = 1 / totalArtists;
        const singleAlbumProgress = singleArtistProgress / totalAlbums;
        const singleSongProgress = singleAlbumProgress / totalSongs;
        return singleSongProgress * songProgress + singleAlbumProgress * albumProgress + singleArtistProgress * artistProgress;
    };

    const getMusicProgress = () => {
        const singleAlbumProgress = 1 / totalAlbums;
        const singleSongProgress = singleAlbumProgress / totalSongs;
        return singleSongProgress * songProgress + singleAlbumProgress * albumProgress;
    };

    const condenseAlbums = () => {
        artists.forEach(artist => {
            const uniqueArray = artist.albums.reduce((arrayOfUnique: Array<Array<Album>>, currentAlbum) => {
                // What if we do it by checking the artist's albums
                const alreadyMatched = arrayOfUnique
                    // If the set of unique albums arrays includes an array where the current album already is
                    .some((uniqueAlbums: Album[]) => uniqueAlbums
                        .some((album: Album) => currentAlbum.albumName === album.albumName));

                if (alreadyMatched) {
                    return arrayOfUnique;
                }
                /* Then, after we know that the current album is *not* already matched, we filter
                 * the current artist's albums for any where the current album's discless name
                 * is present within the album name
                 * 
                 * We do it this way to cover the case where sometimes a music provider has an exclusive
                 * song edition (Amazon with TSO's album Night Castle) and the exclusive song "album"
                 * has a lower index in the array than the rest of the album(s)
                */
                const matchingAlbums = artist.albums.filter(artistAlbum => artistAlbum.albumName.includes(disclessAlbumName(currentAlbum.albumName)));
                arrayOfUnique.push(matchingAlbums);
                return arrayOfUnique;
            }, []);

            // Filter out uniques where there's only one album
            const albumArraysToCombine = uniqueArray.reduce((combinables: Array<Array<Album>>, currentUnique) => {
                if (currentUnique.length > 1) {
                    return combinables.concat([currentUnique]);
                }
                return combinables;
            }, []);

            albumArraysToCombine.forEach(albumArray => dispatch(combineMultiDiscAlbums(albumArray)));
        });
    };

    const getPermission = async (showToast = true) => {
        const checkResult = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
        switch (checkResult) {
            case RESULTS.GRANTED: 
                showToast && Toast.show({
                    type: 'info',
                    text1: 'Already have permissions'
                });
                break;
            case RESULTS.UNAVAILABLE:
                Toast.show({ type: 'error', text1: 'Unable to access external storage' });
                break;
            default:
                const getResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
                switch (getResult) {
                    case 'granted':
                        Toast.show({
                            type: 'success',
                            text1: 'Successfully got permissions'
                        });
                        break;
                    default:
                        Toast.show({
                            type: 'error',
                            text1: 'Failed to get permissions'
                        });
                }
        }
    };

    const getSongTags = (path: string) => new Promise<TagType | null>(resolve => {
        try {
            new Reader(path)
                .setFileReader(ReactNativeFileReader)
                .read({
                    onSuccess: tag => {
                        resolve(tag);
                    },
                    onError: e => {
                        console.error('Error getting tags for file %o, error %o', path, e);
                        resolve(null);
                    }
                });
        } catch (e) {
            console.error('Error getting tags for file %o, error %o', path, e);
            resolve(null);
        }
    });

    const getMusicFiles = async (recursiveFiles: RNFS.ReadDirItem[], artist?: Artist): Promise<Artist[]> => {
        const directories = recursiveFiles.filter(item => item.isDirectory() && !item.name.startsWith('.'));
        if (!artist) {
            setTotalArtists(directories.length);
        } else {
            setTotalAlbums(directories.length);
            setAlbumProgress(0);
        }
        const tempArtist: Artist = { ...(artist || { artist: '', albums: [] }) };
        let artists: Artist[] = [];

        // 1st iteration, for each artist
        // 2nd iteration, for each album
        // By iteration, I mean levels deep of the recursion
        for (let i = 0; i < directories.length; i++) {
            // Have to do this here for smoother progress vinyl LP
            if (!artist) {
                setArtistProgress(i);
            } else {
                setAlbumProgress(i);
            }
            const files = await RNFS.readDir(directories[i].path);
            // 1st iteration, we are looking at an artist, and recurse to go through all albums
            if (!artist) {
                artists = artists.concat(await getMusicFiles(files, { artist: directories[i].name, albums: [] }));
            // 2nd iteration, we are looking at an album, and we already have all the songs in the files
            } else {
                setTotalSongs(files.length);
                setSongProgress(0);
                let albumFailedSongs = 0;
                const songs: Song[] = [];
                for (let j = 0; j < files.length; j++) {
                    setSongProgress(j);
                    const filePath = files[j].path;
                    const tags = await getSongTags(filePath);
                    
                    if (tags) {
                        const track = tags.tags.track;
                        const numberInAlbum = parseInt(track?.includes('/') ? track.substring(0, track?.indexOf('/')) : track || '0') || j + 1;
                        const song: Song = {
                            albumName: tags.tags.album || '',
                            contributingArtist: tags.tags.artist || '',
                            title: tags.tags.title || '',
                            path: files[j].path,
                            weight: 1,
                            numberInAlbum
                        };
                        songs.push(song);
                    } else {
                        albumFailedSongs++;
                    }
                }
                /* files.forEach((songFile, index) => {
                    const nameStart = songFile.name.search(/[a-zA-Z]/);
                    const title = songFile.name.substring(nameStart, songFile.name.lastIndexOf('.'));
                    // minus one because there's a space between the leading number and the title
                    const leadingNumber = songFile.name.substring(0, nameStart - 1);
                    let numberInAlbum = 0;
                    if (leadingNumber.endsWith('--')) {
                        numberInAlbum = index + 1;
                    } else {
                        numberInAlbum = Number.parseInt(leadingNumber.substring(leadingNumber.length - 2), 10);
                    }
                    const song: Song = {
                        title,
                        albumName: directories[i].name,
                        contributingArtist: artist.artist,
                        numberInAlbum,
                        path: songFile.path,
                        weight: 1
                    };
                    songs.push(song);
                }); */
                if (songs.length) {
                    const album: Album = {
                        albumName: directories[i].name,
                        artistName: artist.artist,
                        songs
                    };
                    tempArtist.albums = tempArtist.albums.concat([album]);
                }
                if (albumFailedSongs) {
                    setFailedSongs(failedSongs + albumFailedSongs);
                    setFailedAlbums(failedAlbums + 1);
                }
            }
        }
        if (artist) {
            if (tempArtist.albums.length) {
                return Promise.resolve([tempArtist]);
            } else {
                return Promise.resolve([]);
            }
        } else {
            return Promise.resolve(artists);
        }
    }

    const getFiles = async () => {
        const path = `${RNFS.ExternalStorageDirectoryPath}/Music`
        await getPermission(false);
        const files = await RNFS.readDir(path)
        setLoadingMusic(1);
        setFailedAlbums(0);
        setFailedSongs(0);
        const musicFiles = await getMusicFiles(files);
        musicFiles.forEach(artist => dispatch(addArtist(artist)));
        setLoadingMusic(0);
        Toast.show({
            position: 'bottom',
            type: 'error',
            text1: `Failed to get ${failedSongs} songs`,
            text2: `This has affected ${failedAlbums} albums`,
            visibilityTime: 5000
        });

        // @ts-ignore
        navigation.navigate('HomeStack');
    };

    const getMusic = async () => {
        console.log('Getting music files')
        setTotalAlbums(1);
        setTotalSongs(1);
        setSongProgress(0);
        setAlbumProgress(0);
        setLoadingMusic(2);
        /* const musicFiles: GetMusicFileType[] = await MusicFiles.getAll({
            artist: true,
            duration: true,
            cover: true,
            icon: true,
            genre: true,
            title: true,
            album: true,
            fields : ['title','albumTitle','genre','lyrics','artwork','duration'] // for iOs Version
        }); */

        const albums: GetMusicAlbum[] = await RNAndroidAudioStore.getAlbums();

        const duplicateless = albums.reduce((filtered: GetMusicAlbum[], currentAlbum) => {
            if (filtered.some(album => getMusicAlbumId(album) === getMusicAlbumId(currentAlbum))) {
                console.log('Found duplicate album', currentAlbum.album);
                return filtered;
            } else {
                return [...filtered, currentAlbum];
            }
        }, []);
        setTotalAlbums(duplicateless.length);

        const artists: Artist[] = [];

        for (const [albumIndex, album] of duplicateless.entries()) {
            let songs: GetMusicTrack[] = await RNAndroidAudioStore.getSongs({ artist: album.author, album: album.album });
            // We do this because artist & album will not get everything for some
            // various artist albums
            if (songs.length < Number.parseInt(album.numberOfSongs, 10)) {
                songs = await RNAndroidAudioStore.getSongs({ album: album.album });
            }

            const solomon = songs.filter(
                (song, index, filteredSongs) => filteredSongs.findIndex(
                    filteredSong => getMusicTrackId(filteredSong) === getMusicTrackId(song)
                ) === index && !(getArtistFromPath(song.path) === '0' || getArtistFromPath(song.path) === 'Alarms')
            );
            const albumSongs: Song[] = [];

            setSongProgress(0);
            setTotalSongs(solomon.length);
            setAlbumProgress(albumIndex);

            for (const [songIndex, song] of solomon.entries()) {
                setSongProgress(songIndex);
                const filePath = song.path;
                const tags = await getSongTags(filePath);
                
                if (tags) {
                    const track = tags.tags.track;
                    const numberInAlbum = parseInt(track?.includes('/') ? track.substring(0, track?.indexOf('/')) : track || '0') || 1;
                    const albumSong: Song = {
                        albumName: album.album,
                        contributingArtist: song.artist,
                        title: song.title,
                        path: song.path,
                        weight: 1,
                        numberInAlbum
                    };
                    albumSongs.push(albumSong);
                }
            }
            
            if (albumSongs.length) {
                // Have to do this because some albums have various artists
                // So we use filepath
                const folderArtist = getArtistFromPath(albumSongs[0].path || `a/b/${album.author}/album/song`).replace('_', ' ');
                if (!artists.some(artist => artist.artist === folderArtist)) {
                    const newArtist: Artist = {
                        albums: [{
                            albumName: album.album,
                            artistName: folderArtist,
                            songs: albumSongs
                        }],
                        artist: folderArtist
                    };
                    dispatch(addArtist(newArtist));
                    artists.push(newArtist);
                } else {
                    const newAlbum: Album = {
                        albumName: album.album,
                        artistName: folderArtist,
                        songs: albumSongs
                    };
                    dispatch(addAlbum(folderArtist, newAlbum));
                    const artistIndex = artists.findIndex(artist => _.isEqual(artist.artist, newAlbum.artistName));
                    artists[artistIndex].albums.push(newAlbum);
                    if (!artists.some(artist => artist.albums.some(album => getAlbumId(album) === getAlbumId(newAlbum)))) {
                    }
                }
            } else {
                console.log('Not adding album with no songs');
            }
        }

        // console.log(albums);
        setLoadingMusic(0);
        Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Finished loading music'
        });
    };

    const reloadMusic = () => {
        dispatch(resetSavedAlbums());
        getFiles();
    };

    const clearMusic = () => {
        dispatch(resetSavedAlbums());
    };

    const itemSeparator = () => (<View style={styles.itemSeparator} />);

    const progressView = () => !!loadingMusic && (
        <View style={styles.loadingLPView}>
            <Circle
                progress={loadingMusic === 1 ? getProgress() : getMusicProgress()}
                size={300}
                thickness={100}
                showsText
                direction='clockwise'
                fill='crimson'
                color='black'
                borderColor='crimson'
                unfilledColor='crimson'
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Button onPress={() => getPermission()} title="get folder permission" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground}/>
            {itemSeparator()}
            <Button onPress={getFiles} title="scan for music" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            {itemSeparator()}
            <Button onPress={reloadMusic} title="Reload music" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            {itemSeparator()}
            <Button onPress={condenseAlbums} title="Condense albums by discs" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            {itemSeparator()}
            <Button onPress={getMusic} title="Scan for music with get-music-files" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            {itemSeparator()}
            <Button onPress={clearMusic} title="Clear saved music" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            {progressView()}
        </SafeAreaView>
    );
};

export default FetchMusicComponent;
