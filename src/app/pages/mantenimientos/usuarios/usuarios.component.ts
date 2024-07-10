import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Hospital } from 'src/app/models/hospital.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios: number = 0;
  public usuarios: Usuario [] = [];
  public usuariosTemp: Usuario [] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription | undefined;

  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) {

  }
  
  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
      ).subscribe( img => {
        this.cargarUsuarios();
      })
    }

    ngOnDestroy(): void {
      this.imgSubs?.unsubscribe();
    }
    
  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe( ({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number){
    this.desde += valor;

    if(this.desde < 0 ){
      this.desde = 0;
    }else if(this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar (termino: string){
    if(termino.length === 0){
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedasService.buscar('usuarios', termino)
      .subscribe((usuarios: Usuario[] | Hospital[] | Medico[]) => { 
        this.usuarios = usuarios as Usuario[]; 
      })
  }

  eliminarUsuario(usuario: Usuario){
    if(usuario.uid === this.usuarioService.uid){
      Swal.fire('Error', 'No se puede borrar a si mismo');
      return;
    }

    Swal.fire({
      title: "¿Está seguro de borrar el usuario?",
      text: "Esta a punto de borrar a " + usuario.nombre,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ¡borrarlo!"
    }).then((result) => {
      console.log(result);
      if (result.value) {

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe( resp => {
            Swal.fire({
                title: "¡Borrado!",
                icon: "success",
                text: `El usuario ${usuario.nombre} ha sido borrado correctamente`,
              }); 
            this.cargarUsuarios();
          })
      }
    });
  }


  cambiarRol(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
      .subscribe( resp => {
        console.log(usuario);
      })
  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
