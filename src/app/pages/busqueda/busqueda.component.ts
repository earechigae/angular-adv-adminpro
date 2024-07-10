import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from './../../models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];
  public usuarios: Usuario[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private busquedaService: BusquedasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({termino}) => {
      this.busquedaGlobal(termino);
    });
  }

  busquedaGlobal(termino: string){
    this.busquedaService.busquedaGlobal(termino)
      .subscribe( (resp: any) => {
        this.medicos = resp.medicos;
        this.hospitales = resp.hospitales;
        this.usuarios = resp.usuarios;
      });
  }

  abrirMedico(medico: Medico){
    console.log(medico);
  }

}
