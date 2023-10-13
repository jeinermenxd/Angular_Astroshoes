
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConexMarcaService, Marca } from 'src/app/services/conexiones/conex-marca/conex-marca.service';
import { Producto } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { ConexUsuariosService, Usuario  } from 'src/app/services/conexiones/conex-usuarios/conex-usuarios.service';
import { ConexProductosService } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { CanvasJS, CanvasJSChart } from '@canvasjs/angular-charts';
import { categoria, ConexCategoriaService } from '../../../../../services/conexiones/conex-categoria/conex-categoria.service';
import { ConexComprobantesService } from 'src/app/services/conexiones/conex-comprobantes/conex-comprobantes.service';
import { ConexResenasService, Resenas } from 'src/app/services/conexiones/conex-resenas/conex-resenas.service';
@Component({
  selector: 'app-charts-admin',
  templateUrl: './charts-admin.component.html',
  styleUrls: ['./charts-admin.component.css']
})
export class ChartsAdminComponent implements OnInit {
 /* El código está declarando e inicializando varias variables: */
  ListaMarca:Marca[]=[];
  ListaCategoria:categoria[]=[];
  ListaProducto:Producto[]=[];
  ListaUsuario:Usuario[]=[];
  ListaResenas:Resenas[]=[];
  comprobantes: any[]=[];
  sum_marc:number=0;
  sum_cat:number=0;
  sum_prod:number=0;
  sum_user:number=0;
  sum_comprobantes:number=0;
  subcription: Subscription = new Subscription();
  sum_5estrellas:number=0;
  sum_4estrellas:number=0;
  sum_3estrellas:number=0;
  sum_2estrellas:number=0;
  sum_1estrellas:number=0;

  @ViewChild('chart', { static: true }) chart: CanvasJSChart;

  constructor(private ConexMarcaService:ConexMarcaService, private Conexcategoria:ConexCategoriaService,
    private ConexUsuarioService:ConexUsuariosService, private ConexProductoService:ConexProductosService,
    private conexComprobantes: ConexComprobantesService,private cenexionresenas:ConexResenasService) { }


 /**
  * La función ngOnInit se usa para inicializar el componente llamando a varios métodos para enumerar
  * marcas, categorías, productos, usuarios y actualizar el gráfico.
  */
  ngOnInit(): void {
    this.listarMarcas();
    this.listarCategoria();
    this.listarProductos();
    this.listarUsuario();
    this.listarResenas();
    this.updateChart();
    this.listarComprobantes();
  }

