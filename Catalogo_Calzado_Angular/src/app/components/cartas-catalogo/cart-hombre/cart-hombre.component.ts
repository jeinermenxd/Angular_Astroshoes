import { Component, Input, OnInit } from '@angular/core';
import { ConexProductosService, Producto } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { ConexMarcaService, Marca } from 'src/app/services/conexiones/conex-marca/conex-marca.service';
import { Subscription } from 'rxjs';
import { ConexFiltroService, Filtro } from 'src/app/services/conexiones/conex-filtros/conex-filtro.service';


@Component({
  selector: 'app-cart-hombre',
  templateUrl: './cart-hombre.component.html',
  styleUrls: ['./cart-hombre.component.css']
})

export class CartHombreComponent implements OnInit {
  @Input() dataEntranteDetalle: any;
  p = 1;
  marcaId: number =1;
  info_modal: boolean = false;
  ListaProducto: Producto[] = [];
  ListaHombre: Producto[] = [];
  ListaMarca: Marca[] = [];
  ListaPrecio: Producto[] = [];
  ListaTalla2: any[]=[];
  subcription: Subscription = new Subscription();
  tallaValue: string = '';
  load: boolean =false;
  selectedPrecio: string = "0";
  tallaSelect: string = "0";
  marcaSelect: string = "0";
  selectedColor: string | null = null;


/* El objeto `Filtro` se está inicializando con valores predeterminados. Tiene las siguientes
propiedades: */
  Filtro:Filtro = {
    talla: null,
    fk_marca: null,
    costo: null,
    color: null,
    genero: 'Hombre'
  };



  constructor(private conexionProducto: ConexProductosService, private conexionMarca: ConexMarcaService, private conexionFiltro:ConexFiltroService) {
    this.listarMarcas();
  }

  ngOnInit() {
    this.listarProductos();
    setTimeout(() => {
      this.load = true;
    }, 1000);
  }


  /**
   * Una función que se utiliza para enumerar las marcas de un producto.
   */
  listarMarcas() {
    this.conexionMarca.getMarcas().subscribe(
      (res: any) => {
        if (res.length === 0) {
          this.ListaMarca = [];
        } else {
          this.ListaMarca = res;
        }
      },
      err => console.log(err)
    );
  }


  ngOnDestroy(): void {
    this.subcription.unsubscribe();
    console.log('Observable Destruido')
  }

  /**
   * Toma un número de identificación, lo asigna a una variable y luego emite esa variable a otro
   * componente.
   * </código>
   * @param {number} id - número
   */
  getIDProducto(id: number) {
    this.dataEntranteDetalle = id;
    this.conexionProducto.disparadorDetalleProducto.emit(this.dataEntranteDetalle)
  }

  /**
   * Se suscribe a la función getProducto(), que devuelve un observable, y luego filtra los resultados
   * de ese observable y asigna los resultados filtrados a la variable ListaHombre.
   */
  listarProductos() {
    this.subcription.add(
      this.conexionProducto.getProducto().subscribe(
        res => {
          this.ListaProducto = <any>res;
          this.ListaHombre = this.ListaProducto.filter(item => item.genero == 'Hombre' && item.estado === 'Activo')
          this.ListaTalla2 = this.obtenerTallasUnicasOrdenadas(this.ListaHombre);
        },
        err => console.log(err)
      )
    );
    this.tallaValue = '';
  }


  /**
   * La función "obtenerTallasUnicasOrdenadas" toma una lista de productos y devuelve una matriz
   * ordenada de tamaños únicos.
   */
  obtenerTallasUnicasOrdenadas(listaProductos: any[]): any[] {
    const tallasUnicas: any[] = [];
    listaProductos.forEach(item => {
      if (item.talla && !tallasUnicas.includes(item.talla)) {
        tallasUnicas.push(item.talla);
      }
    });
    tallasUnicas.sort((a, b) => a - b);
    return tallasUnicas;
  }


/**
 * La función `getSelectedMarca` actualiza la propiedad `marcaId` basándose en el valor seleccionado de
 * un menú desplegable, y luego actualiza el objeto `Filtro` con el nuevo valor `fk_marca` antes de
 * llamar a la función `filtrosGlobales` con los valores de filtro actualizados.
 */
  getSelectedMarca(event: any) {
    const selectMarca = event.target as HTMLSelectElement;
    this.marcaId = Number(selectMarca.value);
    if(this.marcaId >0){
      this.Filtro.fk_marca = this.marcaId
    }else {
      this.Filtro.fk_marca = null
    }
    this.filtrosGlobales(this.Filtro.talla,this.Filtro.fk_marca,this.Filtro.costo,this.Filtro.color,this.Filtro.genero);
  }


