import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/shared/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { QuienSoyComponent } from './quien-soy/quien-soy.component';
import { GobiernoAbiertoComponent } from './gobierno-abierto/gobierno-abierto.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Iniciar sesión'
        }
      },
      {
        path: 'password_reset',
        component: ResetPasswordComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Iniciar sesión'
        }
      },
      {
        path: 'quien_soy',
        component: QuienSoyComponent,
        data: {
          title: 'Iniciar sesión'
        }
      },
      {
        path: 'gobierno_abierto',
        component: GobiernoAbiertoComponent,
        data: {
          title: 'Iniciar sesión'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
