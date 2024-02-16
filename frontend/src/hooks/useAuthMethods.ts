import { JwtUserRoleEnum } from '@models/common';
import { userActiveAction, userDetailsAction } from '@redux/actions/userInfoActions';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { AppRoutesEnum } from '@shared/appRotues';
import { AppSolutionRegistry } from '@shared/appSolutionsRegistry';
import UrlConfigManager from '@shared/urlConfigManager';
import { makeRequest } from '@redux/thunks/axiosRequestThunk';
import { isPropEmpty } from '@shared/utilfunctions';

const useAuthMethods = () => {
  const dispatch = useAppDispatch();
  const urlConfigManager = new UrlConfigManager();
  const { parsedUserInfo } = useAppSelector((state) => state?.user);

  async function logout() {
    await dispatch(
      makeRequest({
        method: 'post',
        url: '/logout',
        data: { username: parsedUserInfo?.username },
      })
    );

    urlConfigManager.removeTokensFromLS();
    dispatch(userActiveAction(false));
  }

  /**
   * This function sets the token values in LS, after successful login attempt.
   * @param access
   * @param refresh
   */
  function setUserLoginData(access: string, refresh: string) {
    if (isPropEmpty(access) || isPropEmpty(refresh)) {
      return;
    }
    urlConfigManager.setAccesstoken = access;
    urlConfigManager.setRefreshtoken = refresh;
    urlConfigManager.setParsedTokenData();

    dispatch(userDetailsAction(urlConfigManager.parsedUserInfo));
  }

  function getLandingPageOnInit(): AppRoutesEnum {
    return AppSolutionRegistry.landingPageRouteOnInit(parsedUserInfo.role as JwtUserRoleEnum);
  }

  return { setUserLoginData, logout, getLandingPageOnInit };
};

export default useAuthMethods;
