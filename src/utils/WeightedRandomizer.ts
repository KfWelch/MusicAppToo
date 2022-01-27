import { Song } from '../models/MusicModel.d';
/**
 * IDEA - random next song
 * Take all the songs, and put their songIds into an array however many times their weight is
 * Use Math.random() to pick a floor number between 0 and length of array
 *  - Math.floor(Math.random() * songIdArray.length)
 * Return song that has that number for its index
 * 
 * Will need to be returned before current song finishes playing (continuous generation of playlist)
 */
