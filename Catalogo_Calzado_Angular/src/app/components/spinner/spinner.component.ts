import { Component} from '@angular/core';
import { SpinnerService } from '../../services/Interceptor/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
   <div class="overlay" *ngIf="isloading$ | async">
     <div class="spinner"></div>
  </div>`,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent{

  isloading$ = this.SpinnerSvc.isloading$;

  constructor(private SpinnerSvc: SpinnerService) { }

}
