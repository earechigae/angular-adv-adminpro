import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { SubirArchivosService } from 'src/app/services/subir-archivos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit{

  public usuario: Usuario | undefined;
  public perfilForm: FormGroup = this.fb.group({});
  public imagenSubir: File | undefined;
  public imgTemp: string | ArrayBuffer | null = null;
  
  constructor(private fb: FormBuilder, 
              private usuarioService: UsuarioService,
              private subirArchivosService: SubirArchivosService){
      this.usuario = this.usuarioService.usuario;
  }
    
  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre, Validators.required], 
      email: [this.usuario?.email, [Validators.required, Validators.email]]
    });
    
  }
  
  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe( resp => {
        const {nombre, email} = this.perfilForm.value;
        if(this.usuario != undefined){
          this.usuario.nombre = nombre;
          this.usuario.email = email;
        }
        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
      }, (err) => {
        Swal.fire('Error',err.error.msg, 'error');
      });
  }

  cambiarImagen(event: Event | null){
    const target = event?.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.imagenSubir = file;
    //console.log(file);
    //console.log(event);

    if(!file){
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    if(this.imagenSubir != undefined){
      this.subirArchivosService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario?.uid || '')
        .then(img => {
          //console.log(img);
          if(this.usuario != undefined){
            this.usuario.img = img;
            Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
          }
        }).catch( err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        });
    }
  }

  cancelarSubirImagen(){
    this.imgTemp = null;
    
  }
}
