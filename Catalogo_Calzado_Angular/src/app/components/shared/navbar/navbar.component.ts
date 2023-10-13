import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ConexProductosService, Producto } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { ConexMarcaService, Marca } from 'src/app/services/conexiones/conex-marca/conex-marca.service';
import { ConexPdfService } from 'src/app/services/conexiones/conex-pdf/conex-pdf.service';
import { ConexUsuariosService, Usuario  } from 'src/app/services/conexiones/conex-usuarios/conex-usuarios.service';

/* La interfaz `TokenPayload` define la estructura de la carga útil del token JWT decodificado.
Especifica que la carga útil debe tener las siguientes propiedades: */
interface TokenPayload {
  user: {
    id: number;
    email: string;
    nombres: string;
    rol: string;
  },
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {

  /* Estas son las propiedades y variables utilizadas en la clase `NavbarComponent`. */
  @Input() dataEntrante: any;
  @Input() databusqueda: any;
  @Input() datausuario: any;
  data: Producto[] = [];
  isLoggedIn: boolean;
  nombreUsuario: string | undefined;
  public userRole: boolean | undefined;
  public admin: boolean | undefined;
  subcription: Subscription = new Subscription();
  ListaProducto:Producto[]=[];
  ListaProductoOriginal:Producto[]=[];
  Listaux:Producto[]=[];
  ListaMarca: Marca[] = [];
  buscarid:string='';
  buscando: boolean = false;
  windowWidth: number;
  ListaUsuario:Usuario[]=[];
  email:string = '';


  /**
   * Si el usuario ha iniciado sesión, se muestra el nombre del usuario; de lo contrario, no.
   * @param {CookieService} cookieService - servicio de cookies,
   * @param {Router} router - enrutador
   * @param {ConexProductosService} conexionProducto - ConexProductosServicio
   */
  constructor(private cookieService: CookieService, private router: Router, private conexionProducto: ConexProductosService,
    private conexionMarca: ConexMarcaService, private conexionpdf: ConexPdfService, private ConexUsuarioService:ConexUsuariosService) {
    this.windowWidth = window.innerWidth;
    this.listarMarcas();
    const token = cookieService.get('token');
    //this.userRole = this.verifyRole();
    if (token) {
      const decoded = jwt_decode(token) as TokenPayload;
      this.nombreUsuario = 'Bienvenido ' + decoded.user.nombres;
      this.email = decoded.user.email
      this.isLoggedIn = true;
      this.datausuario = true;
      this.ConexUsuarioService.enviarDatos(this.datausuario);
      if (decoded.user.rol === 'user') {
        this.userRole = true;
      }
      if (decoded.user.rol === 'admin') {
        this.admin = true;
      }
    } else {
      this.isLoggedIn = false;
      this.nombreUsuario = '';
    }


    this.ConexUsuarioService.getUsuario().subscribe(
      res => {
        this.ListaUsuario = <any>res;
        for(let i=0; i < this.ListaUsuario.length ; i++){
            if(this.ListaUsuario[i].email == this.email){
                this.datausuario = this.ListaUsuario[i];
            }
        }
      },
        err => console.log(this.ListaUsuario)
    );



  }

/**
 * La función ngOnInit se utiliza para inicializar el componente llamando a las funciones
 * listarProductos y listarFiltros.
 */
  ngOnInit(): void {
    this.listarProductos();
    this.listarFiltros();
  }

/**
 * La función ngOnDestroy cancela la suscripción de una suscripción.
 */
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  /* El decorador `@HostListener` se usa para escuchar eventos en el elemento anfitrión de un
 componente. En este caso, está escuchando el evento `resize` en el objeto de la ventana. */
 @HostListener('window:resize', ['$event'])
 onResize(event: any) {
   this.windowWidth = event.target.innerWidth;
 }

  //**** Método de redireccionamiento, donde le pasamos un parametro de tipo string la ruta inicial a donde queremos llegar****/
  //** Funcional para direccionamiento entre componentes de las pages **//
  redirectAndScrollToTop(route: string) {
    this.router.navigate([route]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  /**
   * "Cuando el usuario hace clic en el botón, se llama a la función getIDProducto(), que emite la
   * variable dataEntrante al componente padre".
   * </código>
   */

  getIDProducto() {
     this.conexionProducto.disparadorDetalleProducto.emit(this.dataEntrante);
  }


/**
 * La función `getBusca()` envía datos a la conexión de un producto y restablece algunas variables.
 */
  getBusca() {
    this.conexionProducto.enviarDatos(this.dataEntrante,this.databusqueda);
    this.dataEntrante = null;
    this.buscarid = ''
 }

  /**
   * Toma el valor del ítem seleccionado y lo asigna a la variable dataEntrante.
   * @param {any} item - cualquiera =&gt; El elemento que se selecciona
   */

  renderSelectedValue(item: any) {
    this.dataEntrante = item.pk_id_producto;
  }


  getBuscaUsuario() {
    this.ConexUsuarioService.enviarDatos(this.datausuario);
  }


  //** Listar los productos del servicio **//

/**
 * La función "listarProductos" registra un mensaje, se suscribe a un servicio de producto para obtener
 * datos del producto y asigna la respuesta a una variable.
 */
  listarProductos() {
    console.log("Servicio ULTIMA NOVEDAD");
    this.subcription.add(
    this.conexionProducto.getProducto().subscribe(
      res => {

        this.data = <any>res;
      },
      err => console.log(err)
    )
    );
  }

/**
 * La función "listarFiltros" registra un mensaje, realiza una solicitud HTTP para obtener una lista de
 * productos y asigna la respuesta a una variable.
 */
  listarFiltros()
  {
    console.log("---Servicio Filtros---");
    this.subcription.add(
      this.conexionProducto.getProducto().subscribe(
        res=>{

          this.ListaProductoOriginal=<any>res;
        },
        err => console.log(err)
      )
    );
  }



/** Método que permite desloguearse de la cuenta, y envia un mensaje al usuario de ´Cierre de sesion exitoso´
 * La función de cierre de sesión elimina el token de la cookie, establece el indicador isLoggedIn en
 * falso, muestra un mensaje de éxito usando swal.fire y redirige al usuario a la página de inicio
 * mientras se desplaza hacia la parte superior.
 */
  logout() {
    this.cookieService.delete('token');
    this.isLoggedIn = false;
    this.datausuario = false;
    this.ConexUsuarioService.enviarDatos(this.datausuario);
    this.nombreUsuario = '';
    swal.fire({
      title: '¡Cierre de sesión exitoso!',
      text: 'Esperamos verte pronto.',
      icon: 'success'
    });
    this.redirectAndScrollToTop("/home");
  }


/**
 * La función `generar_pdf()` recupera un enlace PDF de una respuesta API y lo abre en una nueva
 * pestaña del navegador.
 */
  generar_pdf() {
    this.conexionpdf.getPDF().subscribe(
      (data) => {
        if (Array.isArray(data) && data.length > 0 && data[0].enlace_pdf) {
          const enlacePdf = data[0].enlace_pdf;
          // Ahora puedes hacer lo que necesites con el enlacePdf, como descargar el archivo o redireccionar a esa URL.
          // Por ejemplo, para redireccionar a la URL del PDF en una nueva pestaña del navegador:
          window.open(enlacePdf, '_blank');
        } else {
          console.error('La respuesta del API no contiene datos válidos para descargar el PDF.');
        }
      },
      (error) => {
        console.error('Error al obtener los datos del API:', error);
      }
    );
  }


/**
 * La función "listarMarcas" recupera una lista de marcas de un servidor y asigna el resultado a la
 * variable "ListaMarca".
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

/**
 * La función "filtrar" filtra una lista de productos en función de una consulta de búsqueda y
 * actualiza la lista filtrada y las variables de consulta de búsqueda.
 * @param {string} busca - Una cadena que representa la consulta de búsqueda.
 */
  filtrar(busca: string) {
    this.buscando = true;
    setTimeout(() => {
      this.buscando = false;
    }, 1000);

    if (busca.length != -1) {
      let valorBusqueda = busca.toLowerCase(); // Convertir a minúsculas
      if (busca !== '') {
        this.buscarid = busca;
        this.Listaux = this.ListaProductoOriginal.filter(item => item.genero.toLocaleLowerCase().includes(valorBusqueda) || item.nombre_producto.toLocaleLowerCase().includes(valorBusqueda)
                                                  || item.descripcion.toLocaleLowerCase().includes(valorBusqueda) || item.modelo.toLocaleLowerCase().includes(valorBusqueda) ||
                                                  item.color.toLocaleLowerCase().includes(valorBusqueda) );
        this.ListaProducto = this.Listaux.filter(item => item.estado === 'Activo')
        this.dataEntrante = this.ListaProducto ;
        this.databusqueda = busca;

      } else {

        this.databusqueda = null;
        this.dataEntrante = null;
        this.buscarid = '';
      }
    } else {
    }
  }


 /**
  * Establece el valor de la variable info_modal en verdadero.
  * La función "abrirmodal" comprueba si una consulta de búsqueda está vacía y muestra un mensaje de
  * advertencia si lo está.
  */
 abrirmodal() {
    if (this.buscarid == '') {
      this.databusqueda = '';
      this.router.navigate(['/home']);
      swal.fire({
        title: 'No se han encontrado productos',
        text: 'Por favor, ingrese un producto a buscar',
        icon: 'warning',
        confirmButtonColor: '#229954',
        confirmButtonText: 'Listo'
      });
    }
  }
}
