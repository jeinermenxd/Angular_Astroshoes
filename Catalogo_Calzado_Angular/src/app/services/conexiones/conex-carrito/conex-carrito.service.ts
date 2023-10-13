import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { API_URL } from '../../api';
import { Subject } from 'rxjs';
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
export class ConexCarritoService {
  private url = API_URL + 'carrito/';
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

  addCarrito(idProducto: number, email: string) {
    const body = { id_producto: idProducto, email: email };
    return this.http.post(this.url, body);
  }

  listarCarrito() {
    const id = this.geIdFromToken();
    return this.http.get(this.url + id)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  deleteCarrito(id: number) {
    return this.http.delete(this.url + id);
  };

  getCarrito() {
    return this.http.get(this.url);
  };
  updateCarritoCantidad(id_carrito: number, cantidad: number) {
    const body = { cantidad: cantidad,id_carrito:id_carrito };
    return this.http.put(this.url + id_carrito, body);
  }

  get refresh$() {
    return this._refresh$;
  }

}

console.log("Conexion de Carrito!");

export interface Carrito {
  id_carrito: number;
  fk_id_producto: number;
  fk_id_usuario: number;
  cantidad: number;
  estado: string;
}
