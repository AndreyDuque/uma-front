import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormsLayoutComponent} from "./components/forms-layout/forms-layout.component";
import {FormListComponent} from "./components/form-list/form-list.component";
import { CrmManagementComponent } from './components/crm-management/crm-management.component';
import { FormFieldsComponent } from './components/form-fields/form-fields.component';

const routes: Routes = [
  {
    path: '',
    component: FormsLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: "full"
      },
      {
        path: 'list',
        component: FormListComponent
      },
      {
        path: 'crm-management',
        component: CrmManagementComponent
      },
      {
        path: 'fields',
        component: FormFieldsComponent
      }
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsManagementRoutingModule { }
