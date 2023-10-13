import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConexPdfService, PDF } from 'src/app/services/conexiones/conex-pdf/conex-pdf.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-modificar-pdf',
  templateUrl: './modificar-pdf.component.html',
  styleUrls: ['./modificar-pdf.component.css']
})
export class ModificarPdfComponent implements OnInit {
  cargar:any=[];
  id_entrada:number=0;

  subcription: Subscription = new Subscription();

  /* Una variable que se utiliza para almacenar los datos que se van a modificar. */
  pdf:PDF={
    id_pdf:0,
    version_pdf:'',
    enlace_pdf:'',
    descripcion: ''
  } 
  
 /**
  * Es un constructor que toma un parámetro de tipo ConexPdfService y lo asigna a una variable
  * privada llamada conexión.
  * @param {ConexPdfService} conexion - es el nombre del servicio
  */
  constructor( private conexion:ConexPdfService) {
    this.CargarPDF();
  }

  /**
   * Se suscribe a un disparador, luego obtiene los datos del disparador y luego se suscribe a los
   * datos de la variable "cargar".
   */
  CargarPDF(){
    this.subcription.add(
      this.conexion.disparadorPDF.subscribe(data=>{
        this.conexion.getUNPDF(data).subscribe(
          res=>{
            console.log(res)         
            this.cargar=res;               
          },
          err => console.log('No existe')
        );
      })
    );
  }
  
  ngOnInit(): void {   
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
    console.log('Observable cerrado')
  }
  
 /**
  * Quiero actualizar los datos en la base de datos, pero quiero actualizar solo los datos que no
  * están vacíos, es decir, si el usuario no quiere cambiar los datos, no los actualiza. R: Puede usar
  * el método para obtener las claves del objeto y luego iterar sobre ellas para verificar si el valor está vacío o no.
  * @param {number} id - número,
  * @param {string} nombre - cadena,
  * @param {string} descripcion - cadena
  */
  modificar(id:number,version_pdf:string,enlace_pdf:string,descripcion:string){
     //Extrae text//
     this.pdf.id_pdf = id;
     this.id_entrada =id;
     this.pdf.version_pdf= version_pdf;
     this.pdf.enlace_pdf = enlace_pdf;
     this.pdf.descripcion = descripcion;
    
    swal.fire({
      title: 'Seguro que quieres modificarlo?',
      text: "Seguro que quieres hacer esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, modificarlo!'
    }).then((result) => {
      if (result.value) {         
        try {   
          if(this.pdf.id_pdf >=0 && this.pdf.version_pdf !='' && this.pdf.enlace_pdf !=''&& this.pdf.descripcion!=''){
            this.conexion.editPDF(this.id_entrada,this.pdf).subscribe(
              res=>{
                console.log(res);       
              },
              err=>console.log(err)
            );
            
            swal.fire({
              icon: 'success',
              title: 'Se modificó el registro del PDF Exitosamente',
              text: 'Continuar'
            });
          }else{
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Por Favor!! Ingrese todos los parámetros'
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
    })    
  }
}