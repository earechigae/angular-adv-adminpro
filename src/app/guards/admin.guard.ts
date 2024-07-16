import { UsuarioService } from 'src/app/services/usuario.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService,
              private router: Router)
  {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean
  {

    if(this.usuarioService.role === 'ADMIN_ROLE'){
      return true;
    }else{
      this.router.navigateByUrl('/dashboard');
      return false;
    }
  }
}
