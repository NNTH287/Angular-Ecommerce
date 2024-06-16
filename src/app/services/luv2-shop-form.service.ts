import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetReponseCoutries>(this.countriesUrl).pipe(
      map(respone => respone._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetReponseStates>(searchStateUrl).pipe(
      map(respone => respone._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12 ; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    let starYear = new Date().getFullYear();
    let endYear = starYear + 10;

    for (let year = starYear; year <= endYear ; year++) {
      data.push(year);
    }

    return of(data);
  }
}

interface GetReponseCoutries {
  _embedded: {
    countries: Country[];
  }
}

interface GetReponseStates {
  _embedded: {
    states: State[];
  }
}