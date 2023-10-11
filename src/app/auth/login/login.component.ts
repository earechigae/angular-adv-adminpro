import { Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn: ElementRef | undefined;

  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService){

  }

  ngAfterViewInit(): void {
    this.usuarioService.google.accounts.id.renderButton(
      //document.getElementById("buttonDiv"),
      this.googleBtn?.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false, [Validators.required]]
  });


  login() {
    this.usuarioService.login(this.loginForm.value)
    .subscribe( resp => {
      if(this.loginForm.get('remember')?.value){
        let email: any = (this.loginForm.get('email')?.value === null)? '': this.loginForm.get('email')?.value;
        localStorage.setItem('email', email);
      }else{
        localStorage.removeItem('email');
      }
      
      this.router.navigateByUrl('/dashboard');
      //console.log(resp)
    }, (err) => {
      console.log(err);
      Swal.fire('Error', err.error.msg, 'error');
    });
  }

}
