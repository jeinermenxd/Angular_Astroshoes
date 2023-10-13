import { Component, OnInit } from '@angular/core';
import { ConexMarcaService,Marca } from 'src/app/services/conexiones/conex-marca/conex-marca.service';
@Component({
  selector: 'app-ninos',
  templateUrl: './ninos.component.html',
  styleUrls: ['./ninos.component.css']
})
export class NinosComponent implements OnInit {


  constructor(private Conex:ConexMarcaService) { }

  ngOnInit(): void {
  }

}
