import { Component } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { SubirArchivosService } from 'src/app/services/subir-archivos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent {

  public ocultarModal: boolean = false;
  public imagenSubir: File | undefined;
  public imgTemp: string | ArrayBuffer | null = null;

  constructor(public modalImagenService: ModalImagenService,
              public subirArchivosService:SubirArchivosService) { }

  cerrarModal() {
    this.imgTemp = null; 
    this.modalImagenService.cerrarModal();
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
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    if(this.imagenSubir != undefined){
      this.subirArchivosService.actualizarFoto(this.imagenSubir, tipo, id || '')
        .then(img => {
            Swal.fire('Guardado', `Imagen de ${tipo} actualizada`, 'success');
            this.modalImagenService.nuevaImagen.emit(img);
            this.cerrarModal();
        }).catch( err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        });
    }
  } 
}
