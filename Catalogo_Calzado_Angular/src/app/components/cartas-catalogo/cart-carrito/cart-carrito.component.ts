import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {
  Carrito,
  ConexCarritoService,
} from 'src/app/services/conexiones/conex-carrito/conex-carrito.service';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ConexComprobantesService } from 'src/app/services/conexiones/conex-comprobantes/conex-comprobantes.service';
import {
  ConexProductosService,
  Producto,
} from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-carrito',
  templateUrl: './cart-carrito.component.html',
  styleUrls: ['./cart-carrito.component.css'],
})
export class CartCarritoComponent implements OnInit {
  @Input() dataEntranteDetalle: any;
  @ViewChild('miModal') miModal: ElementRef;
  p = 1;
  allcarrito: any = [];
  info_modal: boolean = false;
  subcription: Subscription = new Subscription();
  ListaProducto: Producto[] = [];
  descuento: string = '';
 
  constructor(
    private conexionCarrito: ConexCarritoService,
    private conexionProducto: ConexProductosService,
    private conexionComprobante: ConexComprobantesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) 
  {}

  ngOnInit(): void {
    this.carritos();
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
    console.log('Observable cerrado');
  }

  /**
   * La función `getIDProducto` toma un número como entrada, lo asigna a `this.dataEntranteDetalle` y
   * emite un evento con el valor de `this.dataEntranteDetalle` usando
   * `this.conexionProducto.disparadorDetalleProducto.emit()`.
   * @param {number} nombre - El parámetro "nombre" es de tipo número.
   */
  getIDProducto(nombre: number) {
    this.dataEntranteDetalle = nombre;
    console.log(this.dataEntranteDetalle);
    this.conexionProducto.disparadorDetalleProducto.emit(
      this.dataEntranteDetalle
    );
  }

  /**
   * La función "carritos" recupera una lista de carritos de un servidor y asigna los datos de
   * respuesta a la variable "allcarrito".
   */
  carritos(): void {
    this.subcription.add(
      this.conexionCarrito.listarCarrito().subscribe(
        (response: any) => {
          if (response.success) {
            this.allcarrito = response.data;
          } else {
            swal.fire(
              'Error!',
              'Hubo un problema al obtener los favoritos!',
              'error'
            );
          }
        },
        (error) => {}
      )
    );
  }

  abrirmodal() {
    this.info_modal = true;
  }

/**
 * La función "decrementarCantidad" disminuye en 1 la cantidad de un artículo en el carrito de compra,
 * si la cantidad es mayor que 1.
 * @param {Carrito} carrito - El parámetro "carrito" es de tipo "Carrito", que representa un objeto de
 * carrito de compras.
 */
  decrementarCantidad(carrito: Carrito) {
    if (carrito.cantidad > 1) {
      carrito.cantidad--;
      this.actualizarCantidadCarrito(carrito);
    }
  }

/**
 * La función incrementa la cantidad de un artículo en un carrito de compras y actualiza la cantidad
 * total del carrito.
 * @param {Carrito} carrito - El parámetro "carrito" es de tipo "Carrito", que representa un objeto de
 * carrito de compras.
 */
  incrementarCantidad(carrito: Carrito) {
    carrito.cantidad++;
    this.actualizarCantidadCarrito(carrito);
  }

  /**
   * La función SubTotal calcula el costo total de todos los artículos del carrito de compras.
   * @returns el coste total de todos los artículos del carrito de compras.
   */
  SubTotal(): number {
    let precio = 0;
    for (const carrito of this.allcarrito) {
      precio += carrito.producto.costo * carrito.cantidad;
    }
    return precio;
  }

  /**
   * La función calcula el coste total de los artículos de un carrito de compras, incluidos descuentos
   * e impuestos.
   * @returns La función `calcularTotal()` devuelve un número, específicamente el costo total de los
   * productos en el carrito de compras después de aplicar los descuentos y agregar impuestos.
   */
  calcularTotal(): number {
    let total = 0;
    let descu = 0;
    for (const carrito of this.allcarrito) {
      total += carrito.producto.costo * carrito.cantidad;
      descu +=
        (carrito.producto.costo *
          carrito.cantidad *
          parseFloat(carrito.producto.oferta)) /
        100;
    }

    try {
      this.descuento = descu.toString();
      this.cdr.detectChanges();
    } catch (error) {
      console.log();
    }
    total = total - descu;
    total = total + total * 0.12;
    // Redondear el total a 3 decimales
    const totalRedondeado = parseFloat(total.toFixed(3));
    return totalRedondeado;
  }

/**
 * La función "Actualizaprecio" calcula el precio total de un producto en un carrito de compra en
 * función de su cantidad y coste.
 * @param {number} int - El parámetro "int" es un valor entero que representa el ID de un producto.
 * @returns el precio total de un producto en el carrito de compras.
 */
  Actualizaprecio(int: number) {
    let precio = 0;
    for (let i = 0; i < this.allcarrito.length; i++) {
      if (int == this.allcarrito[i].fk_id_producto) {
        //this.descuento += parseInt(this.allcarrito[i].producto.oferta)
        precio +=
          this.allcarrito[i].producto.costo * this.allcarrito[i].cantidad;
      }
    }
    return precio;
  }

