import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    password2: ['', [Validators.required]],
    terminos: [false, [Validators.required]]
  },
  {
    validators: this.passwordIguales('password', 'password2')
  });

  constructor(private fb: FormBuilder, 
              private usuarioService: UsuarioService,
              private router: Router){
  }

  crearUsuario(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      return;
    }

    //Realizar la creación del usuario
    this.usuarioService
      .crearUsuario(this.registerForm.value)
      .subscribe( resp => {
        this.router.navigateByUrl('/dashboard');
    }, (err) => {
      console.warn(err.error);
      Swal.fire('Error', err.error.msg, 'error');
    });
  }

  campoNoValido(campo: string): boolean {
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else {
      return false;
    }
  }

  contrasenasNoValidas() : boolean{
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    return (pass1 !== pass2 && this.formSubmitted);
  }

  passwordIguales(pass1Nombre: string, pass2Nombre: string ){
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Nombre);
      const pass2Control = formGroup.get(pass2Nombre);

      if(pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      }else{
        pass2Control?.setErrors({noEsIgual: true});
      }
    }
  }

  aceptaTerminos(){
    return (!this.registerForm.get('terminos')?.value && this.formSubmitted);
  }
    
}
