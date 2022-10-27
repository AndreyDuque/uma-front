import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import {CoreModule} from "../core/core.module";
import {CookieService} from "ngx-cookie-service";


@NgModule({
  declarations: [
    AuthLayoutComponent,
    AuthLoginComponent,
    AuthorizationComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    CoreModule,
  ],
  providers: [CookieService]
})
export class AuthModule { }
