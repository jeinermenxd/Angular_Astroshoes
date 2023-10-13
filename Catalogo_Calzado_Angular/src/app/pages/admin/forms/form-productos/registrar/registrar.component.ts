import { Component, OnInit } from '@angular/core';
import { ConexMarcaService,Marca } from 'src/app/services/conexiones/conex-marca/conex-marca.service';
import { ConexProductosService, Producto,Genero,Color, Oferta } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { ConexCategoriaService,categoria } from 'src/app/services/conexiones/conex-categoria/conex-categoria.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  ListaMarca:Marca[]=[];
  ListaCategoria:categoria[]=[];
  ListaGenero: Genero[]=[];//LISTA DE Genero
  ListaColor: Color[]=[];//LISTA DE Genero
  ListaOferta: Oferta[]=[];//LISTA DE Genero
  detalle:any={};
  modal_admin:boolean  = false;
  bandera:boolean  = false;
  bandera_categoria:boolean  = false;
  bandera_marca:boolean  = false;
  bandera_genero:boolean  = false;
  bandera_color:boolean  = false;
  bandera_oferta:boolean  = false;
  bandera_total:boolean  = false;
  valicat:number  = 0;
  valimarc:number  = 0;
  valigen:number  = 0;
  valico:number  = 0;
  valicoferta:number  = 0;
  MarcaSelect: string = "0";
  GeneroSelect: string = "0";
  ColorSelect: string = "0";
  CategoriaSelect: string = "0";
  OfertaSelect: string = "0";


  /* Creando un objeto de tipo Producto. */
  Producto:Producto={
    pk_id_producto: 0,
    codigo_producto:'',
    img:'',
    nombre_producto:'',
    descripcion:'',
    fk_marca:0,
    modelo:'',
    genero:'',
    talla:'',
    costo:'',
    oferta:'',
    fk_id_categoria:0,
    color:'',
    estado:''
  };


  /**
   * Esta función se llama cuando se inicializa el componente.
   * @param {ConexProductosService} ConexProductoService - Este es el servicio que se conecta a la API.
   * @param {ConexMarcaService} ConexMarca - es un servicio que se conecta a la base de datos y
   * recupera los datos de la marca.
   * @param {ConexCategoriaService} ConexCategoria - Este es el servicio que se conecta a la base de
   * datos y recupera los datos.
   */
  constructor(private ConexProductoService:ConexProductosService, private ConexMarca:ConexMarcaService, private ConexCategoria:ConexCategoriaService) {
    this.ConexProductoService.disparadorDetalleProducto.subscribe(data=>{
      this.detalle = data;
      this.Producto.oferta = '0';
      this.Producto.estado = 'Desactivado';
    });
  }

  ngOnInit(): void {
    this.listarMarcas();
    this.listaCategoria();
    this.listarGenero();
    this.listarColor();
    this.listarOferta();
  }

  //Lista u obtiene las CATEGORIAS del servicio//
  listaCategoria(){
    console.log("--- Listar Categoria de productos --");
    this.ConexCategoria.getCategoria().subscribe(
      res=>{
        this.ListaCategoria=<any>res;
      },
      err => console.log(err)
    );
  }

  //Lista u obtiene las MARCAS del servicio//
  listarMarcas(){
    console.log("----Listar Marcas de productos----");
    this.ConexMarca.getMarcas().subscribe(
      res=>{
        this.ListaMarca=<any>res;
      },
      err => console.log(err)
    );
  }


 /**
  * Una función que se llama cuando se carga la página, es una función que está en el servicio, que es
  * una función que devuelve una lista de objetos.
  */
  listarGenero(){
  this.ListaGenero= this.ConexProductoService.getGenero();
  }
  listarColor(){
  this.ListaColor= this.ConexProductoService.getColor();
  }
  listarOferta(){
    this.ListaOferta = this.ConexProductoService.getOferta();
  }

  /**
   * La función obtenercategoria() toma una cadena como argumento y la asigna a la variable valor. La
   * función luego asigna el valor de valor a la variable Producto.fk_id_categoria ya la variable
   * valicat. Luego, la función registra el valor de valor en la consola.
   * @param {string} valor - cadena
   */
  obtenercategoria(valor: string) {
    this.Producto.fk_id_categoria = parseInt(valor);
    this.valicat = parseInt(valor);

  }
  /**
   * Si el valor de la variable validat no es igual a cero, establezca el valor de la variable
   * bandera_categoria en verdadero. De lo contrario, establezca el valor de la variable
   * bandera_categoria en falso.
   * @returns El valor de la variable bandera_categoria.
   */
  validacategoria() {

    if( this.valicat != 0 ){
        this.bandera_categoria = true
    }else{
      this.bandera_categoria = false;
    }
     return this.bandera_categoria;
  }

 /**
  * La función obtenerMarca() toma como parámetro una cadena y la asigna a la variable valor. Luego, la
  * variable valor se analiza en un número entero y se asigna a la variable fk_marca. La variable
  * valimarc también se analiza en un número entero y se asigna a la variable valimarc. Luego, la
  * función registra el valor de valor en la consola.
  * </código>
  * @param {string} valor - cadena
  */
  obtenerMarca(valor: string) {
    this.Producto.fk_marca = parseInt(valor);
    this.valimarc = parseInt(valor);


  }
 /**
  * Si el valor de this.valimarc no es igual a cero, entonces establezca this.bandera_marca en
  * verdadero, de lo contrario, configúrelo en falso.
  * @returns El valor de la variable bandera_marca.
  */
  validamarca() {

    if( this.valimarc != 0 ){
        this.bandera_marca = true
    }else{
      this.bandera_marca  = false;
    }
     return this.bandera_marca;
  }


