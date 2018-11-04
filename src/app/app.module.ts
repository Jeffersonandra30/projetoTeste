import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './server/_helpers';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';

import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';


import { AlertComponent } from './server/_directives';
import { AuthGuard } from './server/_guards';
import { JwtInterceptor, ErrorInterceptor } from './server/_helpers';
import { AlertService, AuthenticationService, UserService } from './server/_services';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';;
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        TableModule,
        CardModule,
        ButtonModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent
,
        CadastroEmpresaComponent    ],

    providers: [
        CardModule,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }