import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JotformService } from 'src/app/modules/core/services/jotform.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  jotformForms: any[] =[];

  constructor(
    private readonly jotformService:JotformService,
    private readonly router: Router
  )
    { }

  ngOnInit(): void {
    this.jotformService.getJotformForms().subscribe({
      'next': (forms:any)=>{
        this.jotformForms = forms;
        console.log("formularios :", this.jotformForms)
      },
      'error':error=> console.log(error)
    })
  }

  userClick(e: any) {
    this.router.navigate([`/forms/crm-management/${e.title}`], { queryParams: { id: e.id } }).then();
    console.log('evento click :',e)
  }

}
