import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthLayoutComponent} from "./components/auth-layout/auth-layout.component";
import {AuthLoginComponent} from "./components/auth-login/auth-login.component";
import {AuthorizationComponent} from "./components/authorization/authorization.component";

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: "full"
      },
      {
        path: 'login',
        component: AuthLoginComponent
      },
      {
        path: 'authorization',
        component: AuthorizationComponent
      }
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
