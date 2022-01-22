import Config from 'react-native-config';
import store from '../state/store';

export interface Environment {
    exampleUrl: string;
}

export interface Environments {
    dev: Environment;
    stage: Environment;
    prod: Environment;
}

export interface CorsKey {
    exampleName: string;
}

export const corsKey: CorsKey = {
    exampleName: 'yes'
};

export const getEnvironment = (): Environment => {
    const environments: Environments = {
        dev: {
            exampleUrl: 'http://www.example.dev.com'
        },
        stage: {
            exampleUrl: 'http://www.example.stg.com'
        },
        prod: {
            exampleUrl: 'http://www.example.com'
        }
    };

    switch (Config.ENVIRONMENT) {
        case 'dev': return environments.dev;
        case 'stage': return environments.stage;
        case 'prod': return environments.prod;
        default: return environments.stage;
    }
};

export const getBuildEnvironment = (): string => {
    if (Config.ENVIRONMENT === 'prod') return '';
    return `-${Config.ENVIRONMENT.toUpperCase()}`;
}
