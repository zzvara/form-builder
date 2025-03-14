import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { MenuOption } from '@models/menu-option.model';
import { RoutePath } from '@models/route-path.model';

const HEADER_CONFIGS = [
  {
    path: RoutePath.DASHBOARD,
    menuOptions: [MenuOption.UPLOAD_JSON, MenuOption.SETTINGS],
  },
  {
    path: RoutePath.EDIT,
    menuOptions: [MenuOption.HOME, MenuOption.SETTINGS],
  },
  {
    path: RoutePath.NEW,
    menuOptions: [MenuOption.HOME, MenuOption.SETTINGS],
  },
];

export const headerResolver: ResolveFn<null> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): null => {
  const headerService = inject(HeaderService);

  headerService.setOptions(
    HEADER_CONFIGS.find((config) => config.path === route.routeConfig?.path?.match(/([^/]+)$/)?.[0])?.menuOptions ??
      HEADER_CONFIGS.find((config) => config.path === RoutePath.DASHBOARD)!.menuOptions
  );

  return null;
};
