import { ItemaComun } from './../../../shared/models/iTemaComun';
import { Component, OnInit } from '@angular/core';
import { TemaComunService } from 'app/shared/services/mantenimientos/tema-comun.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-tema-comun',
  templateUrl: './detalle-tema-comun.component.html',
  styleUrls: ['./detalle-tema-comun.component.scss']
})
export class DetalleTemaComunComponent implements OnInit {


  temaComun:ItemaComun;
  notFound = false;

  constructor(private temaComunService: TemaComunService,
    private route:ActivatedRoute,
    private router:Router ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params=> {
      if(params.has("Id"))
      {
        this.getTemaComun(parseInt(params.get("Id")));
      }
    })
  }

  /**************************** */

  getTemaComun(Id: number) {
    this.notFound = false;
    this.temaComun = null;

    this.temaComunService.getTemaComunById(Id).subscribe((temaComunFromTheAPI : ItemaComun) => {
      this.temaComun = temaComunFromTheAPI;

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }

}
