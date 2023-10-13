import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConexComprobantesService } from 'src/app/services/conexiones/conex-comprobantes/conex-comprobantes.service';
import { ConexProductosService } from 'src/app/services/conexiones/conex-productos/conex-productos.service';
import { ConexPdfService } from 'src/app/services/conexiones/conex-pdf/conex-pdf.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { style } from '@angular/animations';


@Component({
  selector: 'app-cart-comprobantes',
  templateUrl: './cart-comprobantes.component.html',
  styleUrls: ['./cart-comprobantes.component.css']
})
export class CartComprobantesComponent implements OnInit {

  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  comprobantes: any[] = [];
  subcription: Subscription = new Subscription();
  p = 1;

  constructor(private conexComprobantes: ConexComprobantesService) { }

  ngOnInit(): void {
    this.listarComprobantes();
      this.subcription = this.conexComprobantes.refresh$.subscribe(()=>{
      this.listarComprobantes();
    });
  }

  /**
   * La función "listarComprobantes" recupera de un servidor un listado de recibos de venta con sus
   * datos y los asigna a la variable "comprobantes".
   */
  listarComprobantes(): void {
    this.subcription.add(
    this.conexComprobantes.listarComprobantesConDetalle().subscribe(
      (response: any) => {
        this.comprobantes = response.comprobantes;
      },
      (error: any) => {
        console.error('Error al obtener los comprobantes de venta:', error);
      }
    )
    );
  }

  /**
   * La función calcula el subtotal restando el 12% del total del monto total según el ID del
   * comprobante dado.
   */
  SubTotal(int:number){
    let precio=0;
    for(let i=0; i< this.comprobantes.length; i++){
      if(int ==  this.comprobantes[i].id_comprobante){
        precio = this.comprobantes[i].total * 0.12;
        precio = this.comprobantes[i].total - precio;
      }
    }
    return precio;
  }


/* La función `generatePDF()` es responsable de generar un documento PDF basado en el contenido de un
elemento específico en la página HTML. A continuación se muestra un desglose de lo que hace la
función: */
  generatePDF() {
    const content = this.pdfContainer.nativeElement;
    // Determine the width de la pantalla
    const screenWidth = window.innerWidth;
    const orientation = screenWidth < 990 ? 'portrait' : 'landscape';
    const doc = new jsPDF(orientation, 'mm', 'a4');
    // Add title to the PDF
    doc.setFontSize(18);
    
    // Define the width and height of the image based on the screen width
    let imgWidth = 190; // Default width
    let imgHeight = 0; // Default width
    let x = 0; // Default width
    if (screenWidth < 990) { // For small screens (e.g., phones)
      imgWidth = 140; // Adjust the width to fit the screen
      x=30;
      doc.text('COMPROBANTE ASTROSHOES', 105, 15, { align: 'center' });
    }else{
      doc.text('COMPROBANTE ASTROSHOES', 105, 15, { align: 'left' });
      imgWidth = 270;
      x=10;
    }
    // Convert the content to canvas
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', x, 25, imgWidth, imgHeight);
      // Save the PDF
      doc.save('comprobante.pdf');
    });
  }
}