  /**
   * La función `realizarPago()` realiza diversas validaciones sobre la información de la tarjeta de
   * crédito ingresada por el usuario y simula un pago exitoso, creando un recibo de compra con los
   * detalles de la compra.
   * @returns La función no devuelve nada explícitamente.
   */
  realizarPago() {
    // Verificar si el carrito está vacío
    if (this.allcarrito.length === 0) {
      swal.fire(
        'Error!',
        'El carrito está vacío. No puedes realizar la compra.',
        'error'
      );
      return;
    }

    const tarjetaNumero = document.getElementById(
      'tarjetaNumero'
    ) as HTMLInputElement;
    const tarjetaExpiracion = document.getElementById(
      'tarjetaExpiracion'
    ) as HTMLInputElement;
    const tarjetaCVV = document.getElementById(
      'tarjetaCVV'
    ) as HTMLInputElement;
    // Verificación de la longitud del número de tarjeta
    const tarjetaNumeroLength = tarjetaNumero.value.replace(/\s/g, '').length;
    if (tarjetaNumeroLength < 16 || tarjetaNumeroLength > 19) {
      swal.fire('Error!', 'El número de tarjeta no es válido!', 'error');
      return;
    }

    // Verificación del formato de la fecha de expiración
    const expiracionRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiracionRegex.test(tarjetaExpiracion.value)) {
      swal.fire(
        'Error!',
        'El formato de la fecha de expiración no es válido (MM/AA)',
        'error'
      );
      return;
    }

    // Verificación de la longitud del CVV
    const cvvLength = tarjetaCVV.value.length;
    if (cvvLength !== 3 && cvvLength !== 4) {
      swal.fire('Error!', 'El CVV no es válido', 'error');
      return;
    }

    // Simulación de pago exitoso
    swal
      .fire({
        title: '¡Pago realizado con éxito!',
        text: '¡Pago realizado con éxito!',
        icon: 'success',
        confirmButtonText: 'OK',
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Crear el comprobante de venta con detalle
          const total = this.calcularTotal();
          const carrito = this.allcarrito;
          this.conexionComprobante
            .crearComprobanteVentaConDetalle(total, carrito)
            .subscribe(
              (response: any) => {
                swal.fire({
                  title: 'Comprobante creado',
                  text: 'El comprobante de venta se ha creado exitosamente',
                  icon: 'success',
                  confirmButtonText: 'OK',
                });
                // Lógica adicional después de crear el comprobante
                console.log('Comprobante creado:', response.id_comprobante);
              },
              (error: any) => {
                swal.fire(
                  'Error!',
                  'Hubo un problema al crear el comprobante de venta',
                  'error'
                );
              }
            );
        }
      });
    this.router.navigate(['/comprobantes']);
  }

  /**
   * La función "actualizarCantidadCarrito" actualiza la cantidad de un artículo en el carrito de
   * compras y maneja casos de éxito y error.
   * @param {Carrito} carrito - El parámetro "carrito" es un objeto de tipo "Carrito" que representa un
   * carrito de compras. Tiene dos propiedades: "id_carrito" que es el identificador del carrito y
   * "cantidad" que representa la cantidad de artículos en el carrito.
   */
  private actualizarCantidadCarrito(carrito: Carrito) {
    this.conexionCarrito
      .updateCarritoCantidad(carrito.id_carrito, carrito.cantidad)
      .subscribe(
        () => {
          // Manejo de éxito en la actualización
        },
        (error) => {
          swal.fire(
            'Error!',
            'Hubo un problema al cambiar la cantidad!',
            'error'
          );
        }
      );
  }

  deleteCarrito(id: number) {
    swal
      .fire({
        title: 'Seguro que quieres borrarlo?',
        text: 'Seguro que quieres hacer esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borralo!',
      })
      .then((result) => {
        if (result.value) {
          this.conexionCarrito.deleteCarrito(id).subscribe(
            (res) => {
              swal.fire(
                'Eliminado!',
                'Se ha eliminado de tu carrito.',
                'success'
              );
              this.carritos();
            },
            (err) => {
              swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salio mal al intetar eliminarlo!',
              });
            }
          );
        }
      });
  }
}
