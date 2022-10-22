import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {B24Service} from 'src/app/modules/core/services/b24.service';
import {JotformService} from 'src/app/modules/core/services/jotform.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.scss']
})
export class FormFieldsComponent implements OnInit {
  formB24: FormGroup = new FormGroup<any>({});
  fieldsFormJotfor: any[] = [];
  fieldsEntityCrm: any[] = [];
  fieldsEntityCrmCopy: any[] = [];
  idFormJotform: number = 0;
  titleFormJotform: string = '';
  entityCrm: string = '';
  relations: any[] = []
  changes: any = {}

  constructor(
    private readonly jotformService: JotformService,
    private readonly b24Service: B24Service,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

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
            if (fields[key].hasOwnProperty('sublabels')) {
              const arraySublabels = this.labelsProperties(fields[key].sublabels, fields[key].qid);
              arraySublabels.forEach(sublabel => {
                this.fieldsFormJotfor.push(sublabel);
              });
            } else {
              fields[key].fieldName = fields[key].qid + '_' + fields[key].name;
              this.fieldsFormJotfor.push(fields[key]);
              newFields[key] = fields[key];
            }
          }

        });
        let controls = {}
        this.fieldsFormJotfor.forEach(field => {
          const key = field.fieldName;
          controls = {
            ...controls,
            [key]: ['', [Validators.required]]
          }
        })
        this.formB24 = this.fb.nonNullable.group<any>(controls)

        // deteccion de cambios en los inputs
        this.formB24.valueChanges.subscribe({
          'next': formValues => {

            const formKeys = Object.keys(formValues);
            const changes = formKeys.filter(kf => formValues[kf] !== '')
            const keyChange = Object.keys(this.changes);
            changes.forEach((change) => {
              if(!this.changes.hasOwnProperty(change)){
                console.log(this.formB24.controls[change].value)
                this.changes[change] = true;
                // TODO: Verificar eliminar propiedad al seleccionar en input
                this.fieldsEntityCrmCopy = this.fieldsEntityCrmCopy.filter(obj => obj.key !== this.formB24.controls[change].value);
              }
            })
            console.log('this.changes', this.changes)
            console.log('this.fieldsEntityCrmCopy => ', this.fieldsEntityCrmCopy)
          }
        })
        console.log('Campos Jotform: ', this.fieldsFormJotfor);
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
            this.fieldsEntityCrm.push({key: key, ...fieldsEntity[key]});
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
        console.log('Campos B24: ', this.fieldsEntityCrm);
        this.fieldsEntityCrmCopy = this.fieldsEntityCrm;
      }
    })

    // detectar cambio en los input


  }

  labelsProperties(obj: any, qid: string) {
    const keys = Object.keys(obj);
    const fields: any[] = []
    keys.forEach(key => {
      if (key !== 'prefix' && key !== 'suffix' && key !== 'masked' && obj[key] !== '') {
        fields.push({property: key, text: obj[key], qid: qid, fieldName: qid + '_' + 'sublabels' + '_' + key})
      }
    });
    return fields;
  }

  itemSelected(fieldEntity: any) {
    console.log('fieldEntity:', fieldEntity)
  }

  relationCreate() {
    console.log('this.formB24.value => ', this.formB24.value)
    console.log('this.fieldsEntityCrm => ', this.fieldsEntityCrm)
    const keysForm = Object.keys(this.formB24.value);
    keysForm.forEach(key => {
      if(this.formB24.controls[key].valid){
      console.log({key})
        const field = this.fieldsEntityCrm.filter(obj => obj.title === this.formB24.controls[key].value || obj.listLabel === this.formB24.controls[key].value)[0]

        if(field){
          this.relations.push({
            [key]: field.key
          })
        }
      }
    })
    console.log(this.relations)
  }
}
