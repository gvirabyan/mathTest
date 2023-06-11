export const isNullish = obj => {
  return Object.values(obj).every(value => {
    return value === null;
  });
};
