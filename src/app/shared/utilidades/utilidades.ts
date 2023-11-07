import { LatLng } from "@agm/core";
import { Point } from "chart.js";

export interface LeafletMouseEvent  {
  latlng: LatLng;
  layerPoint: Point;
  containerPoint: Point;
  originalEvent: MouseEvent;
}
