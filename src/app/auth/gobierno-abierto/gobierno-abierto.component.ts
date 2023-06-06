import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Token } from 'app/shared/models/token.model';
import { AuthService } from 'app/shared/services/core/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ItemMenu } from 'app/shared/models/auth/ItemMenu';

@Component({
  selector: 'app-gobierno-abierto',
  templateUrl: './gobierno-abierto.component.html',
  styleUrls: ['./gobierno-abierto.component.scss']
})
export class GobiernoAbiertoComponent implements OnInit {

  activeModules = []

  menuItems: ItemMenu[] = [
    {
      id: 1,
      titulo: "Soy un ciudadano",
      subTitulo: "",
      ruta: "/auth/gobierno_abierto",
      imagePath: "../../../../../assets/img/svg/organismos.svg"

    },
    {
      id: 2,
      titulo: "Soy usuario RUDCT",
      subTitulo: "",
      ruta: "/auth/login",
      imagePath: "../../../../../assets/img/svg/negociacion.svg"

    },

  ]
  constructor(private router: Router,
    private authService: AuthService) { }

    public parrafos: any[] = [];

  ngOnInit(): void {
    this.activeModules = [1,2];
    this.parrafos = new Array(20);
  }
  navegar(item: ItemMenu) {
    if (this.activeModules.includes(item.id)) {
      this.router.navigate([`${item.ruta}`])
    }
  }

}
