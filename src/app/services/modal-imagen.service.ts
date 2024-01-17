import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: 'usuarios'|'medicos'|'hospitales' = 'usuarios';
  public id: string | undefined = '' ;
  public img: string = '';
  public nuevaImagen: EventEmitter<String> = new EventEmitter<String>();
  
  constructor() { }

  get ocultarModal(): boolean {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string | undefined,
    img?: string | undefined
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img || 'no-image'; 

    if(img?.includes('https')){
      this.img = img;
    }else{
      //http://localhost:3005/api/subir-archivos/usuarios/75a18da8-43e6-4ba3-8885-a17113c26185.png
      this.img = `${base_url}/subir-archivos/${tipo}/${img}`;
    }
  }

  cerrarModal() {
    this._ocultarModal = true;
  }
  
}
