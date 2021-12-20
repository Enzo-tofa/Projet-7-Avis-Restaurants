import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import *  as  data from './data.json';
import { Marker } from './interfaces/marker.interface';
import { Rating } from './interfaces/rating.interface';
import { Result } from './interfaces/result.interface';
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
  minimalvalue = 0;
  maximalvalue = 6;
  filteredRestaurant!: Marker[];
  hiddenRestaurant!: Marker[];
  ratings!: Rating[];
  markers: Marker[] = (data as any).default;
  googleRestau!: Marker[];
  googleApiRestaurant!: Result[];
  detailApiRestaurant!: Result[];

  
  constructor(private googleApiService: GoogleApiService, public dialog: MatDialog) {
    this.googleApiService.getNearby(this.lat, this.lng).subscribe((d: RootObject) => {
    })
  }


  ngOnInit() {
    this.setCurrentLocation();
    this.getAverage();
    }
  

  openDialog(lat:number, lng: number){
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {lat: this.lat, lng: this.lng},      
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      this.filteredRestaurant.push(result);
      console.log(result);
      this.lat = result;
    });
  }

  onSubmit(e: NgForm, rating: Rating[]) {
    rating.push(e.value);
    this.getAverage();
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }


  /** Permet de reinitialiser le filtre des notes */
  resetfilter() {
    this.maximalvalue = 5;
    this.minimalvalue = 1;
    this.checkMarkersInAverage(1, 5);
  }

  /** Permet de faire la moyenne des commentaires */
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

  /** Permet de vérifier que les restaurant selectionné correspondent au filtre de la note */
  checkMarkersInAverage(minimalvalue: any, maximalvalue: any) {
    this.filteredRestaurant=[];
    for (let h of this.hiddenRestaurant) {
      if (+this.maximalvalue >= h.average && +this.minimalvalue <= h.average) {
        this.filteredRestaurant.push(h);
        console.log(h)
      }
    };


  }

  /** Permet de recupérer les images street view */
  getSrcByRestaurant(markers: Marker) {
    return `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${markers.lat},${markers.lng}&fov=80&heading=70&pitch=0&key=AIzaSyDMx0HGF6b43UjMAsUZ_56r9uQTZUtJY4k`
  }



  /** Permet de vérifier que le marker est dans la limite de la carte google maps */
  checkMarkersInBounds(bounds: any) {

    console.log(this.filteredRestaurant);
    console.log(this.hiddenRestaurant);
    this.filteredRestaurant = [];
    this.hiddenRestaurant = [];
    console.log(this.filteredRestaurant);
    console.log(this.hiddenRestaurant);

    for (let m of this.markers) {
      let coordRestaurant = { lat: m.lat, lng: m.lng };
      let present = this.filteredRestaurant.includes(m);
      if (bounds.contains(coordRestaurant) && +this.maximalvalue >= m.average && +this.minimalvalue <= m.average && !present) {
        this.filteredRestaurant.push(m);
        this.hiddenRestaurant.push(m);
      }
    }


    let center = Object.values(bounds);
    let latlngbounds: any = Object.values(center)
    let latcenter = (latlngbounds[0].g + latlngbounds[0].h) / 2;
    let lngcenter = (latlngbounds[1].g + latlngbounds[1].h) / 2;

    this.googleApiService.getNearby(latcenter, lngcenter).subscribe(d => {
      this.googleApiRestaurant = d.results;
      this.googleApiRestaurant.map(result => {
        let googleRestau =
        {
          "lat": result.geometry.location.lat, "lng": result.geometry.location.lng, "title": result.name, "adresse": result.vicinity, "cp": "13500 Martigues", "pays": "France", "average": Number(result.rating), "id": result.place_id,
          "ratings": []
        };
        /*
        this.googleApiService.getPlaceId(googleRestau.id).subscribe(e => {
          this.detailApiRestaurant = e.results;
          console.log(e)
        });*/
      
        let coordRestaurant = { lat: googleRestau.lat, lng: googleRestau.lng };

        if (this.filteredRestaurant.includes(googleRestau)) {console.log("do nothing")}
        else{
          if (+this.maximalvalue >= googleRestau.average && +this.minimalvalue <= googleRestau.average) {
          if (bounds.contains(coordRestaurant)) {
            this.filteredRestaurant.push(googleRestau);
            this.hiddenRestaurant.push(googleRestau);
          }}
        };
      })
    });
    

  }


  /** Permet de choisir le restaurant selectionné */
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














function results(results: any) {
  throw new Error('Function not implemented.');
}

