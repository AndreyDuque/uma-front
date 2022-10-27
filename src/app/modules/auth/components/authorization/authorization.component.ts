import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {AuthService} from "../../../core/services/auth.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(DOCUMENT) private document: Document,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      'next': queries => {
        const token = queries['access_token'];
        if (token) {
          this.saveToken(token);
        }
      }
    })
  }

  saveToken(token: string) {
    this.cookieService.set('access_token', token);
    this.goToApp();
  }

  goToApp(){
    this.router.navigate(['/forms']).then()
  }
}
