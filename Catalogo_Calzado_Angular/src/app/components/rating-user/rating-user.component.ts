import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConexResenasService, Resenas } from 'src/app/services/conexiones/conex-resenas/conex-resenas.service';
import swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';


interface TokenPayload {
  user: {
    id: number;
    email: string;
    nombres: string;
    apellidos: string;
    rol: string;
  },
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-rating-user',
  templateUrl: './rating-user.component.html',
  styleUrls: ['./rating-user.component.css']
})
export class RatingUserComponent implements OnInit {


  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  mostrarToast = false;
  isLoggedIn: boolean;
  nombreUsuario: string | undefined;
  public userRole: boolean | undefined;
  public admin: boolean | undefined;
  ListaResenas:Resenas[]=[];
  index:number =1;
  resenas:Resenas={
    id_resenas:0,
    fk_id_usuario:0,
    nombre:'',
    estrellas:0,
    comentario:''
}

constructor(private cenexionresenas:ConexResenasService, private cookieService: CookieService) {

 const token = cookieService.get('token');
 if (token) {
   const decoded = jwt_decode(token) as TokenPayload;
   this.resenas.nombre =  decoded.user.nombres;
   this.resenas.fk_id_usuario =  decoded.user.id;
   this.isLoggedIn = true;
   if (decoded.user.rol === 'user') {
     this.userRole = true;
   }

 } else {
   this.isLoggedIn = true;
   this.userRole = true;
   this.nombreUsuario = '';
 }
}

  ngOnInit(): void {
  }

  countStar(star) {
    this.selectedValue = star;
    this.resenas.estrellas = star
    console.log('Value of star', star);
  }


  agregarResenas(){
    try {
      console.log(this.resenas)
      if(this.resenas.fk_id_usuario !=0  && this.resenas.estrellas  !=0 ){
        this.cenexionresenas.addResenas(this.resenas).subscribe();
        console.log(this.resenas)
        swal.fire({
          icon: 'success',
          title: 'Muchas gracias por tu reseña!! 😁',
          text: 'Sus comentarios nos permiten seguir mejorando nuestro sitio web'
        });
      }
    } catch (error) {
     console.log("Error!")
    }
  }

  Limpiar(){
    this.resenas.id_resenas =0;
    this.resenas.comentario='';
    this.selectedValue=0;
  }
}
