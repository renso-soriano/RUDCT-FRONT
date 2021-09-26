import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IcategoriaBeneficiario } from 'app/shared/models/iCategoriaBeneficiario';
import { CategoriaBeneficiarioService } from 'app/shared/services/mantenimientos/categoria-beneficiario.service';

@Component({
  selector: 'app-detalle-categoria',
  templateUrl: './detalle-categoria.component.html',
  styleUrls: ['./detalle-categoria.component.scss']
})
export class DetalleCategoriaComponent implements OnInit {


  categoriaBeneficiario:IcategoriaBeneficiario;
  notFound = false;

  constructor(private categoriaBeneficiarioService: CategoriaBeneficiarioService,
    private route:ActivatedRoute,
    private router:Router ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params=> {
      if(params.has("Id"))
      {
        this.getCategoriaBeneficiario(parseInt(params.get("Id")));
      }
    })
  }

  /**************************** */

  getCategoriaBeneficiario(Id: number) {
    this.notFound = false;
    this.categoriaBeneficiario = null;

    this.categoriaBeneficiarioService.getCategoriaBeneficiariosById(Id).subscribe((categoriasBeneficiariosFromTheAPI : IcategoriaBeneficiario) => {
      this.categoriaBeneficiario = categoriasBeneficiariosFromTheAPI;

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }

}
