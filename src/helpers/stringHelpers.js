/* eslint-disable import/prefer-default-export */
/**
 * Converts a snake case string to camel case
 * @param {string} value
 */
export const normalizeSnakeCaseToCamelCase = (value) => {
  const splitted = value.split(/_/g);
  return [
    splitted[0], splitted.slice(1).map((str) => str[0].toUpperCase() + str.slice(1)),
  ].join('');
};
