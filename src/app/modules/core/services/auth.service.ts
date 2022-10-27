import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
    ) {
  }

  getCode(client: string) {
    this.cookieService.check('client')?this.cookieService.delete('client'):null;
    this.cookieService.set('client', client);
    return this.http.get<{url: string}>(`${this.apiUrl}/auth/code/${client}`);
  }

  logout() {
    this.cookieService.deleteAll();
    return true;
  }
}
