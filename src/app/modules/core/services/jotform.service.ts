import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JotformService {

  backUrl=environment.backUrl
  constructor(private readonly http: HttpClient) {}

  getJotformForms(){
    return this.http.get(`${this.backUrl}/forms`);
  }

  getFormFieldsJotformForId(id: number) {
    return this.http.get(`${this.backUrl}/forms/${id}/questions`);
  }

}

