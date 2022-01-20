import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootObject } from '../interfaces/resultGoogle.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private http: HttpClient) { }

  /** Permet d'effectuer une requetes google qui recupere les 20 restaurant les plus proches du point central de la carte */
  public getNearby(lat: number, lng: number): Observable<RootObject> {
    return this.http.get<RootObject>(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=2000&type=restaurant&key=AIzaSyCz-BbR4i-iYhWPSfXirbmzy97vfYvwWpQ`)
  }

  /** Permet de recuperer la liste des commentaires d'un restaurant en particulier */
  public getPlaceId(id: string): Observable<RootObject> {
    return this.http.get<RootObject>(`https://maps.googleapis.com/maps/api/place/details/json?fields=review%2Crating%2Cuser_ratings_total&place_id=${id}&key=AIzaSyCz-BbR4i-iYhWPSfXirbmzy97vfYvwWpQ`)
  }
}
