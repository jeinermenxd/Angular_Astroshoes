import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ConexPdfService, PDF } from 'src/app/services/conexiones/conex-pdf/conex-pdf.service';


@Component({
  selector: 'app-registrar-pdf',
  templateUrl: './registrar-pdf.component.html',
  styleUrls: ['./registrar-pdf.component.css']
})
export class RegistrarPdfComponent implements OnInit {
  detalle:any={};
  ListaPDF:PDF[]=[];
  id:number=0;

 /* Un cargar PDF. */
  pdf:PDF={
      id_pdf:0,
      version_pdf:'',
      enlace_pdf:'',
      descripcion:''

    

  } 
 

  /**
   * La función constructora se llama cuando se crea una instancia del componente, y es el lugar
   * perfecto para colocar la lógica de inicialización.
   * @param {ConexPdfService} conexion - ConexPdfService
   */
  constructor( private conexion:ConexPdfService) {     
    this.ListaPDF =<any>  conexion.getPDF();    
    this.conexion.disparadorPDF.subscribe(data=>{
      this.detalle = data;
  })
    
  }


  ngOnInit(): void {
  }
  
  /**
   * Toma los datos del formulario y los envía al backend para almacenarlos en la base de datos.
   */
  agregarpdf(){
    try {  
      this.pdf.id_pdf = (this.detalle)
      console.log(this.pdf);
      
      if(this.pdf.enlace_pdf !='' && this.pdf.descripcion!=''&& this.pdf.version_pdf!=''){
        this.conexion.addPDF(this.pdf).subscribe();  
        this.Limpiar();
        swal.fire({
          icon: 'success',
          title: 'Registro de PDF Exitoso',
          text: 'Continuar'
        });
      }else{
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por Favor!! Ingrese todos los parametros'
        });
      }
    } catch (error) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingrese todos los parametros Por favor'
      });
    }
   
  }

 /**
  * Limpia los datos del formulario.
  */
  Limpiar(){
    this.pdf.id_pdf=0,
    this.pdf.version_pdf='',
    this.pdf.descripcion='';
    this.pdf.enlace_pdf='';
  }
}