  /**
   * La función `getSelectedPrecio` actualiza la propiedad `Filtro.costo` basándose en el valor
   * seleccionado de un menú desplegable y luego llama a la función `filtrosGlobales` con los valores
   * de filtro actualizados.
   */
  getSelectedPrecio(event: any) {
    const selectPrecio = event.target as HTMLSelectElement;
    const precio = selectPrecio.value;
    if(precio === '0'){
      this.Filtro.costo =null
    }else {
      this.Filtro.costo =precio
    }
    this.filtrosGlobales(this.Filtro.talla,this.Filtro.fk_marca,this.Filtro.costo,this.Filtro.color,this.Filtro.genero);
  }


  /**
   * La función `getSelectedColor` se usa para manejar la selección de un color y actualizar la
   * propiedad `selectedColor`, así como también aplicar el color seleccionado como filtro en una
   * función de filtro global.
   */
  getSelectedColor(event: any) {
    const selectedColor = event.target as HTMLElement;
    const colorValue = selectedColor.dataset['value'];
    const clickedColor = event.target.getAttribute('data-value');
    this.selectedColor = clickedColor === this.selectedColor ? null : clickedColor;
    console.log(this.selectedColor)

    if(this.selectedColor == null){
      this.Filtro.color = null;
    }else {
      this.Filtro.color = colorValue;
    }
    this.filtrosGlobales(this.Filtro.talla,this.Filtro.fk_marca,this.Filtro.costo,this.Filtro.color,this.Filtro.genero);
  }


/**
 * La función "filtrosGlobales" establece filtros globales para una lista de elementos en función de
 * parámetros como el tamaño, la marca, el costo, el color y el género.
 * @param {any} talla - El parámetro "talla" representa el tamaño del artículo.
 * @param {any} fk_marca - El parámetro "fk_marca" representa la clave foránea de una marca en una
 * tabla de base de datos. Se utiliza para filtrar artículos según la marca a la que pertenecen.
 * @param {any} costo - El parámetro "costo" se utiliza para filtrar artículos en función de su costo o
 * precio. Puede ser cualquier valor, como un número o una cadena que represente un rango de costos.
 * @param {any} color - El parámetro de color se utiliza para filtrar elementos en función de su color.
 * Puede ser cualquier valor que represente un color, como una cadena o un código de color.
 * @param {any} genero - El parámetro "genero" representa el género de los elementos que se filtran.
 */
  filtrosGlobales( talla: any,fk_marca: any,costo: any,color: any,genero: any){
      this.Filtro.talla = talla;
      this.Filtro.fk_marca = fk_marca;
      this.Filtro.costo = costo;
      this.Filtro.color = color;
      this.Filtro.genero = genero;

    this.subcription.add(
      this.conexionFiltro.filtro(this.Filtro).subscribe(
        res =>{
        console.log('Hola');
        this.ListaHombre = <any>res;
      })
    )
  }

  /**
   * La función actualiza el valor de la propiedad "talla" en el objeto "Filtro" y llama a la función
   * "filtrosGlobales" con los valores actualizados.
   */
  updateTallaValue(event: any) {
    const talla = event.target.value;
    if(talla === '0'){
      this.Filtro.talla = null;
    }else{
      this.Filtro.talla = event.target.value;
    }
    this.filtrosGlobales(this.Filtro.talla,this.Filtro.fk_marca,this.Filtro.costo,this.Filtro.color,this.Filtro.genero);
  }

  
  /**
   * La función "LimpiarFiltro" borra todas las opciones de filtro y restablece los valores
   * seleccionados a su estado predeterminado.
   */
  LimpiarFiltro(){
    this.Filtro.talla = null;
    this.Filtro.fk_marca = null;
    this.Filtro.costo = null;
    this.Filtro.color = null;
    this.selectedPrecio = "0";
    this.tallaSelect = "0";
    this.marcaSelect = "0";
    this.selectedColor = null;
    this.listarProductos();
  }

/**
 * La función "abrirmodal()" establece el valor de "info_modal" en verdadero.
 */
  abrirmodal() {
    this.info_modal = true;
  }
}
