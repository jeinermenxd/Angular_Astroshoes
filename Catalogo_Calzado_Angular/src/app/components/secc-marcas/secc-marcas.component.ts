import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConexProductosService, Producto } from 'src/app/services/conexiones/conex-productos/conex-productos.service';


@Component({
  selector: 'app-secc-marcas',
  templateUrl: './secc-marcas.component.html',
  styleUrls: ['./secc-marcas.component.css']
})
export class SeccMarcasComponent implements OnInit {

  @Input() dataEntrante: any;
  listaProductos:any =[]
  listaux:any =[]
  constructor(private conexionProducto: ConexProductosService,private router: Router) { }

  ngOnInit(): void {
    this.ListaProductos();
  }

    //**** Método de redireccionamiento, donde le pasamos un parametro de tipo string la ruta inicial a donde queremos llegar****/
  //** Funcional para direccionamiento entre componentes de las pages **//
  redirectAndScrollToTop(route: string) {
    this.router.navigate([route]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  ListaProductos(){
    this.conexionProducto.getProducto().subscribe(
      res => {
        this.listaProductos = <any>res;
        this.listaux = <any>res;
      },
      err => console.log(err)
    );
  }

  getMarcas(marcas:number){
    console.log(marcas)
    this.listaProductos = this.listaux.filter(item => item.fk_marca == marcas  && item.estado === 'Activo');
    this.dataEntrante = this.listaProductos
    this.conexionProducto.enviarmarcas(this.dataEntrante);
  }

}
