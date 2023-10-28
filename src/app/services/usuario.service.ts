import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, catchError} from 'rxjs/operators';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from 'src/environments/environment.development';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario | undefined;

  constructor(private http: HttpClient, 
              private router: Router, 
              private ngZone: NgZone) { 
    this.googleInit()
      .then(resultado => {
        console.log('Inicialización de Google terminada')
      });
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get google(){
    return google;
  }

  get uid(){
    return this.usuario?.uid || '';
  }

  async googleInit(){
    return new Promise( resolve => {
      console.log('Inicializando Google ...')
      google.accounts.id.initialize({
        client_id: "678739285585-2mkugdmku0q5r7d4njkpc6q4oq5j4jrv.apps.googleusercontent.com",
        callback: (response: any) => this.handleCredentialResponse(response)
      });
      resolve('');
    });
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

  actualizarPerfil( data: {email: string, nombre: string}){
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });
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
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      //tap( (resp: any) => {  // Optimizando, el tap puede ser ejecutado despues del map
      map( (resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario; 
        this.usuario = new Usuario(nombre, email, '', role, google, img, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      //map( resp => true), // El map puede que se llegue a ejecutar antes que el tap. 
      catchError( error => of(false))
    );
  }

  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke(this.usuario?.email, () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
    });
  }
}
