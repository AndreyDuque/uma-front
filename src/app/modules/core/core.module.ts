import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { B24Service } from './services/b24.service';
import { JotformService } from './services/jotform.service';
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth.service";
import {RelationsService} from "./services/relations.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[
    B24Service,
    JotformService,
    AuthService,
    RelationsService
  ]
})
export class CoreModule { }
