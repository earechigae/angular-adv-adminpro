import { Component, OnInit} from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit{

  public hospitales: Hospital[] = [];
  //public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription | undefined;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
      ).subscribe( img => {
        console.log('Evento capturado con imagen ', img);
        this.cargarHospitales();
      })
    }

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
        this.hospitales = hospitales;
        console.log('Hospitales cargados');
        this.cargando = false;
      });
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id || '', hospital.nombre)
      .subscribe( () => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalService.borrarHospital(hospital._id ?? '')
      .subscribe( () => {
        this.cargarHospitales();
        Swal.fire('Hopistal eliminado', hospital.nombre, 'success');
      });
  }

  async abrirSweetAlert(){
    Swal.fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
      inputValidator: (value) => {
        const mensaje = value ? `Hospital creado: ${value}` : 'El nombre del hospital es necesario!';
        return !value ? mensaje : null;
      }
    }).then((value) => {
      if(value.isConfirmed){
        this.hospitalService.crearHospital(value.value)
          .subscribe( () => this.cargarHospitales());
      }
    });
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

  buscar (termino: string){
    if(termino.length === 0){
      //this.hospitales = this.hospitalesTemp;
      this.cargarHospitales();
      return;
    }

    this.busquedasService.buscar('hospitales', termino)
      .subscribe((hospitales: Usuario[] | Hospital[] | Medico[]) => { 
        this.hospitales = hospitales as Hospital[]; 
      })
  }

}


