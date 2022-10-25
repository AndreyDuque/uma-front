import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { B24Service } from 'src/app/modules/core/services/b24.service';
import { JotformService } from 'src/app/modules/core/services/jotform.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
  relations: any[] = [];
  relatedFields: any = {};
  changes: any = {};

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
              fields[key].validator = true;
              fields[key].validateRelationship = true;
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
        console.log('Campos Jotform: ', this.fieldsFormJotfor);
        this.formB24 = this.fb.nonNullable.group<any>(controls)
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
        let dealIndex = 0;
        if (selectedEntity !== 'deals/deals-and-contacts') {
          const keys = Object.keys(fieldsEntity);
          keys.forEach(key => {
            this.fieldsEntityCrm.push({ key: key, ...fieldsEntity[key] });
          });
        } else {
          const keysContacts = Object.keys(fieldsEntity.contacts);
          const keysDeals = Object.keys(fieldsEntity.deals);
          keysContacts.forEach((keysContacts, index) => {
            this.fieldsEntityCrm.push({ key: 'contact#' + keysContacts, ...fieldsEntity.contacts[keysContacts] });
            if (this.fieldsEntityCrm[index].title) {
              let titleField = this.fieldsEntityCrm[index].title;
              this.fieldsEntityCrm[index].title = 'CONTACT: ' + titleField;
            }
            if (this.fieldsEntityCrm[index].listLabel) {
              let listLabelField = this.fieldsEntityCrm[index].listLabel
              this.fieldsEntityCrm[index].listLabel = 'CONTACT: ' + listLabelField;
            }
            dealIndex = index;
          });
          dealIndex = dealIndex + 1;
          keysDeals.forEach(keysDeals => {
            this.fieldsEntityCrm.push({ key: 'deal#' + keysDeals, ...fieldsEntity.deals[keysDeals] });
            if (this.fieldsEntityCrm[dealIndex].title) {
              let titleField = this.fieldsEntityCrm[dealIndex].title;
              this.fieldsEntityCrm[dealIndex].title = 'DEAL: ' + titleField;
            }
            if (this.fieldsEntityCrm[dealIndex].listLabel) {
              let listLabelField = this.fieldsEntityCrm[dealIndex].listLabel
              this.fieldsEntityCrm[dealIndex].listLabel = 'DEAL: ' + listLabelField;
            }
            dealIndex++;
          });
        }
        console.log('Campos B24: ', this.fieldsEntityCrm);
        this.fieldsEntityCrmCopy = this.fieldsEntityCrm;
        this.validateFields();
      }
    })
  }

  labelsProperties(obj: any, qid: string) {
    const keys = Object.keys(obj);
    const fields: any[] = []
    keys.forEach(key => {
      if (key !== 'prefix' && key !== 'suffix' && key !== 'masked' && obj[key] !== '') {
        fields.push({ property: key, text: obj[key], qid: qid, fieldName: qid + '_' + 'sublabels' + '_' + key, validator: true, validateRelationship: true })
      }
    });
    return fields;
  }

  itemSelected(fieldEntity: any) {
    console.log('fieldEntity:', fieldEntity)
  }

  relationCreate() {
    const keysForm = Object.keys(this.formB24.value);
    keysForm.forEach(key => {
      if (this.formB24.controls[key].valid) {
        const field = this.fieldsEntityCrm.filter(obj => obj.title === this.formB24.controls[key].value || obj.listLabel === this.formB24.controls[key].value)[0]
        if (field) {
          this.relations.push([
            key, field.key
          ])
        }
      }
    })
    this.relatedFields = {
      userId: '',
      formId: this.idFormJotform,
      bitrixType: this.entityCrm,
      relations: this.relations
    }
    console.log('Objeto a enviar al Back: ', this.relatedFields);
  }

  validateFields() {
    this.formB24.valueChanges.subscribe({
      'next': formValues => {
        const formKeys = Object.keys(formValues);
        const catches: any[] = [];
        formKeys.forEach((formKey) => {
          // let campoJotform = this.formB24.controls[formKey].value
          let fieldCrm = this.fieldsEntityCrm.filter(field => field.title === this.formB24.controls[formKey].value || field.listLabel
            === this.formB24.controls[formKey].value)[0]
          if (fieldCrm || formValues[formKey] === "") {
            let index = this.fieldsFormJotfor.findIndex((field: any) => field.fieldName == formKey);
            this.fieldsFormJotfor[index].validator = true;
            this.fieldsFormJotfor[index].validateRelationship = true;
            if (formValues[formKey] != "") {
              catches.push(formValues[formKey]);
              catches.filter((capture, index) => {
                let validateDuplicate = catches.indexOf(capture) === index;
                if (validateDuplicate) {
                  this.fieldsFormJotfor[index].validateRelationship = true;
                } else {
                  this.fieldsFormJotfor[index].validateRelationship = false;
                }
              })
            }
          } else {
            let index = this.fieldsFormJotfor.findIndex((field: any) => field.fieldName == formKey);
            this.fieldsFormJotfor[index].validator = false;
          }
        })
      }
    })
  }
}
