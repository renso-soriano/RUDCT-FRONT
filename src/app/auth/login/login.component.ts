import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Token } from 'app/shared/models/token.model';
import { AuthService } from 'app/shared/services/core/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormSubmitted = false;
  isLoginFailed = false;
  appName = environment.appName;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true)
  });


  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    /* this.authService.loggedIn()
    .then((res: any) => this.router.navigate(['/dasboard']))
    .catch((err: any) => {
      sessionStorage.clear()
      this.router.navigate(['/auth'])
    }) */

  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show();

    const userLogin = {
      nombreUsuario: this.loginForm.value.username,
      clave: this.loginForm.value.password
    };
    this.authService.signIn(userLogin).toPromise()
    .then((res: any) => {
      sessionStorage.setItem('userdata', JSON.stringify(new Token().deserialize(res)));
      this.router.navigate(['/dashboard']);

      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    })
    .catch((err) => {
      this.toastr.error(err.error.message, `Error ${err.status}`)
      this.isLoginFailed = true;
      this.spinner.hide();
    });
  }
}
