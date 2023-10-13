import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { ConexPdfService, PDF } from 'src/app/services/conexiones/conex-pdf/conex-pdf.service';

@Component({
  selector: 'app-tabla-pdf',
  templateUrl: './tabla-pdf.component.html',
  styleUrls: ['./tabla-pdf.component.css']
})
export class TablaPdfComponent implements OnInit {
  @Input() dataEntranteModificar:any;
  @Input() dataEntranteInsertar:any;
  subcription: Subscription = new Subscription();
  ListaPDF:PDF[]=[];
  ListaPDFOriginal:PDF[]=[];

  p = 1;
  index:number=0;
  index2:number=1;

  constructor( private ConexPdfService:ConexPdfService) { }

  ngOnInit(): void {
    this.listarPDF();
    this.listarPDFFiltro();

    this.subcription = this.ConexPdfService.refresh$.subscribe(()=>{
      this.listarPDF();
    this.listarPDFFiltro();
    });
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
    console.log('Observable cerrado')
  }

  /**
   * Es una función que obtiene una lista de pdf de un servicio y la asigna a una variable.
   * </código>
   */
  listarPDF(){
    console.log("---Listar PDF----");
    this.subcription.add(
      this.ConexPdfService.getPDF().subscribe(
        res => {

          this.ListaPDF = <any> res;

        },
          err => console.log(this.ListaPDF)
      )
    );
  }
  listarPDFFiltro(){
    console.log("---Listar pdf----");
    this.subcription.add(
      this.ConexPdfService.getPDF().subscribe(
        res => {

          this.ListaPDFOriginal = <any> res;
        },
          err => console.log(this.ListaPDFOriginal)
      )
    );
  }

  /**
   * Elimina un pdf en la base de datos
   * @param {number} id - número
   */
  eliminar(id:number){
    swal.fire({
      title: 'Seguro que quieres borrarlo?',
      text: "Seguro que quieres hacer esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then((result) => {
      if (result.value) {

      this.eliminarM(id)
      }
    })
  }


  eliminarM(id:number){
    this.ConexPdfService.deletePDF(id).subscribe(
      res => {
        swal.fire(
          'Eliminado!',
          'Se ha eliminado de tu lista de PDF.',
          'success'
        )
        this.listarPDF();
      },
      err => {
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salio mal al intetar eliminarlo',
        })
      }
    )
  }
/**
 * Toma una identificación, la asigna a una variable, emite la variable y registra la identificación.
 * @param {number} id - número
 */
  getIDPDF(id:number){
    this.dataEntranteModificar = id;

    this.ConexPdfService.disparadorPDF.emit(this.dataEntranteModificar)
  }

 /**
  * "Cuando el usuario hace clic en un botón, se llama a la función getIndex(), que envía el índice del
  * botón al servicio, que luego lo envía al componente que lo necesita".
  * </código>
  * @param {number} id2 - número
  */
  getIndex(id2:number){
    this.dataEntranteInsertar = id2;

    this.ConexPdfService.disparadorPDF.emit(this.dataEntranteInsertar)
  }

  enviar(){
    for(let i=0;i<this.ListaPDF.length;i++){
      this.index2 = this.ListaPDF[i].id_pdf+1;
    }

    this.getIndex(this.index2);
  }

  /**
   * Si el término de búsqueda no está vacío, filtre la lista de elementos solo a aquellos que
   * contienen el término de búsqueda. De lo contrario, muestra la lista completa.
   * @param {string} busca - cadena
   */
  filtrar(busca: string) {
    if (busca !== '') {
      const valorBusqueda = busca.toLowerCase(); // Convertir a minúsculas
      this.ListaPDF = this.ListaPDFOriginal.filter(item => item.version_pdf.toLowerCase().includes(valorBusqueda));
    } else {
      this.listarPDF();
    }
  }
}
