import { EventEmitter, Injectable, Output } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { API_URL } from '../../api';
import { Subject } from 'rxjs';
import{tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ConexResenasService {

/* Un emisor de eventos que se utiliza para emitir un evento al componente principal. */
@Output() disparadorMarca: EventEmitter<any> = new EventEmitter();

/* Una variable que se utiliza para almacenar la URL de la API. */
 private url=API_URL+'resenas/';

/* Un Sujeto que se usa para emitir un evento al componente principal. */
 private _refresh$ = new Subject<void>();

 constructor(private http:HttpClient) { }

/* Una función que devuelve los datos de la API. */
 getResenas(){
   return this.http.get(this.url);
 };

/* Una función que devuelve los datos de la API. */
 getUnResenas(id_resenas:number){
   return this.http.get(this.url+id_resenas)
 };

/* Una función que agrega una nueva marca a la base de datos. */
 addResenas(resenas:Resenas){
   return this.http.post(this.url,resenas)
   .pipe(
     tap(()=>{
       this._refresh$.next();
     })
   );
 };


 /**
  * La función actualizar $ devuelve el valor de la variable privada _refresh $.
  * @returns El observable que se devuelve es el que se crea en el constructor.
  */
 get refresh$(){
   return this._refresh$;
 }

}

/* Es una declaración de depuración. */
console.log("Conexion de Resenas!");

/* Una declaración de depuración. */
export interface Resenas{
  id_resenas:number;
  fk_id_usuario:number;
  nombre:string;
  estrellas:number;
  comentario:string
};

