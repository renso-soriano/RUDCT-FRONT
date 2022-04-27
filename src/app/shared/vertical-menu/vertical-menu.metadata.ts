// Sidebar route metadata
export interface RouteInfo {
  applicationId: number;
  parentModuleId: number;
  id?: number;
  order?: number;
  path: string;
  title: string;
  icon: string;
  description: string;
  class: string;
  badge?: string;
  badgeClass?: string;
  isExternalLink: boolean;
  submenu: RouteInfo[];

}
