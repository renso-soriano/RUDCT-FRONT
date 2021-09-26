import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItipoBeneficiario } from 'app/shared/models/iTipoBeneficiario';
import { TipoBeneficiarioService } from 'app/shared/services/mantenimientos/tipo-beneficiario.service';

@Component({
  selector: 'app-detalle-tipo',
  templateUrl: './detalle-tipo.component.html',
  styleUrls: ['./detalle-tipo.component.scss']
})
export class DetalleTipoComponent implements OnInit {


  tipoBeneficiario:ItipoBeneficiario;
  notFound = false;

  constructor(private tipoBeneficiarioService: TipoBeneficiarioService,
    private route:ActivatedRoute,
    private router:Router ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params=> {
      if(params.has("Id"))
      {
        this.getTipoBeneficiario(parseInt(params.get("Id")));
      }
    })
  }

  /**************************** */

  getTipoBeneficiario(Id: number) {
    this.notFound = false;
    this.tipoBeneficiario = null;

    this.tipoBeneficiarioService.getTipoBeneficiariosById(Id).subscribe((tiposBeneficiariosFromTheAPI : ItipoBeneficiario) => {
      this.tipoBeneficiario = tiposBeneficiariosFromTheAPI;

    }, (err: any) => {
      console.error(err);
      this.notFound = true;
    });
  }

}
