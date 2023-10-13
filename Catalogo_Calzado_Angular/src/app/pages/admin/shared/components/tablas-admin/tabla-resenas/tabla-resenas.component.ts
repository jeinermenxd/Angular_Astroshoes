import { Component, OnInit } from '@angular/core';
import { ConexResenasService, Resenas } from 'src/app/services/conexiones/conex-resenas/conex-resenas.service';
import { Subscription } from 'rxjs';
import { ConexUsuariosService, Usuario  } from 'src/app/services/conexiones/conex-usuarios/conex-usuarios.service';

@Component({
  selector: 'app-tabla-resenas',
  templateUrl: './tabla-resenas.component.html',
  styleUrls: ['./tabla-resenas.component.css']
})
export class TablaResenasComponent implements OnInit {

  ListaResenas:Resenas[]=[];
  Listafiltro:Resenas[]=[];
  ListaUsuario:Usuario[]=[];
  subcription: Subscription = new Subscription();
  p = 1;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  constructor(private cenexionresenas:ConexResenasService,private ConexUsuarioService:ConexUsuariosService) { }

  ngOnInit(): void {
    this.listarResenas();
    this.listarFiltro();
    this.listarUsuario();

    this.subcription = this.cenexionresenas.refresh$.subscribe(()=>{
      this.listarResenas();
      this.listarFiltro();

    });
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
    console.log('Observable cerrado')
  }
  listarUsuario(){
    console.log("---Listar usuarios----");
    this.ConexUsuarioService.getUsuario().subscribe(
      res => {

        this.ListaUsuario = <any>res;
      },
        err => console.log(this.ListaUsuario)
    );
  }
  listarResenas(){
    console.log("----Listar Reseñas----");
    this.subcription.add(
      this.cenexionresenas.getResenas().subscribe(
        res=>{

          this.ListaResenas= <any> res;
          console.log( this.ListaResenas)
        },
          err => console.log(err)
      )
    );
  }
  listarFiltro(){

    this.subcription.add(
      this.cenexionresenas.getResenas().subscribe(
        res=>{

          this.Listafiltro= <any> res;
        },
          err => console.log(err)
      )
    );
  }
  Usuarios(id:number){

    for(let i =0;i<this.ListaUsuario.length;i++){
        if(id ==this.ListaUsuario[i].id_usuario ){
          return this.ListaUsuario[i].nombres
        }
    }


  }
  filtrar(busca: string) {
    if (busca !== '') {
      const valorBusqueda = busca.toLowerCase(); // Convertir a minúsculas
      this.ListaResenas = this.Listafiltro.filter(item => item.comentario.toLowerCase().includes(valorBusqueda));
    } else {
      this.listarResenas();
    }
  }
}
