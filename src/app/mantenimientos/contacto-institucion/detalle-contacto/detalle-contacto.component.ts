import { Component, OnInit } from '@angular/core';
import { ContactoInsticionalService } from 'app/shared/services/mantenimientos/contacto-institucion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IcontanctoInstitucional } from 'app/shared/models/iContactoInstitucional.model';

@Component({
  selector: 'app-detalle-tecnicos',
  templateUrl: './detalle-contacto.component.html',
  styleUrls: ['./detalle-contacto.component.scss']
})
export class DetalleContactoComponent implements  OnInit {


  contacto:IcontanctoInstitucional;
  notFound = false;

  constructor(private ContactoService: ContactoInsticionalService,
    private route:ActivatedRoute,
    private router:Router ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params=> {
      if(params.has("Id"))
      {
        this.getContacto(parseInt(params.get("Id")));
      }
    })
  }

  /**************************** */

  getContacto(Id: number) {
    this.notFound = false;
    this.contacto = null;

    this.ContactoService.getContactosInstitucionById(Id).subscribe((contactoFromTheAPI : IcontanctoInstitucional) => {
      this.contacto = contactoFromTheAPI;

      console.log(this.contacto);

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }

}

