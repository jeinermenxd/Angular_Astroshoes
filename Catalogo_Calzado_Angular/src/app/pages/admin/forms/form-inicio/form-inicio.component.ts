import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-form-inicio',
  templateUrl: './form-inicio.component.html',
  styleUrls: ['./form-inicio.component.css']
})
export class FormInicioComponent implements OnInit {
  load: Boolean  = false;
  constructor(){}
  ngOnInit(): void {
  }
}
