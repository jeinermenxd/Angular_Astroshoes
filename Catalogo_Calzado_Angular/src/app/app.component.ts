import { Component} from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Catalogo_Calzado';
  
  public carga: Boolean  = false;

  ngOnInit(): void{
    AOS.init();
    window.addEventListener('load', AOS.refresh)
    this.carga = true;
    setTimeout(() => {
      this.carga = true;
    }, 5000);

  }
}

