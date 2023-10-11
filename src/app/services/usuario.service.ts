import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, catchError} from 'rxjs/operators';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from 'src/environments/environment.development';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, 
              private router: Router, 
              private ngZone: NgZone) { 
    this.googleInit();
  }

  googleInit(){
    google.accounts.id.initialize({
      client_id: "678739285585-2mkugdmku0q5r7d4njkpc6q4oq5j4jrv.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
  }

  get google(){
    return google;
  }

  handleCredentialResponse(response: any){
    this.loginGoogle(response.credential)
      .subscribe(resp => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/dashboard');
        })
      });
  } 

  crearUsuario( formData: RegisterForm){
    console.log('Creando usuario ... ');
    return this.http.post(`${base_url}/usuarios`, formData)
    .pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      })
    );
  }

  login( formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
    .pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      })
    );
  }

  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
    .pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      })
    );
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true), 
      catchError( error => of(false))
    );
  }

  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke('earechigae@gmail.com', () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
    });
  }
}
