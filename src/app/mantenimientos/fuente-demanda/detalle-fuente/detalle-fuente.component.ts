import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IfuenteDemanda } from 'app/shared/models/ifuente-demanda';
import { FuenteService } from 'app/shared/services/mantenimientos/fuente.service';

@Component({
  selector: 'app-detalle-fuente',
  templateUrl: './detalle-fuente.component.html',
  styleUrls: ['./detalle-fuente.component.scss']
})
export class DetalleFuenteComponent implements OnInit {

  fuentes:IfuenteDemanda[];
  fuente:IfuenteDemanda;
  notFound = false;

  constructor(private fuenteService: FuenteService,
    private route:ActivatedRoute,
    private router:Router ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params=> {
      if(params.has("FuenteId"))
      {
        this.getFuente(parseInt(params.get("FuenteId")));
      }
    })
  }

  /**************************** */

  getFuente(FuenteId: number) {
    this.notFound = false;
    this.fuente = null;

    this.fuenteService.getFuenteById(FuenteId).subscribe((fuenteFromTheAPI : IfuenteDemanda[]) => {
      this.fuente = fuenteFromTheAPI[0];

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }

}
