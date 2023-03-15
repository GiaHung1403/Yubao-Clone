export const formatVND = (num: any) =>
  num
    ? parseInt(num, 10)
      .toString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    : '0';
