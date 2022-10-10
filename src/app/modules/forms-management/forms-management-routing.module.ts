import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormsLayoutComponent} from "./components/forms-layout/forms-layout.component";
import {FormListComponent} from "./components/form-list/form-list.component";

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
      }
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsManagementRoutingModule { }
