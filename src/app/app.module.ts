import { BrowserModule } from '@angular/platform-browser';

import { NgModule, ApplicationRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AdjMapComponent } from './adjmap-app/adjmap-app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule} from '@angular/material/slider';
import { MatCardModule, MatMenuModule, MatToolbarModule, MatAutocompleteModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import {MatListModule} from '@angular/material/list';
import { ClaimFilterPipe } from './adjmap-app/filter.pipe';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import {
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule, MatNativeDateModule
  

} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
export class DemoMaterialModule {}
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    MatSliderModule,
    MatButtonModule, 
    MatCardModule, 
    MatMenuModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    AgmJsMarkerClustererModule,
    MatListModule,
    MatTabsModule,
    DragDropModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule,
    MatTableModule,
    NgbModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBp24pbzxjI2Lvz0SADUvR1dcfZoPZTHIQ'
    }),
    AgmSnazzyInfoWindowModule
  ],
  providers: [ClaimFilterPipe],
  declarations: [ 
    AppComponent,
    AdjMapComponent,
    ClaimFilterPipe ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

