import { Component, OnInit} from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from 'src/app/services/medico.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from 'src/app/services/hospital.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit{

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public medicoSeleccionado: Medico | undefined;
  public hospitalSeleccionado: Hospital | undefined;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute
  ) {
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ id }) =>  this.cargarMedico(id) );
    this.cargarHospitales();
    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(hospital => hospital._id === hospitalId);
    });
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe((hospitalesCargados: Hospital[]) => {
      this.hospitales = hospitalesCargados;
    });
  }

  guardarMedico(){
    const { nombre } = this.medicoForm.value;

    if(this.medicoSeleccionado) {
      //Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
       .subscribe( (resp:any) => {
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`,'success');
          //this.router.navigateByUrl(`/dashboard/medico/${ this.medicoSeleccionado?._id }`);
        })
    }else{
      //Crear
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe( (resp:any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`);
        })
    }
  }

  cargarMedico(id: string) {
    if(id === 'nuevo') return;

    this.medicoService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe((medicoCargado: Medico) => {
        if(!medicoCargado || Object.keys(medicoCargado).length === 0){
          this.router.navigateByUrl(`/dashboard/medicos`);
          return;
        }
        this.medicoSeleccionado = medicoCargado;
        this.medicoForm.setValue({
          nombre: medicoCargado.nombre,
          hospital: medicoCargado.hospital?._id
        });
      });
  }

}
