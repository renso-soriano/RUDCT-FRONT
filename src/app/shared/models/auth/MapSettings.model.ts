import { Observable } from "rxjs";

export class MapSettings {
  servicio?: Observable<any> | any;
  GeoDataFile: string;
  BindProperty: string;
  BindValue: string;
  Label: string;
}
