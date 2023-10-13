import { Component, OnInit, ViewChild, } from '@angular/core';
import { ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { ConexUsuariosService, Usuario  } from 'src/app/services/conexiones/conex-usuarios/conex-usuarios.service';

@Component({
  selector: 'app-editarusuario',
  templateUrl: './editarusuario.component.html',
  styleUrls: ['./editarusuario.component.css']
})
export class EditarusuarioComponent implements OnInit {

  cargar: any = [];
  id_entrada:number =0

  /* Este es un decorador que nos permite acceder al elemento DOM con la contraseña de identificación. */
  @ViewChild('password', { static: false }) password: ElementRef;
  isShowingPassword: boolean = false;

  /**
   * La función constructora es una función especial que se llama cuando se crea un objeto a partir de
   * una clase.
   * @param {RegisterService} registerService - Este es el servicio que creamos anteriormente.
   * @param {Router} router - Enrutador: este es el servicio de enrutador angular.
   * @param {ElementRef} elementRef - ElementRef: esta es una referencia al elemento DOM al que se
   * adjunta la directiva.
   */
  constructor( private router: Router, private elementRef: ElementRef,private ConexUsuarioService:ConexUsuariosService,private cookieService: CookieService) {
    this.password = this.elementRef.nativeElement.querySelector('#password');

    this.ConexUsuarioService.datos$.subscribe(datos => {
      if (datos) {
        console.log('No vacia');
        let myarrys = []
        myarrys.push(datos)
        this.cargar = [datos];
        console.log(this.cargar);
      } else {
        console.log('vacia del card');
      }
    });
  }





  ngOnInit(): void {

  }

/**
 * Devuelve verdadero si el correo electrónico es válido y falso si no lo es.
 * @param {string} email - La dirección de correo electrónico a validar.
 * @returns Un valor booleano.
 */
  validateEmail(email: string): boolean {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  /**
 * Verifica si la contraseña cumple con los requisitos de al menos 5 caracteres y al menos dos caracteres especiales.
 * @param {string} password - La contraseña a verificar.
 * @returns Un valor booleano que indica si la contraseña cumple con los requisitos.
 */
validatePassword(password: string): boolean {
  const specialChars = /[!@#$%^&*()_+\.,;:\-]/g;
  const hasEnoughSpecialChars = (password.match(specialChars) || []).length >= 2;
  const hasEnoughLength = password.length >= 5;
  return hasEnoughLength && hasEnoughSpecialChars;
}

  /**
   * Si el tipo de entrada es contraseña, cámbielo a texto y establezca isShowingPassword en verdadero.
   * De lo contrario, cámbielo a contraseña y establezca isShowingPassword en falso
   */
  togglePassword() {
    const inputType = this.password.nativeElement.type;
    if (inputType === 'password') {
      this.password.nativeElement.type = 'text';
      this.isShowingPassword = true;
    } else {
      this.password.nativeElement.type = 'password';
      this.isShowingPassword = false;
    }
  }

  /** Método que permite desloguearse de la cuenta, y envia un mensaje al usuario de ´Cierre de sesion exitoso´
 * La función de cierre de sesión elimina el token de la cookie, establece el indicador isLoggedIn en
 * falso, muestra un mensaje de éxito usando swal.fire y redirige al usuario a la página de inicio
 * mientras se desplaza hacia la parte superior.
 */
  logout() {
    this.cookieService.delete('token');

    Swal.fire({
      title: '¡Cierre de sesión exitoso!',
      text: 'Esperamos verte pronto.',
      icon: 'success'
    });
    this.redirectAndScrollToTop("/home");
  }

   //**** Método de redireccionamiento, donde le pasamos un parametro de tipo string la ruta inicial a donde queremos llegar****/
  //** Funcional para direccionamiento entre componentes de las pages **//
  redirectAndScrollToTop(route: string) {
    this.router.navigate([route]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  /**
   * La función recibe los datos del formulario, los valida y los envía al backend
   * @param {string} nombres - cadena, apellidos: cadena, correo electrónico: cadena, contraseña:
   * cadena
   * @param {string} apellidos - cadena,
   * @param {string} email - La dirección de correo electrónico del usuario.
   * @param {string} password - La contraseña para el usuario.
   */


  modificar(id: number, nombres: string, apellidos: string, email: string, password: string, created_at: string, updated_at: string, rol: string, status: string) {


    // Extrae text//
    this.id_entrada = id;

    console.log(this.id_entrada)


    for(let i=0;i <this.cargar.length;i++){
      this.cargar[i].id_usuario = id;
      this.cargar[i].nombres = nombres;
      this.cargar[i].apellidos = apellidos;
      this.cargar[i].email = email;
      this.cargar[i].password = password;
      this.cargar[i].created_at = created_at;
      this.cargar[i].updated_at = updated_at;
      this.cargar[i].rol = rol;
      this.cargar[i].status = status;
    }

    console.log(this.cargar)

    Swal.fire({
        title: 'Seguro que quieres modificarlo?',
        text: "Para ver los datos cierre sesión",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, modificarlo!'
      }).then((result) => {
        if (result.value) {
          try {
            if(this.cargar.id_usuario !=0 && this.cargar.nombres !='' && this.cargar.apellidos!=''
            && this.cargar.email!=''&& this.cargar.password!=''&& this.cargar.created_at!=''
            && this.cargar.updated_at !='' && this.cargar.rol !=''&& this.cargar.status !=''){
              if (!this.validateEmail(email)) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Por favor ingrese un correo válido'
                });
              } else if(!this.validatePassword(password)){
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'La contraseña debe tener al menos 5 caracteres y contener al menos dos caracteres especiales.'
                });
              }
              else{
                this.ConexUsuarioService.editUsuario(this.id_entrada,this.cargar).subscribe(
                  res=>{
                    console.log(res);
                    Swal.fire({
                      icon: 'success',
                      title: 'El Usuario se modificó Exitosamente',
                      text: 'Continuar'
                    });
                    this.logout();
                   // this.router.navigate(['/home']);
                  },
                  err => {
                    console.log(err);
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Error al momento de modificar'
                    })
                  }
                )
              }
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por Favor!! Ingrese todos los parámetros'
              });
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ingrese todos los parametros Por favor'
            });
          }
        }
      })
    }
  }
