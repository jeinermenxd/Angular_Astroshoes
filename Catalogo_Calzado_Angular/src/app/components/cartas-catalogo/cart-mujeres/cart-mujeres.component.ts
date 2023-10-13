import { Component, Input, OnInit } from '@angular/core';
import { ConexProductosService,Producto } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { ConexMarcaService, Marca } from 'src/app/services/conexiones/conex-marca/conex-marca.service';
import { Subscription } from 'rxjs';
import { ConexFiltroService, Filtro } from 'src/app/services/conexiones/conex-filtros/conex-filtro.service';

@Component({
  selector: 'app-cart-mujeres',
  templateUrl: './cart-mujeres.component.html',
  styleUrls: ['./cart-mujeres.component.css']
})
export class CartMujeresComponent implements OnInit {
  @Input() dataEntrante:any;
  p = 1;
  marcaId: number =1;
  info_modal:boolean=false;
  ListaProducto:Producto[]=[];
  ListaMujeres:Producto[]=[];
  ListaMarca: Marca[] = [];
  ListaTalla2: any[]=[];
  subcription: Subscription = new Subscription();
  tallaValue: string = '';
  load: boolean;
  selectedPrecio: string = "0";
  tallaSelect: string = "0";
  marcaSelect: string = "0";
  selectedColor: string | null = null;


  Filtro:Filtro = {
    talla: null,
    fk_marca: null,
    costo: null,
    color: null,
    genero: 'Mujer'
  };


  /**
   * Esta función se llama cuando se crea el componente y llama a la función listarMarcas().
   * @param {ConexProductosService} conexionProducto - ConexProductosServicio
   * @param {ConexMarcaService} conexionMarca - ConexMarcaServicio
   */
  constructor(private conexionProducto:ConexProductosService, private conexionMarca: ConexMarcaService,private conexionFiltro:ConexFiltroService) { this.listarMarcas();}

  ngOnInit(){
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
  * "Obtengo la identificación del producto y la envío al otro componente"
  * </código>
  * @param {number} id - número
  */
  getIDProducto(id:number){
    this.dataEntrante = id;
    this.conexionProducto.disparadorDetalleProducto.emit(this.dataEntrante)
  }

  /**
   * Estoy tratando de filtrar los datos de la API y mostrarlos en la vista.
   */
  listarProductos(){
    this.tallaValue='';
    console.log("Servicio Carta Mujeres");
    this.subcription.add(
      this.conexionProducto.getProducto().subscribe(
        res=>{

          this.ListaProducto=<any>res;
          this.ListaMujeres = this.ListaProducto.filter(item =>item.genero=='Mujer'  && item.estado === 'Activo')
          this.ListaTalla2 = this.obtenerTallasUnicasOrdenadas(this.ListaMujeres);
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



  /**
   * Es una función que llama a un servicio que realiza una solicitud a una API y devuelve una lista de
   * objetos.
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
      this.ListaMujeres = <any>res;
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

    /**
   * Abre un modal.
   */
    abrirmodal(){
      this.info_modal = true;
      }



}
