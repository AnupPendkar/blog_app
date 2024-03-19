import { IHttpErrDetails, ParsedUserInfo, ThemePrefEnum } from './common';
import { IUserInfoAPI } from './user_service_model';

export interface GlobalUserVariables {
  userLoggedIn: boolean;
  parsedUserInfo: ParsedUserInfo | undefined;
  isSocketConnected: boolean;
  themePref: ThemePrefEnum;
  userInfo?: IUserInfoAPI;
}

export interface axiosState {
  loading: boolean;
  loaderVisibility?: boolean;
  error: boolean;
  httpErrDetails?: IHttpErrDetails;
}
