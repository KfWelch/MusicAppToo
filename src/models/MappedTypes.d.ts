// Graciously lifted from https://stackoverflow.com/a/57726844
export type KeyFromValue<V, T extends Record<PropertyKey, PropertyKey>> = {
        [K in keyof T]: V extends T[K] ? K : never
    }[keyof T];

export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
        [V in T[keyof T]]: KeyFromValue<V, T>
    };
export type Nullable<T> = { [Key in keyof T]: T[Key] extends Array<any> ? T[Key] : Nullable<T[Key]> | null };

export type DeepPartial<T> = {
        [Key in keyof T]?:
            T[Key] extends (infer U)[] ? DeepPartial<U>[] :
            T[Key] extends (object | undefined) ? DeepPartial<T[Key]> :
            T[Key]
    }