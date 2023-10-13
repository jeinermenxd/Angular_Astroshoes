import { EventEmitter, Injectable, Output } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { API_URL } from '../../api';
import { BehaviorSubject, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConexUsuariosService {

  /* Una variable a la que se le asigna un valor. */
  private url=API_URL+'usuario/';
  /* Un Sujeto que se usa para emitir un evento al componente principal. */
  private _refresh$ = new Subject<void>();

  constructor(private http:HttpClient) { }


  /* Un emisor de eventos que se utiliza para emitir un evento al componente principal. */
  @Output() disparadorUsuario: EventEmitter<any> = new EventEmitter();

  private datosFuente = new BehaviorSubject<any>(''); // BehaviorSubject para almacenar y emitir los datos
  datos$ = this.datosFuente.asObservable(); // Observable para que los componentes se suscriban
  enviarDatos(datos: string ) {

    this.datosFuente.next(datos);
  }

  /* Una función que devuelve el valor de la variable `url` */
  getUsuario(){
    return this.http.get(this.url);
  };

  /* Una función que actualiza los datos en la base de datos. */
  editUsuario(id:number, usuario:any){
    return this.http.put(this.url+id,usuario)
    .pipe(
      tap(()=>{
        this._refresh$.next();
      })
    );
  };

  /* Una función que elimina un usuario de la base de datos. */
  deleteUsuario(id:number){
    return this.http.delete(this.url+id);
  };

   //Refrescar tablas//

  /**
   * La función actualizar $ devuelve el valor de la variable privada _refresh $.
   * @returns El observable que se devuelve es el que se crea en el constructor.
   */
  get refresh$(){
    return this._refresh$;
  }

}
/* Es una declaración de depuración. */
console.log("Conexion de Usuario!");
/* Definición de una interfaz para Usuario */
export interface Usuario{
  id_usuario:number;
  nombres: string
  apellidos:string;
  email:string;
  password:string;
  created_at:string,
  rol:string;
};



