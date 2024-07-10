import { Component } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

// Así se declara una funcion global hecha en Javascript
declare function customInitFunctions(): void;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent {


  constructor(private settingsService: SettingsService,
              private sidebarService: SidebarService
  ){

  }

  ngOnInit(): void {
    // Así se invoca una funcion global hecha en Javascript
    customInitFunctions();
    this.sidebarService.cargarMenu();
    console.log(this.sidebarService.menu);
  }
}
