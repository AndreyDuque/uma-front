import { Component, OnInit } from '@angular/core';
import { JotformService } from 'src/app/modules/core/services/jotform.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  jotformForms: any[] =[];
  constructor(private readonly jotformService:JotformService ) { }

  ngOnInit(): void {
    this.jotformService.getJotformForms().subscribe({
      'next': (forms:any)=>{
        this.jotformForms = forms;
        console.log("formularios :", this.jotformForms)
      },
      'error':error=> console.log(error)
    })
  }

}
