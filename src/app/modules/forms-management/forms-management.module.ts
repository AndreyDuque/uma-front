import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsManagementRoutingModule } from './forms-management-routing.module';
import { FormsLayoutComponent } from './components/forms-layout/forms-layout.component';
import { FormListComponent } from './components/form-list/form-list.component';
import { CrmManagementComponent } from './components/crm-management/crm-management.component';
import { FormFieldsComponent } from './components/form-fields/form-fields.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    FormsLayoutComponent,
    FormListComponent,
    CrmManagementComponent,
    FormFieldsComponent
  ],
  imports: [
    CommonModule,
    FormsManagementRoutingModule,
    CoreModule
  ]
})
export class FormsManagementModule { }
