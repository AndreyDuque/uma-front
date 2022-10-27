import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class JotformService {

  backUrl=environment.apiUrl
  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) {}

  getJotformForms(){
    const client = this.cookieService.check('client')?this.cookieService.get('client'):'';
    return this.http.get(`${this.backUrl}/forms?client=${client}`);
  }

  getFormFieldsJotformForId(id: number) {
    const client = this.cookieService.check('client')?this.cookieService.get('client'):'';
    return this.http.get(`${this.backUrl}/forms/${id}/questions?client=${client}`);
  }

}

