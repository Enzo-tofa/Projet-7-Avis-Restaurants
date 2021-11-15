import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
  ],
  imports: [
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    MatDialogModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCz-BbR4i-iYhWPSfXirbmzy97vfYvwWpQ',libraries: ['places'] }, ),
    BrowserAnimationsModule,
    
  ],bootstrap: [AppComponent]
})
export class AppModule { }
