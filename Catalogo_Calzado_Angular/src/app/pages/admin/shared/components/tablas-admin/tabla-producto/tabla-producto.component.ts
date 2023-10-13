import { Component, OnInit, Input } from '@angular/core';
import {
  ConexProductosService,
  Producto,
} from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tabla-producto',
  templateUrl: './tabla-producto.component.html',
  styleUrls: ['./tabla-producto.component.css'],
})
export class TablaProductoComponent implements OnInit {
  @Input() dataEntranteModificar: any;
  @Input() dataEntranteInsertar: any;
  ListaProducto: Producto[] = [];
  ListaProductoOriginal: Producto[] = [];
  index: number = 0;
  index2: number = 1;
  p = 1;
  subcription: Subscription = new Subscription();

  /**
   * un constructor
   * @param {ConexProductosService} ConexProductoService - Este es el servicio que se conecta a la base
   * de datos y recupera los datos.
   * @param {ConexFavService} ConexFavService - Este es el servicio que utilizo para conectarme a la
   * base de datos.
   */
  constructor(private ConexProductoService: ConexProductosService) {}

  /**
   * La función se llama cuando se inicializa el componente. Llama a la función listarProductos(), que
   * es una función que obtiene los datos de la base de datos y los muestra en la tabla. La variable
   * subcription es una variable que se suscribe a la variable refresh$ en el servicio
   * ConexProductoService. La variable refresh$ es una variable que se usa para actualizar la tabla
   * cuando se agrega un nuevo producto.
   */
  ngOnInit(): void {
    this.listarProductos();
    this.listarProductosfiltro();
    this.subcription = this.ConexProductoService.refresh$.subscribe(() => {
      this.listarProductosfiltro();
      this.listarProductos();
    });
  }

  /**
   * Cuando se destruya el componente, cancele la suscripción del observable para evitar pérdidas de
   * memoria.
   */
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
    console.log('Observable cerrado');
  }

  /**
   * Es una función que obtiene una lista de productos de una base de datos y los muestra en una tabla.
   */
  listarProductos() {
    console.log('----Listar PRODUCTOS----');
    this.subcription.add(
      this.ConexProductoService.getProducto().subscribe(
        (res) => {
          this.ListaProducto = <any>res;
        },
        (err) => console.log(err)
      )
    );
  }
  listarProductosfiltro() {
    console.log('----Listar PRODUCTOS----');
    this.subcription.add(
      this.ConexProductoService.getProducto().subscribe(
        (res) => {
          this.ListaProductoOriginal = <any>res;
        },
        (err) => console.log(err)
      )
    );
  }

  /**
   * Elimina un producto de la base de datos, pero antes elimina el producto de la tabla de favoritos.
   * @param {number} id - número
   */
  eliminar(id: number) {
    swal
      .fire({
        title: 'Seguro que quieres borrarlo?',
        text: 'Seguro que quieres hacer esto!',
        icon: 'warning',
        color: 'black',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borralo!',
      })
      .then((result) => {
        if (result.value) {
          this.ConexProductoService.deletProducto(id).subscribe(
            (res) => {
              swal.fire(
                'Eliminado!',
                'Se ha eliminado de tu lista de Producto.',
                'success'
              );
              this.listarProductos();
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

  /**
   * Toma una identificación, la asigna a una variable, la registra en la consola y luego la emite.
   * @param {number} id - número
   */
  getIDProducto(id: number) {
    this.dataEntranteModificar = id;

    this.ConexProductoService.disparadorDetalleProducto.emit(
      this.dataEntranteModificar
    );
  }

  /**
   * Toma un parámetro id2, establece la propiedad de índice en el valor de id2, establece la propiedad
   * dataEntranteInsertar en el valor de id2, registra el valor de id2 y emite el valor de
   * dataEntranteInsertar.
   * @param {number} id2 - número
   */
  getIndex(id2: number) {
    this.index = id2;
    this.dataEntranteInsertar = id2;

    this.ConexProductoService.disparadorDetalleProducto.emit(
      this.dataEntranteInsertar
    );
  }

  /**
   * Recorre la matriz y luego establece la variable index2 en el último elemento de la matriz + 1.
   */
  enviar() {
    for (let i = 0; i < this.ListaProducto.length; i++) {
      this.index2 = this.ListaProducto[i].pk_id_producto + 1;
    }

    this.getIndex(this.index2);
  }
  /**
   * Si el término de búsqueda no está vacío, filtre la lista de productos para incluir solo aquellos
   * cuyo nombre incluye el término de búsqueda. De lo contrario, mostrar la lista completa de productos.
   * @param {string} busca - cadena
   */
  filtrar(busca: string) {
    if (busca !== '') {
      const valorBusqueda = busca.toLowerCase(); // Convertir a minúsculas
      this.ListaProducto = this.ListaProductoOriginal.filter(
        (item) => item.nombre_producto.toLowerCase().includes(valorBusqueda)
      );
    } else {
      this.listarProductos();
    }
  }
}
