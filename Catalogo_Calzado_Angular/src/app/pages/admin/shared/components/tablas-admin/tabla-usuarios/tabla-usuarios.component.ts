import { Component, OnInit } from '@angular/core';
import { ConexUsuariosService, Usuario  } from 'src/app/services/conexiones/conex-usuarios/conex-usuarios.service';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.css']
})
export class TablaUsuariosComponent implements OnInit {

  p=1;
  ListaUsuario:Usuario[]=[];
  ListaUsuarioOriginal:Usuario[]=[];
  subcription: Subscription = new Subscription();
  cargar: any = [];
  boolean2: boolean = false//bandera de Estado;

  /**
   * La función constructora es una función predeterminada de la clase, que se llama cuando se crea una
   * instancia de la clase.
   * @param {ConexUsuariosService} ConexUsuarioService - Este es el servicio que se inyectará en el
   * componente.
   * @param {ConexFavService} ConexFavService - Este es el servicio que se utilizará para conectarse a
   * la base de datos.
   */
  constructor(private ConexUsuarioService:ConexUsuariosService) { }

  /**
   * NgOnInit(): vacío {
   *     this.listarUsuario();
   *     esto.listarFav();
   *   }
   */
  ngOnInit(): void {
    this.listarUsuario();
    this.listarUsuariofiltro();
    this.subcription = this.ConexUsuarioService.refresh$.subscribe(()=>{
      this.listarUsuario();
      this.listarUsuariofiltro();
    });
  }

 /**
  * Estoy tratando de obtener los datos de la base de datos y mostrarlos en una tabla.
  */
  listarUsuario(){
    console.log("---Listar usuarios----");
    this.subcription.add(
    this.ConexUsuarioService.getUsuario().subscribe(
      res => {

        this.ListaUsuario = <any>res;
      },
        err => console.log(this.ListaUsuario)
    )
    );
  }
  listarUsuariofiltro(){
    console.log("---Listar usuarios----");
    this.subcription.add(
    this.ConexUsuarioService.getUsuario().subscribe(
      res => {

        this.ListaUsuarioOriginal = <any>res;
      },
        err => console.log(this.ListaUsuarioOriginal)
    )
    );
  }

  /**
   * Quiero eliminar un usuario y todos los favoritos asociados a ese usuario.
   * @param {number} id - número
   */
  eliminar(id: number) {
    swal.fire({
      title: 'Seguro que quieres borrarlo?',
      text: 'Seguro que quieres hacer esto!', color:'red',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, bórralo!',
    }).then((result) => {
      if (result.value) {
        this.ConexUsuarioService.deleteUsuario(id).subscribe(
          (res) => {
            swal.fire(
              'Eliminado!',
              'Se ha eliminado de tu lista de Usuario.',
              'success'
            );
            this.listarUsuario();
          },
          (err) => {
            swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Algo salió mal al intentar eliminarlo!',
            });
          }
        );
      }
    });
  }
  obtenerAdmin(id:number) {
    for(let i =0;i<this.ListaUsuario.length;i++){
      if(id ==this.ListaUsuario[i].id_usuario ){
        if(this.ListaUsuario[i].rol =='admin'){
          return true;
          break;
        }else{
          return false;
          break;
        }
      }
  }
}

     /**
   * Si el valor es verdadero, establezca la oferta del producto en "Oferta", de lo contrario,
   * configúrelo en "Sin oferta".
   * @param {boolean} valor - booleano
   */
     obtenerEstado(valor: boolean,id:number) {
      for(let i =0;i<this.ListaUsuario.length;i++){
        if(id ==this.ListaUsuario[i].id_usuario ){
          this.cargar = this.ListaUsuario[i];
          break;
        }
    }
      let aux: any[]=[];
      if(valor == true){

        this.cargar.rol ='admin';
          aux=[this.cargar]
          this.ConexUsuarioService.editUsuario(id,aux).subscribe(
            res=>{
              console.log(res);

            },
            err => {
              console.log(err);
            }
          )

      }else{
        this.cargar.rol ='user';
        aux=[this.cargar]
        this.ConexUsuarioService.editUsuario(id,aux).subscribe(
          res=>{
            console.log(res);

          },
          err => {
            console.log(err);
          }
        )
      }
    }


  /**
   * Si el término de búsqueda no está vacío, filtre la lista de usuarios por el término de búsqueda;
   * de lo contrario, enumere todos los usuarios.
   * @param {string} busca - cadena
   */
  filtrar(busca: string) {
  if (busca !== '') {
    const valorBusqueda = busca.toLowerCase(); // Convertir a minúsculas
    this.ListaUsuario = this.ListaUsuarioOriginal.filter(item => item.nombres.toLowerCase().includes(valorBusqueda));
  } else {
    this.listarUsuario();
  }
}
}
