import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './modules/core/shared/components/main-layout/main-layout.component';
import { FooterComponent } from './modules/core/shared/components/footer/footer.component';
import { NavbarComponent } from './modules/core/shared/components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    FooterComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
