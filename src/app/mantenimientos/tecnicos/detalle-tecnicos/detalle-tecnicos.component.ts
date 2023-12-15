import { Itecnico } from './../../../shared/models/itecnico';
import { Component, OnInit } from '@angular/core';
import { TecnicosService } from 'app/shared/services/mantenimientos/tecnicos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-tecnicos',
  templateUrl: './detalle-tecnicos.component.html',
  styleUrls: ['./detalle-tecnicos.component.scss']
})
export class DetalleTecnicosComponent implements  OnInit {


  tecnico:Itecnico;
  notFound = false;

  constructor(private tecnicoService: TecnicosService,
    private route:ActivatedRoute,
    private router:Router ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params=> {
      if(params.has("Id"))
      {
        this.getTecnico(parseInt(params.get("Id")));
      }
    })
  }

  /**************************** */

  getTecnico(Id: number) {
    this.notFound = false;
    this.tecnico = null;

    this.tecnicoService.getTecnicosById(Id).subscribe((tecnicoFromTheAPI : Itecnico) => {
      this.tecnico = tecnicoFromTheAPI;

      console.log(this.tecnico);

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }

}

