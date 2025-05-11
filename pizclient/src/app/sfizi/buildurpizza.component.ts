import { Component, OnInit } from '@angular/core';
import { BuildService } from '../build.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-buildurpizza',
  templateUrl: './buildurpizza.component.html',
  styleUrls: ['./buildurpizza.component.css']
})
export class BuildurpizzaComponent implements OnInit {

  toppings: any[] = [];
  toppingtotal: number = 0;

  constructor(private buildservice: BuildService, private cartservice: CartService) { }

  ngOnInit(): void {
    // Carica i topping dal servizio
    this.buildservice.getToppings().subscribe((data) => {
      if (data && Array.isArray(data)) {
        this.toppings = data;
      } else {
        console.error('Errore: i dati dei topping non sono validi.');
      }
    });

    // Imposta il totale dei topping
    this.toppingtotal = this.cartservice.toppingtotal;
  }

  // Metodo per aggiungere un topping al carrello
  addToppingToCart(topping: any): void {
    this.cartservice.addToppings(topping);  // Aggiungi il topping al carrello
    this.toppingtotal = this.cartservice.getToppingsTotal();  // Ricalcola il totale
  }

  // Metodo per rimuovere un topping dal carrello
  removeToppingFromCart(topping: any): void {
    this.cartservice.removeToppings(topping);  // Rimuovi il topping dal carrello
    this.toppingtotal = this.cartservice.getToppingsTotal();  // Ricalcola il totale
  }

  // Mostra il totale dei topping
  getTotal(): void {
    this.cartservice.getToppingsTotal();
    this.toppingtotal = this.cartservice.toppingtotal;
  }
}
