import { Component, Inject, OnInit, } from '@angular/core';
import { FormBuilder, NgForm, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Marker } from '../interfaces/marker.interface';
import { RestaurantService } from '../service/restaurant.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  lat!: number;
  lng!: number;
  public addRestaurantForm: FormGroup = this.initForm();



  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public restaurantService: RestaurantService,
    private formBuilder: FormBuilder
  ) { }

  public hasError(controleName: string, errorName: string): boolean {
    return this.addRestaurantForm.controls[controleName].hasError(errorName);
  }

  public onSubmit() {
    const restaurantAdded: Marker = this.addRestaurantForm.value;
    const newresto: Marker = {
      lat: this.data.lat, lng: this.data.lng, title: restaurantAdded.title, ratings: [], average: 0, adresse: restaurantAdded.adresse, cp: restaurantAdded.cp,
      pays: restaurantAdded.pays, id: "0"
    }
    this.restaurantService.addOneRestaurant(newresto);
    this.dialogRef.close();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      title: [
        '',
        [
          Validators.maxLength(50),
          Validators.required
        ],
      ],
      adress: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.required
        ],
      ],
      cp: [
        '',
        [
          Validators.maxLength(5),
          Validators.required
        ],
      ],
      pays: [
        '',
        [
          Validators.maxLength(30),
          Validators.required
        ],
      ]
    });
  }




  onNoClick(): void {
    this.dialogRef.close();
  }
}
export interface DialogData {
  lat: number;
  lng: number;
}