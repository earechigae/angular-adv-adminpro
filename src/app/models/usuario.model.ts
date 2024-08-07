import { environment } from "../../environments/environment"; 

const base_url = environment.base_url;
export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public role?: string,
        public google?: boolean,
        public img?: string,
        public uid?: string
    ){}

    get imagenUrl(){
        if(this.img){
            if(this.img.includes('https')){
                return this.img;
            }else{
                return `${base_url}/subir-archivos/usuarios/${this.img}`;
            }
        }else{
            return `${base_url}/subir-archivos/usuarios/no-image`;
        }
    }
}