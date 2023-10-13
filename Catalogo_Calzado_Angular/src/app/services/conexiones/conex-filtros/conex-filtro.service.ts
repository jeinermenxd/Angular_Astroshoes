import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { API_URL } from '../../api';
import { Subject } from 'rxjs';
import{tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ConexFiltroService {

  /* Una variable que se utiliza para almacenar la URL de la API. */
  private url=API_URL+'productos/filtrar/';

  /* Un Sujeto que se usa para emitir un evento al componente principal. */
  private _refresh$ = new Subject<void>();

  constructor(private http:HttpClient) { }

   /* Una función que agrega una nueva marca a la base de datos. */
   filtro(Filtro:Filtro){
    return this.http.post(this.url,Filtro)
    .pipe(
      tap(()=>{
        this._refresh$.next();
      })
    );
  };

}
/* Es una declaración de depuración. */
console.log("Conexion de Marcas!");

/* Una declaración de depuración. */
export interface Filtro{
  talla: string,
  fk_marca: number,
  costo: string,
  color: string,
  genero: string
};



