import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { API_URL } from '../../api';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators'

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

@Injectable({
  providedIn: 'root'
})

export class ConexComprobantesService {

  private url = API_URL + 'comprobante/';
  private _refresh$ = new Subject<void>();
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  getEmailFromToken() {
    const token = this.cookieService.get('token');
    if (!token) {
      return null;
    }
    const decoded = jwt_decode(token) as TokenPayload;
    return decoded.user.email;
  }

  geIdFromToken() {
    const token = this.cookieService.get('token');
    if (!token) {
      return null;
    }
    const decoded = jwt_decode(token) as TokenPayload;
    return decoded.user.id;
  }
  crearComprobanteVentaConDetalle(total: number, carrito: any[]): Observable<any> {
    const email = this.getEmailFromToken();
    const body = { email, total, carrito };
    return this.http.post(`${this.url}`, body)
    .pipe(
      tap(()=>{
        this._refresh$.next();
      })
    );

  }

  listarComprobantesConDetalle(): Observable<any> {
    const id = this.geIdFromToken();
    return this.http.get(`${this.url}${id}`)
  }

  listarComprobantes() {
    return this.http.get(this.url);
  }

   /**
   * La función actualizar $ devuelve el valor de la variable privada _refresh $.
   * @returns El observable que se devuelve es el que se crea en el constructor.
   */
   get refresh$(){
    return this._refresh$;
  }


}
