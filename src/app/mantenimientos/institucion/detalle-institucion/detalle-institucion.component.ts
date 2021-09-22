import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Iinstitucion } from 'app/shared/models/iinstitucion';
import { InstitucionService } from 'app/shared/services/mantenimientos/institucion.service';

@Component({
  selector: 'app-detalle-institucion',
  templateUrl: './detalle-institucion.component.html',
  styleUrls: ['./detalle-institucion.component.scss']
})
export class DetalleInstitucionComponent implements OnInit {

  instituciones:Iinstitucion[];
  institucion:Iinstitucion;
  notFound = false;

  constructor(private institucionService: InstitucionService,
    private route:ActivatedRoute,
    private router:Router ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params=> {
      if(params.has("InstitucionId"))
      {
        this.getInstitucion(parseInt(params.get("InstitucionId")));
      }
    })
  }

  /**************************** */

  getInstitucion(InstitucionId: number) {
    this.notFound = false;
    this.institucion = null;

    this.institucionService.getInstitucionById(InstitucionId).subscribe((institucionFromTheAPI : Iinstitucion[]) => {
      this.institucion = institucionFromTheAPI[0];

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }



}
