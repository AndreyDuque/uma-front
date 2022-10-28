import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { B24Service } from 'src/app/modules/core/services/b24.service';
import { JotformService } from 'src/app/modules/core/services/jotform.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from "ngx-cookie-service";
import { RelationsService } from "../../../core/services/relations.service";
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

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
  activateSubmit: boolean = false;

  constructor(
    private readonly jotformService: JotformService,
    private readonly b24Service: B24Service,
    private readonly relationsService: RelationsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private readonly cookieService: CookieService,
    private location: Location
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
        this.formB24 = this.fb.nonNullable.group<any>(controls);
        if (this.fieldsFormJotfor.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `¡${this.titleFormJotform},
            no contiene campos que se puedan relacionar. Por favor seleccione otro formulario!`
          })
          this.router.navigate(['/forms/list']);
        }
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

    const client = this.cookieService.check('client') ? this.cookieService.get('client') : null;

    this.relatedFields = {
      client,
      formId: this.idFormJotform,
      bitrixType: this.entityCrm,
      relations: this.relations
    };
    this.relationsService.createRelation(this.relatedFields).subscribe({
      'next': result => console.log(result),
      'error': error => console.log(error),
    });
    this.toastr.success('¡Formulario ' + this.titleFormJotform + ' vinculado exitosamente!', '¡Bien!');
    this.router.navigate(['/forms/list']).then()
    console.log('Objeto a enviar al Back: ', this.relatedFields);
  }

  validateFields() {
    this.formB24.valueChanges.subscribe({
      'next': formValues => {
        const formKeys = Object.keys(formValues);
        const catches: any[] = [];
        // VALIDAR CAMPOS QUE NO ESTEN VACIOS
        const changes = formKeys.filter(fk => formValues[fk] !== '');
        changes.forEach(change => {
          let fields = this.fieldsEntityCrm.filter(fec => fec.title === formValues[change] || fec.listLabel === formValues[change])
          let indexJ = this.fieldsFormJotfor.findIndex(fj => fj.fieldName === change)
          if (fields.length === 0) {
            this.fieldsFormJotfor[indexJ].validator = false
            this.activateSubmit = false
          } else {
            this.fieldsFormJotfor[indexJ].validator = true
            this.activateSubmit = true
            catches.push(formValues[change]);
            catches.filter((capture, index) => {
              let validateDuplicate = catches.indexOf(capture) === index;
              if (validateDuplicate) {
                this.fieldsFormJotfor[indexJ].validateRelationship = true;
              } else {
                this.fieldsFormJotfor[indexJ].validateRelationship = false;
                this.activateSubmit = false;
              }
            })
          }
        })
        // VALIDAR SI HAY CAMPOS VACIOS
        const emptyFields = formKeys.filter(fk => formValues[fk] === "");
        if (emptyFields.length === this.fieldsFormJotfor.length) {
          this.activateSubmit = false
        }
        emptyFields.forEach(field => {
          let indexJ = this.fieldsFormJotfor.findIndex(fj => fj.fieldName === field)
          this.fieldsFormJotfor[indexJ].validator = true
          this.fieldsFormJotfor[indexJ].validateRelationship = true;
        })
        // VALIDAR ESTADO DE PROPIEDADES
        const validateStates = this.fieldsFormJotfor.filter(fields => fields.validator === false)
        if (validateStates.length > 0) {
          this.activateSubmit = false
        }
      }
    })
  }

  goBack() {
    // window.history.back();
    this.location.back();

    console.log('goBack()...');
  }
}
