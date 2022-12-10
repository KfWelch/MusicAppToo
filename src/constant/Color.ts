export const color = {
    BLACK_TRANSPARENT_200: '#00000033',
    BLACK_TRANSPARENT_500: '#00000080',
    BLACK_TRANSPARENT_600: '#00000099',
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    DARK_RED: 'darkred',
    DARK_SLATE_BLUE: 'darkslateblue',
    FLORAL_WHITE: 'floralwhite'
};

interface ColorScheme {
    [key: string]: {
        background: string;
        outline: string;
        content: string;
        contentBackground: string;
    }
}

const colorScheme: ColorScheme = {
    dark: {
        background: '#190a10',
        outline: 'darkred',
        content: 'floralwhite',
        contentBackground: 'maroon'
    },
    light: {
        background: 'aliceblue',
        outline: 'rebeccapurple',
        content: 'midnightblue',
        contentBackground: 'lightslategrey'
    }
}

export default colorScheme;
