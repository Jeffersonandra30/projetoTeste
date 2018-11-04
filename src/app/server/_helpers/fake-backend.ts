import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        let empresa: any[] = JSON.parse(localStorage.getItem('empresa')) || [];

        return of(null).pipe(mergeMap(() => {

            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                
                let filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    
                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    
                    return throwError({ error: { message: 'Usuário ou senha está incorreto!' } });
                }
            }

            if (request.url.endsWith('/users') && request.method === 'GET') {
                
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            
            if (request.url.endsWith('/empresa') && request.method === 'GET') {
                
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: empresa }));
                } else {
                    
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }


            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = users.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            
            if (request.url.match(/\/empresa\/\d+$/) && request.method === 'GET') {
                
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedCompany = empresa.filter(empresa => { return empresa.id === id; });
                    let empresas = matchedCompany.length ? matchedCompany[0] : null;

                    return of(new HttpResponse({ status: 200, body: empresas }));
                } else {
                    
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }


            // register user
            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                
                let newUser = request.body;

                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
                }

                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                return of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    return of(new HttpResponse({ status: 200 }));
                
                } else {
                    
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // registra empresa
            if (request.url.endsWith('/users/register/empresa') && request.method === 'POST') {
                
                let newUser = request.body;

                let duplicateCompany = empresa.filter(empresa => { return empresa.cnpj === newUser.cnpj; }).length;
                if (duplicateCompany) {
                    return throwError({ error: { message: 'Empresa"' + newUser.cnpj + '" Já está cadastrada' } });
                }

                newUser.id = empresa.length + 1;
                empresa.push(newUser);
                localStorage.setItem('empresa', JSON.stringify(empresa));

                return of(new HttpResponse({ status: 200 }));
            }

            // deleta empresa
            if (request.url.match(/\/empresa\/\d+$/) && request.method === 'DELETE') {
                
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < empresa.length; i++) {
                        let user = empresa[i];
                        if (user.id === id) {
                            
                            empresa.splice(i, 1);
                            localStorage.setItem('empresa', JSON.stringify(empresa));
                            break;
                        }
                    }

                    return of(new HttpResponse({ status: 200 }));
                
                } else {
                    
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            return next.handle(request);
            
        }))

        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};