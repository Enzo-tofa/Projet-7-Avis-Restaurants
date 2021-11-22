import { Result } from "./result.interface";

export interface RootObject {
    html_attributions: any[];
    next_page_token: string;
    results: Result[];
    status: string;
}