import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ConexProductosService,
  Producto,
} from 'src/app/services/conexiones/conex-productos/conex-productos.service';

@Component({
  selector: 'app-card-buscar',
  templateUrl: './card-buscar.component.html',
  styleUrls: ['./card-buscar.component.css'],
})
export class CardBuscarComponent implements OnInit {
  p = 1;
  info_modal: boolean = false;
  ListaProducto: any;
  disparador: any;
  subscription1: Subscription | undefined;
  @Input() dataEntranteDetalle: any;

  /**
   * La función constructora es una función especial que se llama cuando se crea una nueva instancia de
   * la clase.
   * @param {ConexProductosService} conexionProducto - Este es el nombre del parámetro.
   */
  constructor(private conexionProducto: ConexProductosService) {
    this.subscription1 = this.conexionProducto.datos$.subscribe((datos) => {
      if (datos.datos1 != null) {
        this.ListaProducto = datos.datos1;
      } else {
        this.ListaProducto = [];
      }
      this.disparador = datos.datos2;
    });
  }

  ngOnInit() {}

/**
 * La función ngOnDestroy se utiliza para cancelar la suscripción.
 */
  ngOnDestroy(): void {
    this.subscription1!.unsubscribe();
  }

  getCerrar() {
    this.dataEntranteDetalle = null;
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
