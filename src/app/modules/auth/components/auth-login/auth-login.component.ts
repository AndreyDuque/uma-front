import {Component, Inject, OnInit} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {AuthService} from "../../../core/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
  env = environment
  code: string = '';

  constructor(
    public readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private readonly cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.cookieService.check('access_token')?this.cookieService.deleteAll():null;
  }

  showLogin(event: MouseEvent) {
    this.authService.getCode((event.target as HTMLElement).id).subscribe({
      'next': response => {
        if (response.url) {
          document.location = response.url;
        }
      },
      'error': error => console.log(error)
    });
  }

}
