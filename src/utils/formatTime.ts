import { zeroFill } from "./index";

const months = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];

const days = [
  'Chủ nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];

export const convertUnixTimeFull = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = months[dateTime.getMonth()];
  const date = dateTime.getDate();
  const day = days[dateTime.getDay()];
  const hour = dateTime.getHours();
  const min = dateTime.getMinutes();

  const time = `${zeroFill(hour, 2)}:${zeroFill(min, 2)} ${day}, ${zeroFill(
    date,
    2,
  )}/${month}/${year}`;
  return { time, date };
};

export const convertUnixTimeWithDay = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = months[dateTime.getMonth()];
  const date = dateTime.getDate();
  const day = days[dateTime.getDay()];

  return `${day}, ${zeroFill(date, 2)}/${month}/${year}`;
};

export const convertUnixTimeWithHour = (dateTime: Date) => {
  const hour = dateTime.getHours();
  const min = dateTime.getMinutes();

  return `${zeroFill(hour, 2)}:${zeroFill(min, 2)}`;
};

export const convertUnixTimeDDMMYYYY = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = months[dateTime.getMonth()];
  const date = dateTime.getDate();

  return `${zeroFill(date, 2)}/${zeroFill(month, 2)}/${year}`;
};

export const convertUnixTimeHHMM = (dateTime: Date) => {
  const hour = dateTime.getHours();
  const min = dateTime.getMinutes();

  return `${zeroFill(hour, 2)}:${zeroFill(min, 2)}`;
};

export const convertUnixTimeMMDDYYYY = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = months[dateTime.getMonth()];
  const date = dateTime.getDate();

  return `${month}/${zeroFill(date, 2)}/${year}`;
};

export const convertUnixTimeNoSpaceYYYYMMDD = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = months[dateTime.getMonth()];
  const date = dateTime.getDate();

  return `${year}${month}${zeroFill(date, 2)}`;
};
