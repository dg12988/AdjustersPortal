import { Component, ViewChild, Inject } from '@angular/core';
import 'hammerjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent{
  title: string = 'ClaimswireMaps';



  
  feedbackDialog(){
    window.open("https://web.simsol.com/eforms/claimswire-mapping-beta-feedback/61/","_blank");
  }
  onDone(){
    window.location.href = 'https://REDACTED.simsol.com/claimswire/app/assignments';
  }
}
  

