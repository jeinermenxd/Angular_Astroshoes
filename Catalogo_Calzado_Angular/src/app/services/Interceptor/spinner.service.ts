import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService{

  isloading$ = new Subject<boolean>();
  constructor() { }

  public llamarSpinner(){
    this.isloading$.next(true);
    
  }

  public detenerSpinner(){
    this.isloading$.next(false);
  }
}
