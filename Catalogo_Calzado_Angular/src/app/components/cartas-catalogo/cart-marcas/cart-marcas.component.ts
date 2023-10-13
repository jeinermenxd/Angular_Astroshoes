import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ConexProductosService,
  Producto,
} from 'src/app/services/conexiones/conex-productos/conex-productos.service';

@Component({
  selector: 'app-cart-marcas',
  templateUrl: './cart-marcas.component.html',
  styleUrls: ['./cart-marcas.component.css'],
})
export class CartMarcasComponent implements OnInit {
  p = 1;
  info_modal: boolean = false;
  ListaProducto: any;
  subscription1: Subscription | undefined;
  @Input() dataEntranteDetalle: any;

  disparador: any;

  /**
   * La función constructora es una función especial que se llama cuando se crea una nueva instancia de
   * la clase.
   * @param {ConexProductosService} conexionProducto - Este es el nombre del parámetro.
   */
  constructor(private conexionProducto: ConexProductosService) {
    this.subscription1 = this.conexionProducto.datosm$.subscribe((datos) => {
      if (datos != null) {
        this.ListaProducto = datos;
      } else {
        this.ListaProducto = null;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscription1!.unsubscribe();
  }

  getCerrar() {
    this.dataEntranteDetalle = null;
  }

  /**
   * La función `getIDProducto` establece el valor de `dataEntranteDetalle` y emite un evento con ese
   * valor.
   * @param {number} nombre - El parámetro "nombre" es de tipo número.
   */
  getIDProducto(nombre: number) {
    this.dataEntranteDetalle = nombre;
    this.conexionProducto.disparadorDetalleProducto.emit(
      this.dataEntranteDetalle
    );
  }

  /**
   * La función "mensajeNoresultado" verifica si la "ListaProducto" está nula o vacía y devuelve un
   * valor booleano indicando si no hay resultado.
   * @returns un valor booleano.
   */
  mensajeNoresultado() {
    let bool = false;
    if (this.ListaProducto == null) {
      bool = true;
    } else if (this.ListaProducto.length == 0) {
      bool = true;
    }
    return bool;
  }

  /**
   * Establece el valor de la variable info_modal en verdadero.
   */
  abrirmodal() {
    this.info_modal = true;
  }
}
