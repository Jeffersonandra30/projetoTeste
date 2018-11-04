import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService } from '../server/_services';
import * as moment from 'moment'; // add this 1 of 4

declare var $;
@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css']
})
export class CadastroEmpresaComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private userService: UserService,
      private alertService: AlertService) { 
          moment().locale('pt-BR');
      }

  ngOnInit() {

      

      this.registerForm = this.formBuilder.group({
          cnpj: ['', Validators.required],
          nome: ['', Validators.required],
          dataFundacao: ['', Validators.required]
      });

      $ (() =>{                              
          
          $(".t-cnpj").mask("99.999.999/9999-99");
          $('.t-date').mask("00/00/0000");    
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }

      this.loading = true;
      this.userService.registerEmpresa(this.registerForm.value)
          .pipe(first())
          .subscribe(
              data => {
                  this.alertService.success('Empresa cadastrada com sucesso', true);
                  this.router.navigate(['/home']);
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
  }
}
