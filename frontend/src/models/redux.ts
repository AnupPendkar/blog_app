import { IHttpErrDetails, ParsedUserInfo, ThemePrefEnum } from './common';

export interface GlobalUserVariables {
  userLoggedIn: boolean;
  parsedUserInfo: ParsedUserInfo | undefined;
  isSocketConnected: boolean;
  themePref: ThemePrefEnum;
}

export interface axiosState {
  loading: boolean;
  loaderVisibility?: boolean;
  error: boolean;
  httpErrDetails?: IHttpErrDetails;
}
