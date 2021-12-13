import { Rating } from "./rating.interface";

export interface Marker {
    lat: number;
    lng: number;
    average: number;
    title?: string;
    adresse?: string;
    cp?: string;
    pays?: string;
    ratings: Rating[];
    id?: string;
  }