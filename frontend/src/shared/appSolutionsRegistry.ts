import { AppWebSocketNSPEnum, IAppSolutionRegistry, ISideBarItem, JwtUserRoleEnum, UserRoleDisplayStringEnum, WSEventNameEnum } from '@models/common';
import { AppRoutesEnum } from './appRotues';
// import dataCaptureIcon from '@assets/images/data-capture.svg';
// import dataUploadIcon from '@assets/images/data-upload.svg';

const socketNamespace = AppWebSocketNSPEnum.WS_NSP__WAREHOUSE_DBD;
const websocketEvents: Array<WSEventNameEnum> = [
  WSEventNameEnum.CARGO_PACKAGE_COUNT_LIVE_UPDATE_EVT,
  WSEventNameEnum.RACK_BASED_BIN_UPDATE,
  WSEventNameEnum.GROUND_STACK_CELL_UPDATE,
  WSEventNameEnum.JOB_STOP,
];

const sidebarItems: Array<ISideBarItem> = [];

const supportedUsersList: Array<UserRoleDisplayStringEnum> = [UserRoleDisplayStringEnum.DASHBOARD_WAREHOUSE_MANAGER];

const jwtSupportedUsersList: Array<JwtUserRoleEnum> = [JwtUserRoleEnum.DASHBOARD_WAREHOUSE_MANAGER];

/**
 * Maintains the registry for complete app solutions.
 * In future, if multiple modules are maintained with certain roles then make it array and append new solution.
 */
export const AppSolutionRegistry: IAppSolutionRegistry = {
  headerTitle: 'Dashboard',
  sidebarItems,
  solutionName: '__dashboard',
  supportedUserRoleStringsList: supportedUsersList,
  jwtUserRolesList: jwtSupportedUsersList,
  webSocketNamespace: socketNamespace,
  websocketEvents,
  landingPageRouteOnInit: (userRole: JwtUserRoleEnum) => {
    switch (userRole) {
      case JwtUserRoleEnum.DASHBOARD_WAREHOUSE_MANAGER:
        return AppRoutesEnum.DISCOVER;
    }
  },
};
