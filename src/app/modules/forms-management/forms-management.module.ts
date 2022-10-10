import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsManagementRoutingModule } from './forms-management-routing.module';
import { FormsLayoutComponent } from './components/forms-layout/forms-layout.component';
import { FormListComponent } from './components/form-list/form-list.component';


@NgModule({
  declarations: [
    FormsLayoutComponent,
    FormListComponent
  ],
  imports: [
    CommonModule,
    FormsManagementRoutingModule
  ]
})
export class FormsManagementModule { }
