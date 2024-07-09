/* eslint-disable @typescript-eslint/no-var-requires */
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

export const defaultTimeZone = 'America/Bogota';

export const getEndOfMonth = (date: Date) => {
  return dayjs(date).endOf('month').format('YYYY-MM-DD HH:mm:ss');
};
