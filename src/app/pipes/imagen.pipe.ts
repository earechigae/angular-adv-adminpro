import { Pipe, PipeTransform } from '@angular/core';
import { environment } from "../../environments/environment"; 

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios'|'medicos'|'hospitales'): string {
    if(img){
      if(img.includes('https')){
          return img;
      }else{
          return `${base_url}/subir-archivos/${tipo}/${img}`;
      }
    }else{
        return `${base_url}/subir-archivos/${tipo}/no-image`;
    }
  }

}
