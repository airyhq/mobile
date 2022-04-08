export interface DarkMode {
  isDarkModeOn: boolean;
}

export const DarkModeSchema = {
  name: 'DarkMode',
  properties: {
    isDarkModeOn: 'bool',
  },
};
