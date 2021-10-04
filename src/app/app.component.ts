import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';

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
  filteredRestaurant!: marker[];
  average!:number[];

  ratings!: rating[];
  markers: marker[] = [
    {
      'lat': 43.40239666579384, 'lng': 5.055950264090761, 'title': 'Guénats', 'adresse': '8 cours du 4 septembre', 'cp': '13500 Martigues', 'pays': 'France', draggable: false,
      ratings: [
        {
          "stars": 4,
          "comment": "Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
        },
        {
          "stars": 5,
          "comment": "Tout simplement mon restaurant préféré !"
        }
      ]
    },
    {
      'lat': 43.40783539446187, 'lng': 5.056561229322723, 'title': 'Crush burger', 'adresse': '8 cours du 4 septembres', 'cp': '13500 Martigues', 'pays': 'France', draggable: false,
      ratings: [
        {
          "stars": 4,
          "comment": "Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
        },
        {
          "stars": 5,
          "comment": "Tout simplement mon restaurant préféré !"
        }
      ]
    },
    {
      'lat': 43.40834501420323, 'lng': 5.056354854297549, 'title': 'Snack la grillade', 'adresse': '5 Rue de Verdun', 'cp': '13500 Martigues', 'pays': 'France', draggable: false,
      ratings: [
        {
          "stars": 1,
          "comment": "Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
        },
        {
          "stars": 2,
          "comment": "Tout simplement mon restaurant préféré !"
        }
      ]
    },
    {
      'lat': 43.40282102324742, 'lng': 5.057338488304942, 'title': 'La grange', 'adresse': '50 Quai Général Leclerc', 'cp': '13500 Martigues', 'pays': 'France', draggable: false,
      ratings: [
        {
          "stars": 5,
          "comment": "Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer le fromage."
        },
        {
          "stars": 5,
          "comment": "Tout simplement mon restaurant préféré pour la fondue!"
        }
      ]
    }
  ];




  ngOnInit() {
    this.setCurrentLocation();
    this.getAverage();
  }




  getAverage() {

   this.markers.map(marker => {
      let somme = 0;
      let i = 0;
      let moyenne = 0;
     marker.ratings.map(rating => {
    })
    }
    )
  }



    checkMarkersInBounds(bounds: any) {

      this.filteredRestaurant = [];
      for (let m of this.markers) {

        let coordRestaurant = { lat: m.lat, lng: m.lng };

        if (bounds.contains(coordRestaurant)) {

          this.filteredRestaurant.push({ lat: m.lat, lng: m.lng, title: m.title, adresse: m.adresse, cp: m.cp, pays: m.pays, draggable: m.draggable, average: m.average, ratings: m.ratings });
          console.log(this.filteredRestaurant);
        }
      }
    }

    clickedMarker(title: string, index: number) {
      console.log(`clicked the marker: ${title || index}`)
    }

    selection(title: any) {
      console.log(title);
      this.selectedRestaurant = title;
    }
    /*mapClicked($event: MouseEvent) {
      this.markers.push({
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        draggable: false,
      });
  
      (mapClick)="mapClicked($event)"
    }*/

    markerDragEnd(m: marker, $event: MouseEvent) {
      console.log('dragEnd', m, $event);
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
interface marker {
  lat: number;
  lng: number;
  average?: number;
  title?: string;
  draggable: boolean;
  adresse?: string;
  cp?: string;
  pays?: string;
  ratings: rating[];
}

interface rating {
  stars: number;
  comment?: string;
}