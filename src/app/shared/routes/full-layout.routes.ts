import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../guards/role.guard';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    canActivate: [RoleGuard],
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    canActivate: [RoleGuard],
    path: 'demandas',
    loadChildren: () => import('../../demandas/demandas.module').then(m => m.DemandasModule)
  },
  {
    canActivate: [RoleGuard],
    path: 'mantenimientos/fuentes',
    loadChildren: () => import('../../mantenimientos/fuente-demanda/fuente-demanda.module').then(m => m.FuenteDemandaModule)
  },
  {
    canActivate: [RoleGuard],
    path: 'mantenimientos/tipos_beneficiarios',
    loadChildren: () => import('../../mantenimientos/tipo-beneficiario/tipo-beneficiario.module').then(m => m.TipoBeneficiarioModule)
  },
  {
    canActivate: [RoleGuard],
    path: 'mantenimientos/categoria_beneficiarios',
    loadChildren: () => import('../../mantenimientos/categoria-beneficiario/categoria-beneficiario.module').then(m => m.CategoriaBeneficiarioModule)
  }
];
