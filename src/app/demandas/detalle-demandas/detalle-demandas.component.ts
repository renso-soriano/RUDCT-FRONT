import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IDemanda } from "app/shared/models/Idemanda";
import { DemandasService } from "app/shared/services/mantenimientos/demandas.service";

@Component({
  selector: "app-detalle-demandas",
  templateUrl: "./detalle-demandas.component.html",
  styleUrls: ["./detalle-demandas.component.scss"],
})
export class DetalleDemandasComponent implements OnInit {
  demandas: IDemanda[];
  //demanda:IDemanda;
  demanda: any;
  notFound = false;

  constructor(
    private demandaService: DemandasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.has("CodigoDemanda")) {
        this.getDemanda(params.get("CodigoDemanda"));
      }
    });
  }

  /**************************** */

  getDemanda(CodigoDemanda: string) {
    this.notFound = false;
    this.demanda = null;

    this.demandaService.getDemandaByCodigo(CodigoDemanda).subscribe(
      (demandasFromTheAPI: any[]) => {
        this.demanda = demandasFromTheAPI[0];
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      }
    );
  }
}
