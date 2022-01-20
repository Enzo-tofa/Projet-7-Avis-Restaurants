import { Marker } from '../interfaces/marker.interface';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";



@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private restaurantsSubject = new BehaviorSubject<Marker[]>([]);

  public setRestaurants(restaurants: Marker[]) {
    this.restaurantsSubject.next(restaurants);
  }

  /** Permet de recupérer la liste des restaurants */
  public getRestaurants(): Observable<Marker[]> {
    return this.restaurantsSubject.asObservable();
  }

  /** Permet d'ajouter un restaurant */
  public addOneRestaurant(restaurant: Marker) {
    this.restaurantsSubject.next([...this.restaurantsSubject.value, restaurant]);
  }
}