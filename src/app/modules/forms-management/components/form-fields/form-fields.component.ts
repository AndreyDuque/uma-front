import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { B24Service } from 'src/app/modules/core/services/b24.service';
import { JotformService } from 'src/app/modules/core/services/jotform.service';

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.scss']
})
export class FormFieldsComponent implements OnInit {

  fieldsFormJotfor: any[] = [];
  fieldsEntityCrm: any[] = [];
  idFormJotform: number = 0;
  titleFormJotform: string = '';
  entityCrm: string = '';

  constructor(
    private readonly jotformService:JotformService,
    private readonly b24Service:B24Service,
    private readonly route:ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe({
      'next': query => {
        this.idFormJotform = Number(query['id']);
        this.entityCrm = query['entity'];
      }
    })

    this.route.params.subscribe({
      'next': param => {
        this.titleFormJotform = param['title'];
      }
    })

    // ---- TRAER CAMPOS DEL FORMULARIO DE JOTFORM SELECCIONADO ---- //
    let newFields: any = {};
    this.jotformService.getFormFieldsJotformForId(this.idFormJotform).subscribe({
      'next': (fields: any) => {
        const keys = Object.keys(fields);
        keys.forEach(key => {
          if (fields[key].hasOwnProperty('required')) {
            // console.log('---------', fields[key])
            this.fieldsFormJotfor.push(fields[key]);
            newFields[key] = fields[key];
          }

        });
        // const marcas = fields[30].list.split('\n ');
        // marcas[1].split('\n');
        console.log('*********', this.fieldsFormJotfor)
        // console.log('Campos furmulario Jotform: ', [marcas[0], marcas[1].split('\n')[0]]);
      },
      'error': error => console.log(error)
    })

    // ---- TRAER CAMPOS DE LA ENTIDAD CRM SELECCIONADA ---- //
    let selectedEntity = this.entityCrm;
    if (this.entityCrm === 'deal-and-contact') {
      selectedEntity = 'deals/deals-and-contacts';
    }
    this.b24Service.getEntityB24(selectedEntity).subscribe({
      'next': (fieldsEntity: any) => {
        if (selectedEntity !== 'deals/deals-and-contacts') {
          const keys = Object.keys(fieldsEntity);
          keys.forEach(key => {
            this.fieldsEntityCrm.push(fieldsEntity[key]);
          });
        } else {
          const keysContacts = Object.keys(fieldsEntity.contacts);
          const keysDeals = Object.keys(fieldsEntity.deals);
          keysContacts.forEach(keysContacts => {
            this.fieldsEntityCrm.push(fieldsEntity.contacts[keysContacts]);
          });
          keysDeals.forEach(keysDeals => {
            this.fieldsEntityCrm.push(fieldsEntity.deals[keysDeals]);
          });
        }
        // console.log('Campos entidad ' + this.entityCrm, this.fieldsEntityCrm);
      }
    })
  }

  labelsProperties(obj: any) {
    const keys = Object.keys(obj);
    const fields: any[] = []
    keys.forEach(key => {
      if (key !== 'prefix' && key !== 'suffix' && key !== 'masked' && obj[key] !== '' ) {
        fields.push({[key]: obj[key], text: obj[key]})
      }
    });
    return fields;
  }

}
