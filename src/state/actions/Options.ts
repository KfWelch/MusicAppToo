
export const OVERRIDE_APPEARANCE = 'OPTIONS/OVERRIDE_APPEARANCE';
export const SET_DARKMODE = 'OPTIONS/SET_DARKMODE';
export const SET_OPTION = 'OPTIONS/SET_OPTION';

export const overrideSystemAppearance = (override: boolean) => ({
    type: OVERRIDE_APPEARANCE,
    payload: override
} as const);

export const setDarkmode = (isDarkMode: boolean) => ({
    type: SET_DARKMODE,
    payload: isDarkMode
} as const);

export const setOptionByName = (optionKey: string, value: any) => ({
    type: SET_OPTION,
    payload: { key: optionKey, value }
} as const);

export type Actions = ReturnType<typeof overrideSystemAppearance>
    | ReturnType<typeof setDarkmode>
    | ReturnType<typeof setOptionByName>;
