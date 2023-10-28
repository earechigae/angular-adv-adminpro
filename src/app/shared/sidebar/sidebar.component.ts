import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit{
  public menuItems: any[];
  public usuario: Usuario | undefined;

  constructor(private sideBarService: SidebarService,
              private usuarioService: UsuarioService){
    this.menuItems = sideBarService.menu;
    this.usuario = usuarioService.usuario
  }

  ngOnInit(): void {
      
  }

  logout(){
    this.usuarioService.logout();
  }

}
