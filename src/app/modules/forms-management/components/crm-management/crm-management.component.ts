// import { query } from '@angular/animations';
import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'crm-management',
  templateUrl: './crm-management.component.html',
  styleUrls: ['./crm-management.component.scss']
})
export class CrmManagementComponent implements OnInit {

  idForm: number = 0;
  titleForm: string = "";
  entitiesCrm: any[] = [
    ['lead', 'LEAD'],
    ['deal', 'DEAL'],
    ['contact', 'CONTACT'],
    ['company', 'COMPANY'],
    ['deal-and-contact', 'DEAL + CONTACT']
  ]

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      'next': query => {
        this.idForm = Number(query['id']);
      }
    })

    this.route.params.subscribe({
      'next': param => {
        this.titleForm = param['title'];
      }
    })

  }

  userClick(entityCrm: string) {
    this.router.navigate([`/forms/fields/${entityCrm}`], { queryParams: { id: this.idForm } }).then();
  }

}
