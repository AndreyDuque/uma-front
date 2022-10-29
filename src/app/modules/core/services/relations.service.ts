import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RelationsService {
apiUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) { }

  createRelation(relatedFields: any) {
    console.log(relatedFields);
    return this.http.post(`${this.apiUrl}/relations`,relatedFields);
  }
}
