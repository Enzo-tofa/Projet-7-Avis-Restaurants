import { Geometry } from "./geometry.interface";
import { OpeningHours } from "./openinghour.interface";
import { Photo } from "./photo.interface";
import { PlusCode } from "./pluscode.interface";

export interface Result {
    geometry: Geometry;
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    photos: Photo[];
    place_id: string;
    reference: string;
    scope: string;
    types: string[];
    vicinity: string;
    business_status: string;
    plus_code: PlusCode;
    rating?: number;
    user_ratings_total?: number;
    opening_hours: OpeningHours;
    permanently_closed?: boolean;
    price_level?: number;
}
