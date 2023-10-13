import { Component, ViewChild, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { LoginService } from 'src/app/services/auth/login/login.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

interface TokenPayload {
  user: {
    id: number;
    email: string;
    nombres: string;
    rol: string;
  },
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('password', { static: false }) password: ElementRef;
  isShowingPassword: boolean = false;

  intentos: number = 0;
  segundosRestantes: number = 0;
  btnLogin: HTMLElement;

  constructor(private loginService: LoginService, private router: Router, private cookieService: CookieService, private elementRef: ElementRef) {
    this.btnLogin = document.getElementById('btnLogin')!;
    this.password = this.elementRef.nativeElement.querySelector('#password');
  }

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

  ngOnInit() {
    const lastAttempt = localStorage.getItem('loginLastAttempt');
    if (lastAttempt) {
      const { timestamp, remainingSeconds } = JSON.parse(lastAttempt);
      const elapsedSeconds = Math.floor((new Date().getTime() - timestamp) / 1000);
      const secondsLeft = remainingSeconds - elapsedSeconds;
      if (secondsLeft > 0) {
        this.segundosRestantes = secondsLeft;
        this.startCounter(this.segundosRestantes);
      }
    }

    const loginAttempts = localStorage.getItem('loginAttempts');
    this.intentos = loginAttempts ? parseInt(loginAttempts) : 0;
  }

  loginClick(email: string, password: string) {
    if (this.intentos >= 3) {
      this.segundosRestantes = 60;
      this.startCounter(this.segundosRestantes);
      const interval = setInterval(() => {
        if (this.segundosRestantes === 0) {
          clearInterval(interval);
          this.intentos = 0;
          localStorage.setItem('loginAttempts', this.intentos.toString());
          document.getElementById("btnLogin")!.removeAttribute("disabled");
        }
      }, 1000);
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Ha alcanzado el límite de intentos. Por favor intente de nuevo en ${this.segundosRestantes} segundos`
      });
      document.getElementById("btnLogin")!.setAttribute("disabled", "true");
    } else {
      const loginData = {
        email: email,
        password: password
      };
      this.loginService.login(loginData).subscribe(
        (res) => {
          this.cookieService.set('token', res.token);
          const tokenInfo = jwt_decode(res.token) as TokenPayload;
          if (tokenInfo.user.rol === 'admin') {
            this.router.navigate(['/admin/form-inicio']);
          } else {
            this.router.navigate(['/home']);
          }
          swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido ' + tokenInfo.user.nombres
          });
          this.resetCounter();
        },
        (err) => {
          this.intentos++;
          localStorage.setItem('loginAttempts', this.intentos.toString());
          swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos. Te quedan ' + (3 - this.intentos) + ' intentos'
          });
        }
      );
    }
  }

  startCounter(secondsR: number) {
    const interval = setInterval(() => {
      if (secondsR === 0) {
        clearInterval(interval);
        this.resetCounter();
      } else {
        secondsR--;
        this.segundosRestantes--;
      }
    }, 1000);

    this.disableLoginButton();
    this.saveLastAttempt(secondsR);
  }

  resetCounter() {
    this.intentos = 0;
    localStorage.setItem('loginAttempts', this.intentos.toString());
    this.enableLoginButton();
    this.clearLastAttempt();
  }

  disableLoginButton() {
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
      btnLogin.setAttribute('disabled', 'true');
    }
  }

  enableLoginButton() {
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
      btnLogin.removeAttribute('disabled');
    }
  }

  saveLastAttempt(remainingSeconds: number) {
    const timestamp = new Date().getTime();
    const data = {
      timestamp,
      remainingSeconds
    };
    localStorage.setItem('loginLastAttempt', JSON.stringify(data));
  }

  clearLastAttempt() {
    localStorage.removeItem('loginLastAttempt');
  }
}