/**
 * Toma una cadena como argumento, la asigna a la propiedad Producto.genero, la convierte en un número
 * y la asigna a la propiedad valigen, y luego registra la cadena en la consola.
 * @param {string} valor - cadena
 */
  obtenercGenero(valor: string) {
    this.Producto.genero = valor;
    this.valigen = parseInt(valor);

  }

  obtenerOfertaP(valor: string) {
    this.Producto.oferta = valor;
    this.valicoferta = parseInt(valor);

  }


  /**
   * Si el valor de la variable valigen no es igual a cero, entonces establezca el valor de la variable
   * bandera_genero en verdadero, de lo contrario establezca el valor de la variable bandera_genero en
   * falso.
   * @returns El valor de la variable bandera_genero.
   */
  validagenero() {

    if( this.valigen != 0 ){
        this.bandera_genero = true
    }else{
      this.bandera_genero  = false;
    }
     return this.bandera_genero;
  }

  validaOferta() {

    if( this.valicoferta != 0 ){
        this.bandera_oferta = true
    }else{
      this.bandera_oferta  = false;
    }
     return this.bandera_oferta;
  }


    /**
 * Toma una cadena como argumento, la asigna a la propiedad Producto.genero, la convierte en un número
 * y la asigna a la propiedad valigen, y luego registra la cadena en la consola.
 * @param {string} valor - cadena
 */
    obtenerColor(valor: string) {
      this.Producto.color = valor;
      this.valico = parseInt(valor);

    }

    /**
   * Si el valor de la variable valigen no es igual a cero, entonces establezca el valor de la variable
   * bandera_genero en verdadero, de lo contrario establezca el valor de la variable bandera_genero en
   * falso.
   * @returns El valor de la variable bandera_genero.
   */
    validaColor() {

      if( this.valico != 0 ){
          this.bandera_color = true
      }else{
        this.bandera_color  = false;
      }
       return this.bandera_color;
    }




   /**
   * Si el valor es verdadero, establezca la oferta del producto en "Oferta", de lo contrario,
   * configúrelo en "Sin oferta".
   * @param {boolean} valor - booleano
   */
  obtenerEstado(valor: boolean) {
    if(valor == true){
      this.Producto.estado = 'Activo';

    }else{
      this.Producto.estado = 'Desacticado';

    }
  }
  /**
   * Si el valor de bandera_categoria no es falso, el valor de bandera_marca no es falso y el valor de
   * bandera_genero no es falso, establezca el valor de bandera_total en verdadero; de lo contrario,
   * establezca el valor de bandera_total en falso.
   */
  validaTodo() {

    if(this.bandera_categoria  != false && this.bandera_marca !=false && this.bandera_genero !=false && this.bandera_color !=false ){
        this.bandera_total=true;

    }else{
      this.bandera_total=false;
    }
     return this.bandera_total;
  }


  /* Añadir un producto a la base de datos. */
  agregarProducto(){
    try {
      this.Producto.pk_id_producto = (this.detalle)


      if(this.Producto.pk_id_producto != 0 && this.Producto.codigo_producto !='' && this.Producto.img!='' && this.Producto.nombre_producto!=''
         && this.Producto.descripcion!='' && this.Producto.fk_marca !=0 && this.Producto.modelo!='' && this.Producto.genero !='' && this.Producto.talla !=''
         && this.Producto.costo !='' && this.Producto.oferta !='' && this.Producto.fk_id_categoria !=0 && this.Producto.genero !='' && this.Producto.color !=''){
        this.ConexProductoService.addProducto(this.Producto).subscribe();
        this.Limpiar();
        swal.fire({
          icon: 'success',
          title: 'Registro de Producto Exitoso',
          text: 'Continuar'
        });
      }else{
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por Favor!! Ingrese todos los parametros'
        });
      }
    } catch (error) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingrese todos los parametros Por favor'
      });
    }

  }

  Verificar(){

      if(this.Producto.pk_id_producto != 0 && this.Producto.codigo_producto !='' && this.Producto.img!='' && this.Producto.nombre_producto!=''
      && this.Producto.descripcion!='' && this.Producto.fk_marca !=0 && this.Producto.modelo!='' && this.Producto.genero !='' && this.Producto.talla !=''
      && this.Producto.costo !='' && this.Producto.oferta !='' && this.Producto.fk_id_categoria !=0 && this.Producto.genero !=''&& this.Producto.color !=''){
        this.bandera = true;
       swal.fire({
         icon: 'success',
         title: 'Registro de Producto Exitoso',
         text: 'Continuar'
       });
       }else{
         swal.fire({
           icon: 'error',
           title: 'Error',
           text: 'Por Favor!! Ingrese todos los parametros'
         });
     }
  }


  Limpiar(){
    this.Producto.pk_id_producto= 0,
    this.Producto.codigo_producto='',
    this.Producto.img='',
    this.Producto.nombre_producto='',
    this.Producto.descripcion='',
    this.Producto.modelo='',
    this.Producto.talla='',
    this.Producto.costo='',
    this.Producto.oferta=''
    this.MarcaSelect = "0";
    this.GeneroSelect = "0";
    this.ColorSelect = "0";
    this.CategoriaSelect = "0";
    this.OfertaSelect = "0";

    this.bandera_categoria  = false;
    this.bandera_marca  = false;
    this.bandera_genero  = false;
    this.bandera_color  = false;
    this.bandera_oferta  = false;
    this.bandera_total  = false;

    this.valicat  = 0;
    this.valimarc  = 0;
    this.valigen  = 0;
    this.valico  = 0;
  }
}
