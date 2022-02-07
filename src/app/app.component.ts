import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import *  as  data from './data.json';
import { Marker } from './interfaces/marker.interface';
import { Rating } from './interfaces/rating.interface';
import { Result } from './interfaces/result.interface';
import { RootObject } from './interfaces/resultGoogle.interface';
import { ModalComponent } from './modal/modal.component';
import { GoogleApiService } from './service/google-api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantService } from './service/restaurant.service';
import { Results } from './interfaces/results.interface';

export interface DialogData {
}


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
  hiddenRestaurant!: Marker[];
  ratings!: Rating[];
  markers: Marker[] = (data as any).default;
  googleRestau!: Marker[];
  googleApiRestaurant!: Result[];
  detailApiRestaurant!: Results;


  constructor(private googleApiService: GoogleApiService, public dialog: MatDialog, public restaurantService: RestaurantService) {
    this.googleApiService.getNearby(this.lat, this.lng).subscribe((d: RootObject) => {
    })
  }


  ngOnInit() {
    this.setCurrentLocation();
    this.getAverage();
  }


  /** Permet l'ajout du restaurant a l'aide d'une modale */
  openDialog(lat: number, lng: number) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: { lat: lat, lng: lng },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.markers.push(result);
      this.lat = result;
    });
  }

  /** Permet de valider le formulaire de commentaire */
  onSubmit(e: NgForm, rating: Rating[]) {
    rating.push(e.value);
    this.getAverage();
  }

  /** Permet le déplacement du point de vue de l'utilisateur sur la carte google maps */
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
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
    const filteredRestaurant: Marker[] = [];
    for (let h of this.hiddenRestaurant) {
      if (+this.maximalvalue >= h.average && +this.minimalvalue <= h.average) {
        filteredRestaurant.push(h);
      }
    };
    this.restaurantService.setRestaurants(filteredRestaurant);

  }

  /** Permet de recupérer les images street view */
  getSrcByRestaurant(markers: Marker) {
    return `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${markers.lat},${markers.lng}&fov=80&heading=70&pitch=0&key=AIzaSyDMx0HGF6b43UjMAsUZ_56r9uQTZUtJY4k`
  }



  /** Permet de vérifier que le marker est dans la limite de la carte google maps */
  checkMarkersInBounds(bounds: any) {
    const filteredRestaurant: Marker[] = [];
    this.hiddenRestaurant = [];

    /** Permet de vérifier si les marker du data.json sont dans les limites de la carte */
    for (let m of this.markers) {
      if (m) {
        let coordRestaurant = { lat: m.lat, lng: m.lng };
        let present = filteredRestaurant.includes(m);
        if (bounds.contains(coordRestaurant) && +this.maximalvalue >= m.average && +this.minimalvalue <= m.average && !present) {
          filteredRestaurant.push(m);
          this.hiddenRestaurant.push(m);
        }
      }
    }
    this.restaurantService.setRestaurants(filteredRestaurant);

    /**  Permet de récupérer le point central de la carte*/
    let center = Object.values(bounds);
    let latlngbounds: any = Object.values(center)
    let latcenter = (latlngbounds[0].g + latlngbounds[0].h) / 2;
    let lngcenter = (latlngbounds[1].g + latlngbounds[1].h) / 2;

    /** Permet une requete avec l'API google pour recupérer les 20 restaurants les plus proches du centre */
    this.googleApiService.getNearby(latcenter, lngcenter).subscribe(d => {
      if (d.results != undefined) {
        this.googleApiRestaurant = d.results;
      }

      this.googleApiRestaurant.map(result => {

        /** On crée un marker avec le resultat de notre requete */
        let googleRestau: Marker =
        {
          "lat": result.geometry.location.lat, "lng": result.geometry.location.lng, "title": result.name, "adresse": result.vicinity, "cp": "13500 Martigues", "pays": "France", "average": Number(result.rating), "id": result.place_id,
          "ratings": []
        };


        /** On effectue une requete google search avec l'id de notre restaurant pour récuperer les commentaires */
        this.googleApiService.getPlaceId(googleRestau.id).subscribe(e => {
          if (e.result != undefined) {
            this.detailApiRestaurant = e.result;
            console.log(e.result)
            this.detailApiRestaurant.reviews?.map(reviews => {
              let ratingsu: Rating =
              {
                stars: reviews.rating, "comment": reviews.text
              }
              googleRestau.ratings.push(ratingsu);
            })
          }
        });


        /** On recupère les coordonées du restaurant et on vérifie qu'il est présent dans la carte */
        let coordRestaurant = { lat: googleRestau.lat, lng: googleRestau.lng };

        if (filteredRestaurant.includes(googleRestau)) { console.log("do nothing") }
        else {
          if (+this.maximalvalue >= googleRestau.average && +this.minimalvalue <= googleRestau.average) {
            if (bounds.contains(coordRestaurant)) {
              filteredRestaurant.push(googleRestau);
              this.hiddenRestaurant.push(googleRestau);
            }
          }
        };
      })
      this.restaurantService.setRestaurants(filteredRestaurant);
    });


  }


  /** Permet de choisir le restaurant selectionné */
  selection(title: any) {
    this.selectedRestaurant = title;
  }


  /** On met en place la position géolocaliser de l'utilisateur  */
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












