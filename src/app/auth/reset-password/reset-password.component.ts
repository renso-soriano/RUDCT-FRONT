import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/services/core/auth.service';
import Validation from 'app/shared/validators/must-match.validator';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
//import { MustMatch } from '../../shared/validators/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loginFormSubmitted = false;
  isLoginFailed = false;
  appName = environment.appName;

  loginForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(true)
    },
    {
      validators: [Validation.match('password', 'confirmPassword')]
    }
  );


  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
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

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

    const userLogin = {
      usuarioId: this.authService.getUserId(),
      newPassword: this.loginForm.value.password
    };

   /*  this.authService.changePassword(userLogin).toPromise()
    .then((res) => {
      sessionStorage.setItem('userdata', JSON.stringify(res));
      this.spinner.hide();
      this.router.navigate(['/dashboard']);
    })
    .catch((err) => {
      this.toastr.error(err.error.message, `Error ${err.status}`)
      this.spinner.hide();
      this.router.navigate(['/auth']);
    }); */
  }

}
