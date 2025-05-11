// src/app/services/pizza.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Questo rende il servizio disponibile in tutta l'app
})
export class PizzaService {

  constructor(private http: HttpClient) { }

  // Funzione per ottenere una pizza dal DB per id
  getPizzaById(id: string): Observable<any> {  // Cambiato da number a string, se l'ID è una stringa nel DB
    return this.http.get<any>(`http://localhost:3000/pizza/${id}`);  // Cambia l'URL per allinearlo con il backend
  }
}
