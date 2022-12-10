import { Duration } from 'luxon';

export const getMinSec = (seconds: number): string => Duration.fromObject({ seconds }).toFormat('mm:ss');
