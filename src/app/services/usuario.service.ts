import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, catchError, delay} from 'rxjs/operators';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuario.interface';

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

  get role(): string {
    return this.usuario?.role || 'USER_ROLE';
  }

  get google(){
    return google;
  }

  get uid(){
    return this.usuario?.uid || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
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
        this.guardarEnLocalStorage(resp.token, resp.menu);
      })
    );
  }

  actualizarPerfil( data: {email: string, nombre: string, role: string | undefined}){

    data = {
      ...data,
      role: this.usuario?.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login( formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
    .pipe(
      tap( (resp: any) => {
        this.guardarEnLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
    .pipe(
      tap( (resp: any) => {
        this.guardarEnLocalStorage(resp.token, resp.menu);
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
        this.guardarEnLocalStorage(resp.token, resp.menu);
        return true;
      }),
      //map( resp => true), // El map puede que se llegue a ejecutar antes que el tap.
      catchError( error => of(false))
    );
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    google.accounts.id.revoke(this.usuario?.email, () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  cargarUsuarios(desde: number = 0){
    const url = `${base_url}/usuarios?desde=${desde}`;

    //return this.http.get<{total: Number, usuarios: Usuario[]}>(url, this.headers);
    return this.http.get<CargarUsuario>(url, this.headers)
            .pipe(
              delay(500),
              map( resp => {
                const usuarios = resp.usuarios.map( user => new Usuario(
                      user.nombre,
                      user.email,
                      '',
                      user.role,
                      user.google,
                      user.img,
                      user.uid) )
                return {
                  total: resp.total,
                  usuarios
                };
              })
            )

  }

  eliminarUsuario(usuario: Usuario){
    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`, this.headers);
  }

  guardarUsuario(usuario: Usuario){
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }


  guardarEnLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }
}
