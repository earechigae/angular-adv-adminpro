import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit{
  menuItems: any[];

  constructor(private sideBarService: SidebarService,
              private usuarioService: UsuarioService){
    this.menuItems = sideBarService.menu;
    //console.log(this.menuItems);
  }

  ngOnInit(): void {
      
  }

  logout(){
    this.usuarioService.logout();
  }

}
