import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainLayoutComponent} from "./modules/core/shared/components/main-layout/main-layout.component";

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth',
        pathMatch: "full"
      },
      {
        path: 'auth',
        loadChildren: ()=> import('./modules/auth/auth.module').then(module => module.AuthModule)
      },
      {
        path: 'forms',
        loadChildren: ()=> import('./modules/forms-management/forms-management.module').then(module => module.FormsManagementModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
