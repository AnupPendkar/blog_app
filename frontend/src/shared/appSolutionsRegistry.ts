import { AppWebSocketNSPEnum, IAppSolutionRegistry, ISideBarItem, JwtUserRoleEnum, UserRoleDisplayStringEnum, WSEventNameEnum } from '@models/common';
import { AppRoutesEnum } from './appRotues';

const socketNamespace = AppWebSocketNSPEnum.WS_NSP__WAREHOUSE_DBD;
const websocketEvents: Array<WSEventNameEnum> = [];
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
};
