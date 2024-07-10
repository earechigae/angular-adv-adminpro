import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map, catchError, delay} from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos(){
    const url = `${base_url}/medicos`;

    return this.http.get(url, this.headers)
            .pipe(
              map( (resp: any) => {
                const medicos:Medico[] = resp.medicos.map( (medicos:any) => new Medico(
                  medicos.nombre,
                  medicos._id,
                  medicos.img,
                  medicos.usuario,
                  medicos.hospital) )
                  return medicos;
              })
            );
  }

  obtenerMedicoPorId(id: string ) {
    const url = `${base_url}/medicos/${id}`;

    return this.http.get(url, this.headers)
            .pipe(
              map( (resp: any) => {
                if(resp.medicos){
                  const medico: Medico = new Medico(
                    resp.medicos.nombre,
                    resp.medicos._id,
                    resp.medicos.img,
                    resp.medicos.usuario,
                    resp.medicos.hospital)
                    return medico;
                  }else{
                    return {} as Medico;
                  }
                })
            );
  }

  crearMedico(medico:Medico){
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico){
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  borrarMedico(_id:string){
    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
