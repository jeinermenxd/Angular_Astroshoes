import { Component, Input, OnInit } from '@angular/core';
import { ConexProductosService,Producto } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { ConexMarcaService, Marca } from 'src/app/services/conexiones/conex-marca/conex-marca.service';
import { Subscription } from 'rxjs';
import { ConexFiltroService, Filtro } from 'src/app/services/conexiones/conex-filtros/conex-filtro.service';

@Component({
  selector: 'app-cart-ninos',
  templateUrl: './cart-ninos.component.html',
  styleUrls: ['./cart-ninos.component.css']
})
export class CartNinosComponent implements OnInit {
  @Input() dataEntranteDetalle: any;
  p = 1;
  marcaId: number =1;
  info_modal: boolean = false;
  ListaProducto: Producto[] = [];
  ListaNino:Producto[]=[];
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


  Filtro:Filtro = {
    talla: null,
    fk_marca: null,
    costo: null,
    color: null,
    genero: 'Niños'
  };



  /**
   * Esta función se llama cuando se crea el componente y llama a la función listarMarcas().
   * @param {ConexProductosService} conexionProducto - ConexProductosServicio
   * @param {ConexMarcaService} conexionMarca - ConexMarcaServicio
   */
  constructor(private conexionProducto:ConexProductosService, private conexionMarca: ConexMarcaService, private conexionFiltro:ConexFiltroService) { this.listarMarcas()}

  ngOnInit(): void {
    this.listarProductos();

    setTimeout(() => {
      this.load = true;
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
    console.log('Observable Destruido')
  }

 /**
  * Estoy tratando de enviar un número de un componente a otro.
  * </código>
  * @param {number} nombre - número
  */
  getIDProducto(nombre:number){
    this.dataEntranteDetalle = nombre;
    this.conexionProducto.disparadorDetalleProducto.emit(this.dataEntranteDetalle)
  }



  /**
   * Se suscribe a la función getMarcas(), que devuelve un observable, y luego asigna el resultado de
   * ese observable a la variable ListaMarca.
   */
  listarMarcas() {
    console.log("---Servicio Carta ninos---");
    this.subcription.add(
      this.conexionMarca.getMarcas().subscribe(
        (res: any) => {
          if (res.length === 0) {
            this.ListaMarca = [];
          } else {
            this.ListaMarca = res;
          }
        },
        err => console.log(err)
      )
    );
  }



  /**
   * Obtiene el valor seleccionado del desplegable y lo asigna a la variable marcaId.
   * @param {any} event - cualquier
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


  listarProductos()
  {
    this.tallaValue ='';
    this.subcription.add(
      this.conexionProducto.getProducto().subscribe(
        res=>{
          this.ListaProducto=<any>res;
          this.ListaNino = this.ListaProducto.filter(item =>item.genero=='Niños'  && item.estado === 'Activo')
          this.ListaTalla2 = this.obtenerTallasUnicasOrdenadas(this.ListaNino);
        },
        err => console.log(err)
      )
    );
  }
  // Función para obtener tallas únicas de una lista de productos
  obtenerTallasUnicasOrdenadas(listaProductos: any[]): any[] {
    const tallasUnicas: any[] = [];

    listaProductos.forEach(item => {
      if (item.talla && !tallasUnicas.includes(item.talla)) {
        tallasUnicas.push(item.talla);
      }
    });

    // Ordenar las tallas numéricamente
    tallasUnicas.sort((a, b) => a - b);

    return tallasUnicas;
  }


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
      this.ListaNino = <any>res;
    })
    )
}

  updateTallaValue(event: any) {
    const talla = event.target.value;
    if(talla === '0'){
      this.Filtro.talla = null;
    }else{
      this.Filtro.talla = event.target.value;
    }
    this.filtrosGlobales(this.Filtro.talla,this.Filtro.fk_marca,this.Filtro.costo,this.Filtro.color,this.Filtro.genero);
  }

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

  abrirmodal() {
    this.info_modal = true;
  }
}
