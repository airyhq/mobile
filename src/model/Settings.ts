export interface Settings {
  isDarkModeOn: boolean;
}

export const SettingsSchema = {
  name: 'Settings',
  properties: {
    isDarkModeOn: 'bool',
  },
};
