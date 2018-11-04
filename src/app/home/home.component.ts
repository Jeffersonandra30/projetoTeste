import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../server/_models';
import { Company } from '../server/_models';
import { UserService } from '../server/_services';
import { AlertService } from '../server/_services';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    empresas: Company[];
    //empresas = JSON.parse(localStorage.getItem('empresa'));

    constructor(private userService: UserService,
        private router: Router,
        private alertService: AlertService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        
        this.loadAllUsers();
        this.loadAllCompany();
    }


    deleteCompany(id: number) {
        this.userService.deleteEmpresa(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
        location.reload();
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }

    private loadAllCompany() {
        this.userService.getAllCompany().pipe(first()).subscribe(empresa => { 
            this.empresas = empresa; 
        });
    }

    logout(){
        this.router.navigate(['/login']);
        this.alertService.success('Obrigado por utilizar nosso sistema!', true);

    }
}