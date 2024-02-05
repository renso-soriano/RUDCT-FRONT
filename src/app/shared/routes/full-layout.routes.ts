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
    path: 'consolidacion',
    loadChildren: () => import('../../consolidacion/consolidacion.module').then(m => m.ConsolidacionModule)
  },
  {
    canActivate: [RoleGuard],
    path: 'repositorio',
    loadChildren: () => import('../../repositorio/repositorio.module').then(m => m.RepositorioModule)
  },
  {
    //canActivate: [RoleGuard],
    path: 'priorizacion',
    loadChildren: () => import('../../priorizacion/priorizacion.module').then(m => m.PriorizacionModule)
  },
  {
    canActivate: [RoleGuard],
    path: 'reportes',
    loadChildren: () => import('../../reportes/reportes.module').then(m => m.ReportesModule)
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
  },
  {
    canActivate: [RoleGuard],
    path: 'mantenimientos/tecnicos',
    loadChildren: () => import('../../mantenimientos/tecnicos/tecnicos.module').then(m => m.TecnicosModule)
  },

  {
    canActivate: [RoleGuard],
    path: 'mantenimientos/temaComun',
    loadChildren: () => import('../../mantenimientos/tema-comun/tema-comun.module').then(m => m.TemaComunModule)
  },
  {
    canActivate: [RoleGuard],
    path: 'mantenimientos/contactosinstitucionales',
    loadChildren: () => import('../../mantenimientos/contacto-institucion/contacto-institucion.module').then(m => m.ContactoInstitucionModule)
  }
];
