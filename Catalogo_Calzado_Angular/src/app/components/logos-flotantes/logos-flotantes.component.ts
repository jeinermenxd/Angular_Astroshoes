import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { ConexUsuariosService } from 'src/app/services/conexiones/conex-usuarios/conex-usuarios.service';


@Component({
  selector: 'app-logos-flotantes',
  templateUrl: './logos-flotantes.component.html',
  styleUrls: ['./logos-flotantes.component.css']
})
export class LogosFlotantesComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(private cookieService: CookieService, private ConexUsuarioService:ConexUsuariosService) { 

    this.ConexUsuarioService.datos$.subscribe(datos => {
      this.isLoggedIn = datos;    
    });
  }


  ngOnInit(): void {
  }
}

