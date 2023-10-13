import { Injectable, EventEmitter, Output } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { API_URL } from '../../api';
import { Subject } from 'rxjs';
import{tap} from 'rxjs/operators'

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({

  providedIn: 'root'
})

export class ConexPdfService {

  /* Un emisor de eventos que se utiliza para emitir un evento al componente principal. */
  @Output() disparadorPDF: EventEmitter<any> = new EventEmitter();
  
  private url=API_URL+'pdf/';
  private _refresh$ = new Subject<void>();
  constructor(private http:HttpClient) { }
  getPDF(){
    return this.http.get(this.url);
  };

 /* Una función que devuelve los datos de la API. */
  getUNPDF(id_pdf:number){
    return this.http.get(this.url+id_pdf)
  };
  
  addPDF(pdf:PDF){
    return this.http.post(this.url,pdf)
    .pipe(
      tap(()=>{
        this._refresh$.next();
      })
    );
  };

  /* Eliminación de un PDF  de la base de datos.  (cuando pases esto al original borra estos comentarios gil)*/
  deletePDF(id:number){
    return this.http.delete(this.url+id);
  };

  editPDF(id:number, pdf:PDF){
    return this.http.put(this.url+id,pdf)
    .pipe(
      tap(()=>{
        this._refresh$.next();
      })
    );
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
console.log("Conexion de PDF!");

/* Una declaración de depuración. */
export interface PDF{
  id_pdf:number;
  version_pdf:string;
  enlace_pdf:string;
  descripcion:string;
};