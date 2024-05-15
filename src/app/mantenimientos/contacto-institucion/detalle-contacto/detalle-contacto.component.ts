import { Component, OnInit } from '@angular/core';
import { ContactoInsticionalService } from 'app/shared/services/mantenimientos/contacto-institucion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IcontactoInstitucional } from 'app/shared/models/iContactoInstitucional.model';
import { InstitucionService } from 'app/shared/services/mantenimientos/institucion.service';

@Component({
  selector: 'app-detalle-tecnicos',
  templateUrl: './detalle-contacto.component.html',
  styleUrls: ['./detalle-contacto.component.scss']
})
export class DetalleContactoComponent implements  OnInit {


  contacto:IcontactoInstitucional;
  notFound = false;
  institucionNombre:string
  constructor(private ContactoService: ContactoInsticionalService,
    private route:ActivatedRoute,
    private router:Router,
    private InstitucionService:InstitucionService ) { }

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

    this.ContactoService.getContactosInstitucionById(Id).subscribe(
      (contactoFromTheAPI: IcontactoInstitucional) => {
        this.contacto = contactoFromTheAPI;
        console.log(contactoFromTheAPI,'mi amiga')

        // Llamamos a getinstbyid para obtener el nombre de la institución
        this.getinstbyid(this.contacto.institucionId);
      },
      (err: any) => {
        console.error(err);
        this.notFound = true;
      }
    );
  }

  getinstbyid(Id: number) {
    this.InstitucionService.getInstitucionById(Id).subscribe(
      (data: any) => {
        this.institucionNombre = data.map(a => a.Nombre).join(', ');
      },
      (err: any) => {
        console.error(err);
      }
    );
  }


}

