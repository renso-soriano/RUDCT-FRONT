import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Demanda } from "app/shared/models/Demandas/Demanda.model";
import { IDemanda } from "app/shared/models/Idemanda";
import { DemandasService } from "app/shared/services/mantenimientos/demandas.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Location } from '@angular/common';
import { AuthService } from "app/shared/services/core/auth.service";
import { GrupoUsuario } from "app/shared/models/grupoUsuario.enum";

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
  gruposUsuario: any;
  @Input() idExterno: number;

  rolesEnum = GrupoUsuario;



  abierto = false;

  constructor(
    private demandaService: DemandasService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.has("id")) {
        this.getDemanda(params.get("id"));
        this.gruposUsuario = this.authService.getGrupos()?.map(g => g.groupId) ?? [];
      }
      else {
        this.init()

      }
    });

  }

  init() {
    this.abierto = true;
    if(this.idExterno)
    {
      //this.gruposUsuario = [this.rolesEnum.soloLectura];
      this.getDemanda(this.idExterno.toString());
    }
    else{
      this.demanda = null;
    }

  }

  /**************************** */

  getDemanda(demandaId: string) {
    this.notFound = false;
    this.demanda = null;
    this.spinner.show();

    if (this.abierto) {
      this.demandaService.getDemandaByIdGobiernoAbierto(demandaId).subscribe(
        (demanda: Demanda) => {
          this.demanda = demanda;
        },
        (err: any) => {
          console.error(err);
          this.notFound = true;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
    }
    else {
      this.demandaService.getDemandaById(demandaId).subscribe(
        (demanda: Demanda) => {
          this.demanda = demanda;
        },
        (err: any) => {
          console.error(err);
          this.notFound = true;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
    }

  }

  goBack() {
    this._location.back();
  }

}
