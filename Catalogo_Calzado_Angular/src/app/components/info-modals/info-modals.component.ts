import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConexFavService } from 'src/app/services/conexiones/conex-fav/conex-fav.service';
import { ConexCarritoService } from 'src/app/services/conexiones/conex-carrito/conex-carrito.service';
import { ConexProductosService } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

interface TokenPayload {
  user: {
    id: number;
    email: string;
    nombres: string;
    rol: string;
  };
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-info-modals',
  templateUrl: './info-modals.component.html',
  styleUrls: ['./info-modals.component.css'],
})
export class InfoModalsComponent implements OnInit {
  [x: string]: any;

  cargar: any = [];
  subcription: Subscription = new Subscription();
  isLoggedIn: boolean;
  nombreUsuario: string | undefined;
  public userRole: boolean | undefined;
  public admin: boolean | undefined;
  @ViewChild('myModal') myModal: any;

  /**
   * Estoy tratando de obtener los datos del servicio y luego enviarlos al componente.
   * @param {ConexProductosService} conexionProducto - ConexProductosServicio
   * @param {ConexFavService} conexionFavoritos - ConexFavServicio
   */
  constructor(
    private conexionProducto: ConexProductosService,
    private router: Router,
    private conexionCarrito: ConexCarritoService,
    private conexionFavoritos: ConexFavService,
    private cookieService: CookieService
  ) {
    this.subcription.add(
      this.conexionProducto.disparadorDetalleProducto.subscribe((data) => {
        if (data == null) {
          this.cargar = null;
          console.log(this.cargar);
        } else {
          this.conexionProducto.getUnProducto(data).subscribe(
            (res) => {
              console.log(res);
              this.cargar = res;
            },
            (err) => console.log(this.cargar)
          );
        }
      })
    );

    const token = cookieService.get('token');
    if (token) {
      const decoded = jwt_decode(token) as TokenPayload;
      this.nombreUsuario = 'Bienvenido ' + decoded.user.nombres;
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

  ngOnInit(): void {}

  /**
   * Cuando se destruya el componente, anule la suscripción del observable.
   */
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  /**
   * Estoy tratando de obtener el correo electrónico del token y, si lo obtengo, lo usaré para llamar a
   * un servicio que insertará la identificación del producto y el correo electrónico en una tabla.
   * </código>
   */

  addToFavorites(producid: number) {
    // Obtener el email del token
    let email: string | null = null;
    // Lógica para obtener el email del token
    email = this.conexionFavoritos.getEmailFromToken();
    if (email !== null) {
      // Usar el email para hacer la llamada al servicio
      // Llamar a la función del servicio que inserta en la tabla favoritos
      this.conexionFavoritos.addFavorito(producid, email).subscribe(
        (res) => {
          console.log(res);
          swal.fire({
            title: 'Agregado!',
            text: 'Producto agregado a la lista de favoritos',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        (err) => {
          console.log(err);
          swal.fire({
            title: 'Error!',
            text: 'No se puede agregar un producto que ya este en la lista de favoritos.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      swal
        .fire({
          title: 'Error!',
          text: 'Inicie Sesión antes de agregar a la lista de favoritos',
          icon: 'error',
          showCancelButton: true,
          cancelButtonColor: '#47A938',
          cancelButtonText: 'OK',
          confirmButtonText: 'Iniciar Sesión',
          confirmButtonColor: '#64A0DF',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.myModal.nativeElement.click();
            this.router.navigate(['/login']);
          }
        });
    }
  }

  /**
   * La función `addToCarrito` agrega un producto al carrito de compras, verificando si el usuario ha
   * iniciado sesión y mostrando los mensajes apropiados.
   */
  addToCarrito(producid: number) {
    // Obtener el email del token
    let email: string | null = null;
    // Lógica para obtener el email del token
    email = this.conexionCarrito.getEmailFromToken();
    if (email !== null) {
      // Usar el email para hacer la llamada al servicio
      // Llamar a la función del servicio que inserta en la tabla favoritos
      this.conexionCarrito.addCarrito(producid, email).subscribe(
        (res) => {
          console.log(res);
          swal.fire({
            title: 'Agregado!',
            text: 'Producto agregado al carrito',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        (err) => {
          console.log(err);
          swal.fire({
            title: 'Error!',
            text: 'No se puede agregar un producto que ya este en el carrito.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      swal
        .fire({
          title: 'Error!',
          text: 'Inicie Sesión antes de agregar al carrito',
          icon: 'error',
          showCancelButton: true,
          cancelButtonColor: '#47A938',
          cancelButtonText: 'OK',
          confirmButtonText: 'Iniciar Sesión',
          confirmButtonColor: '#64A0DF',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.myModal.nativeElement.click();
            this.router.navigate(['/login']);
          }
        });
    }
  }
}
