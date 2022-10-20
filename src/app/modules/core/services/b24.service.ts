import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class B24Service {

  backUrl=environment.backUrl
  constructor(private readonly http: HttpClient) { }

  getEntityB24(entity: string){
    return this.http.get(`${this.backUrl}/${entity}`);
  }

}
