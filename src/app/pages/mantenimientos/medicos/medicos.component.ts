import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from 'src/app/services/medico.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy{
  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription | undefined;


  constructor(private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
      ).subscribe( img => {
        this.cargarMedicos();
      })
    }

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  cargarMedicos(){
    this.medicoService.cargarMedicos()
      .subscribe( (medicos: Medico[]) => {
        this.medicos = medicos;
        console.log('Medicos cargados');
        this.cargando = false;
      });
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }
  
  buscar (termino: string){
    if(termino.length === 0){
      //this.hospitales = this.hospitalesTemp;
      this.cargarMedicos();
      return;
    }

    this.busquedasService.buscar('medicos', termino)
      .subscribe((datos: Usuario[] | Hospital[] | Medico[]) => { 
      this.medicos = datos as Medico[]; 
    })
  }


  borrarMedico(medico: Medico){ 
    Swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de borrar a " + medico.nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id || '')
          .subscribe( () => {
            this.cargarMedicos();
            Swal.fire('Borrado', medico.nombre + ' ha sido eliminado', 'success');
          });
      }
    })
  }
}
