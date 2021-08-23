import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ipolitica } from 'app/shared/models/ipolitica';
import { PoliticaService } from 'app/shared/services/politica.service';

@Component({
  selector: 'app-detalle-politica',
  templateUrl: './detalle-politica.component.html',
  styleUrls: ['./detalle-politica.component.scss']
})
export class DetallePoliticaComponent implements OnInit {

  politicas:Ipolitica[];
  politica:Ipolitica;
  notFound = false;

  constructor(private politicaService: PoliticaService,
    private route:ActivatedRoute,
    private router:Router ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params=> {
      if(params.has("PoliticaId"))
      {
        this.getPolitica(parseInt(params.get("PoliticaId")));
      }
    })
  }

  /**************************** */

  getPolitica(PoliticaId: number) {
    this.notFound = false;
    this.politica = null;

    this.politicaService.getPoliticaById(PoliticaId).subscribe((politicasFromTheAPI : Ipolitica[]) => {
      this.politica = politicasFromTheAPI[0];

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }

}
