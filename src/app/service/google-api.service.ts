import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private http: HttpClient) { }
  
  public getNearby(lat:number,lng : number){
    return this.http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=2000&key=AIzaSyCz-BbR4i-iYhWPSfXirbmzy97vfYvwWpQ`)
  }
}
