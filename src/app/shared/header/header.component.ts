import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
  public usuario: Usuario | undefined;

  constructor(private usuarioService: UsuarioService,
              private router: Router
  ){
    this.usuario = usuarioService.usuario;
  }

  logout(){
    this.usuarioService.logout();
  }

  buscar(termino: string){

    console.log(termino.length);
    if(termino.length === 0){
      return;
    }else{
      this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);
    }
  }
}
