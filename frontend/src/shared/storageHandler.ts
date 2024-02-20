import { LsKeyNameEnum, ParsedUserInfo, ThemePrefEnum } from '@models/common';

export default class StorageHandler {
  baseUrl: string;
  __baseurlInstance: URL;
  parsedUserInfo!: ParsedUserInfo;

  get serverAddress(): string {
    return this.__baseurlInstance?.hostname;
  }
  get serverPort(): string {
    return this.__baseurlInstance?.port;
  }

  get activeBaseUrl(): string | null {
    return localStorage.getItem(LsKeyNameEnum.ACTIVE_BASE_URL);
  }

  set setActiveBaseUrl(url: string) {
    localStorage.setItem(LsKeyNameEnum.ACTIVE_BASE_URL, url);
  }

  get originalBaseUrl(): string | null {
    return localStorage.getItem(LsKeyNameEnum.ORIGINAL_BASE_URL);
  }

  set setOriginalBaseUrl(url: string) {
    localStorage.setItem(LsKeyNameEnum.ORIGINAL_BASE_URL, url);
  }

  set setAccesstoken(token: string) {
    localStorage.setItem(LsKeyNameEnum.ACCESS_TOKEN, token);
  }

  get jwtAccesToken(): string | null {
    return localStorage.getItem(LsKeyNameEnum.ACCESS_TOKEN);
  }

  set setRefreshtoken(token: string) {
    localStorage.setItem(LsKeyNameEnum.REFRESH_TOKEN, token);
  }

  get jwtRefreshToken(): string | null {
    return localStorage.getItem(LsKeyNameEnum.REFRESH_TOKEN);
  }

  setThemePreference(theme: string) {
    localStorage.setItem(LsKeyNameEnum.THEME, theme);
  }

  get getThemePreference(): string {
    return localStorage.getItem(LsKeyNameEnum.THEME);
  }
}
