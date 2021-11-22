import { Component, OnInit,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import  *  as  data  from  './data.json';
import { Marker } from './interfaces/marker.interface';
import { Rating } from './interfaces/rating.interface';
import { RootObject } from './interfaces/resultGoogle.interface';
import { GoogleApiService } from './service/google-api.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = "Projet 7 d'OpenClassrooms";
  lat!: number;
  lng!: number;
  selectedRestaurant!: string;
  zoom!: number;
  geo!: boolean;
  minimalvalue =0;
  maximalvalue =6;
  filteredRestaurant!: Marker[];
  ratings!: Rating[];
  markers: Marker[] = (data as any).default;


  constructor(private googleApiService : GoogleApiService){
    this.googleApiService.getNearby(this.lat,this.lng).subscribe((d : RootObject )=> {console.log(d.results);console.log(d)});
  }



  ngOnInit() {
    this.setCurrentLocation();
    this.getAverage();
  }

  onSubmit(e: NgForm, rating : Rating[]) {
    rating.push(e.value);
    this.getAverage();

  }

  getAverage() {

    this.markers.map(marker => {
      marker.ratings.map(rating => {
        const somme = marker.ratings.reduce((accumulateur, valeurCourante) => {
          return accumulateur + valeurCourante.stars;
        }, 0);
        marker.average = somme / marker.ratings.length;
      }
      )
    })
  }


  checkMarkersInAverage(minimalvalue: any, maximalvalue: any) {
    this.filteredRestaurant = [];
    for (let m of this.markers) {
      if (+this.maximalvalue >= m.average && +this.minimalvalue <= m.average) {
        this.filteredRestaurant.push(m);
      }
    };
  }


  getSrcByRestaurant(markers: Marker) {
    return `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${markers.lat},${markers.lng}&fov=80&heading=70&pitch=0&key=AIzaSyDMx0HGF6b43UjMAsUZ_56r9uQTZUtJY4k`
  }

  checkMarkersInBounds(bounds: any) {
    this.filteredRestaurant = [];
    for (let m of this.markers) {
      let coordRestaurant = { lat: m.lat, lng: m.lng };
      if (bounds.contains(coordRestaurant) && +this.maximalvalue >= m.average && +this.minimalvalue <= m.average) {
        this.filteredRestaurant.push(m);
      }
    };
    this.googleApiService.getNearby(this.lat,this.lng).subscribe(d => {console.log(d.results);console.log(this.lat)});
  }

  clickedMarker(title: string, index: number) {
    console.log(`clicked the marker: ${title || index}`)
  }

  selection(title: any) {
    this.selectedRestaurant = title;
  }


  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
        this.geo = true;
      },
        (errorCallback) => {
          this.lat = 1;
          this.lng = 1;
          this.geo = false;
        }, { timeout: 10000 })
    }
  }
}