  /**
   * La función ngOnDestroy se usa para darse de baja de un observable y registrar un mensaje que
   * indica que el observable se ha cerrado.
   */
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
    console.log('Observable cerrado')
  }

  /**
   * La función "listarMarcas" registra un mensaje, realiza una solicitud HTTP para obtener una lista
   * de marcas, asigna la respuesta a una variable y actualiza un gráfico.
   */
  listarMarcas(){
    console.log("---Listar marcas----");
    this.subcription.add(
      this.ConexMarcaService.getMarcas().subscribe(
        res => {

          this.ListaMarca = <any> res;
          this.updateChart();
        },
          err => console.log(this.ListaMarca)
      )
    );
  }

  ////Listar las categorias para hacer el contador.////
  listarCategoria(){
    console.log("---Listar Categoria----");
    this.subcription.add(
      this.Conexcategoria.getCategoria().subscribe(
        res => {
          this.ListaCategoria = <any> res;
          this.updateChart();
        },
        err => console.log(this.ListaCategoria)
      )
    );
  }

  ////Listar los usuarios para hacer el contador.////
  listarUsuario(){
    console.log("---Listar usuarios----");
    this.ConexUsuarioService.getUsuario().subscribe(
      res => {

        this.ListaUsuario = <any>res;
        this.updateChart();

      },
        err => console.log(this.ListaUsuario)

    );
  }

  ////Listar los productos para hacer el contador.////
  listarProductos(){
    console.log("----Listar PRODUCTOS----");
    this.subcription.add(
      this.ConexProductoService.getProducto().subscribe(
        res=>{

          this.ListaProducto= <any> res;
          this.updateChart();
        },
          err => console.log(err)
      )
    );
  }
  listarResenas(){
    console.log("----Listar Reseñas----");
    this.subcription.add(
      this.cenexionresenas.getResenas().subscribe(
        res=>{

          this.ListaResenas= <any> res;
        // Recorre la lista de reseñas y cuenta las estrellas
        this.ListaResenas.forEach(resena => {
          switch (resena.estrellas) {
            case 5:
              this.sum_5estrellas++;
              break;
            case 4:
              this.sum_4estrellas++;
              break;
            case 3:
              this.sum_3estrellas++;
              break;
            case 2:
              this.sum_2estrellas++;
              break;
            case 1:
              this.sum_1estrellas++;
              break;
            default:
              // En caso de valor no válido, no se suma nada.
              break;
          }
        });
      },
      err => console.log(err)
    )
  );
}

    ////Listar los productos para hacer el contador.////
    listarComprobantes(){
      this.subcription.add(
        this.conexComprobantes.listarComprobantes().subscribe(
          res=>{

            this.comprobantes= <any> res;
            this.updateChart();
          },
            err => console.log(err)
        )
      );
    }


    FiltrarPorMarcas() {
      // Creamos un objeto para almacenar las cantidades de zapatos por cada marca
      let cantidadesPorMarca = {};
      for (let i = 0; i < this.ListaMarca.length; i++) {
        let marcaActual = this.ListaMarca[i];
        let marcaActual2 = this.ListaMarca[i].nombre;
        let cantidadZapatos = 0;

        for (let j = 0; j < this.ListaProducto.length; j++) {
          if (marcaActual.id_Marca === this.ListaProducto[j].fk_marca) {
            cantidadZapatos++;
          }
        }

        // Almacenamos la cantidad de zapatos para la marca actual en el objeto
        cantidadesPorMarca[marcaActual2] = cantidadZapatos;
      }
      // Devolvemos el objeto con las cantidades de zapatos por marca

      return cantidadesPorMarca;
    }

 /**
  * Cuenta el número de categorías en la lista.
  * @returns La longitud de la matriz.
  */
  ContadorCategoria(){
    this.sum_cat = this.ListaCategoria.length;
    return this.sum_cat;
  }

 /**
  * Cuenta el número de marcas en la lista.
  * @returns La longitud de la matriz.
  */
  ContadorMarcas(){
    this.sum_marc = this.ListaMarca.length;
    return this.sum_marc;
  }

 /**
  * Cuenta el número de productos en la lista.
  * @returns La longitud de la matriz.
  */
  ContadorProductos(){
    this.sum_prod = this.ListaProducto.length;
    return this.sum_prod;
  }

 /**
  * Cuenta el número de usuarios en la lista.
  * @returns La longitud de la matriz.
  */
  ContadorUsuarios(){
    this.sum_user = this.ListaUsuario.length;
    return this.sum_user;
  }

 /**
  * La función "ContadorComprobantesVenta" devuelve el número de elementos del array "comprobantes".
  * @returns el número de elementos en la matriz "comprobantes".
  */
  ContadorComprobantesVenta(): number {
    this.sum_comprobantes = this.comprobantes.length;
    return this.sum_comprobantes;
  }


  /**
   * La función `updateChart()` crea y representa gráficos diferentes utilizando la biblioteca
   * CanvasJS.
   */

  updateChart() {
    /* Este código está creando un gráfico circular usando la biblioteca CanvasJS. */
    const Data_Informacion = [
      { label: "Marcas", y: this.ContadorMarcas() },
      { label: "Categorías", y: this.ContadorCategoria() },
      { label: "Productos", y: this.ContadorProductos() },
      { label: "Usuarios", y: this.ContadorUsuarios() },
    ];

    const chartOptions1 = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Información'
      },
      data: [{
        type: 'pie',
        startAngle: 45,
        indexLabel: "{label}: {y}",
        dataPoints: Data_Informacion
      }]
    };
    const chart = new CanvasJS.Chart('chartgrafico1', chartOptions1);
    chart.render();




    /* Este código está creando un gráfico para mostrar el número de ventas/comprobantes. */
    const Data_ventas = [
      { label: "Vendidos", y: this.ContadorComprobantesVenta()},
    ];

    const chartOptions2 = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Cantidad de Ventas'
      },
      data: [{
        type: 'column',
        dataPoints: Data_ventas
      }]
    };

    const chart2 = new CanvasJS.Chart('chartgrafico2', chartOptions2);
    chart2.render();


    /* Este código está creando un gráfico circular usando la biblioteca CanvasJS. */
    const Data_Resenas = [
      { label: "5 Estrellas", y: this.sum_5estrellas },
      { label: "4 Estrellas", y: this.sum_4estrellas },
      { label: "3 Estrellas", y: this.sum_3estrellas },
      { label: "2 Estrellas", y: this.sum_2estrellas },
      { label: "1 Estrellas", y: this.sum_1estrellas },
    ];

    const chartOptions5 = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Reseñas'
      },
      data: [{
        type: 'column',
        startAngle: 45,
        indexLabel: "{label}: {y}",
        dataPoints: Data_Resenas
      }]
    };
    const chart5 = new CanvasJS.Chart('chartgrafico5', chartOptions5);
    chart5.render();


    /* Este código está creando un nuevo gráfico llamado `chart3` utilizando la biblioteca CanvasJS. */
    const dataPorMarca = this.FiltrarPorMarcas(); // Obtenemos el objeto con las cantidades por marca
    const chartData = [];
    // Convertimos el objeto en un array de objetos con la estructura requerida por el gráfico
    for (const marca in dataPorMarca) {
      chartData.push({
        label: marca,
        y: dataPorMarca[marca],
      });
    }

    const chartOptions = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Cantidad de productos por marcas'
      },
      data: [{
        type: 'pie',
        dataPoints: chartData
      }]
    };
    const chart3 = new CanvasJS.Chart('chartgrafico3', chartOptions);
    chart3.render();



    const Data_compras_comprobantes = [];
    // Convertimos el objeto en un array de objetos con la estructura requerida por el gráfico
    for (let j = 0; j < this.comprobantes.length; j++) {
      // Convertir la cadena de fecha a un objeto de fecha
      const fechaVenta = new Date(this.comprobantes[j].fecha_venta);
      // Obtener los componentes de año, mes y día
      const year = fechaVenta.getFullYear();
      const month = fechaVenta.getMonth() + 1; // +1 porque los meses en JavaScript comienzan desde 0
      const day = fechaVenta.getDate();
      // Construir el formato deseado a/m/d
      const formattedFechaVenta = `${year}/${month}/${day}`;
      Data_compras_comprobantes.push({
        label: formattedFechaVenta, // Usar la fecha formateada
        y: parseInt(this.comprobantes[j].total)
      });
    }

    const chartOptions4 = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Ingresos de ventas'
      },
      axisY: {
        title: "Costos"
      },
      axisX: {
        title: "Fechas de ventas"
      },
      data: [{
        type: 'stepArea',
        indexLabel: "{label}: {y} dolares",
        indexLabelFontSize: 9, // Ajusta el valor del tamaño de fuente aquí según tus necesidades
        dataPoints: Data_compras_comprobantes
      }]
    };

    const chart4 = new CanvasJS.Chart('chartgrafico4', chartOptions4);
    chart4.render();

  }
}
