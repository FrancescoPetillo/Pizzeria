import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { PizzaService } from '../pizza.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart = [];
  toppingsCart = []; // <-- Sfizi separati
  total: number;
  toppingtotal: number;

  constructor(
    private cartservice: CartService,
    private router: Router,
    private pizzaService: PizzaService
  ) {}

  ngOnInit(): void {
    this.cart = this.cartservice.cart.filter(p => !p.isTopping); // Solo pizze
    this.toppingsCart = this.cartservice.cart.filter(p => p.isTopping); // Solo sfizi
    this.total = this.cartservice.getTotal();
    this.toppingtotal = this.cartservice.getToppingsTotal();

    this.loadPizzaImages();
    this.loadToppingImages();
  }

  loadPizzaImages(): void {
    this.cart.forEach((pizza) => {
      this.pizzaService.getPizzaById(pizza.id).subscribe(
        (pizzaData) => {
          pizza.image = pizzaData.image;
        },
        (error) => {
          console.error(`Errore immagine pizza ${pizza.id}:`, error);
        }
      );
    });
  }

  loadToppingImages(): void {
    this.toppingsCart.forEach((topping) => {
      this.pizzaService.getPizzaById(topping.id).subscribe(
        (toppingData) => {
          topping.image = toppingData.image;
        },
        (error) => {
          console.error(`Errore immagine topping ${topping.id}:`, error);
        }
      );
    });
  }

  remove(item): void {
    this.cartservice.removeFromCart(item);
    this.refreshCart();
  }

  onPlus(item): void {
    this.cartservice.increse(item);
    this.refreshCart();
  }

  onMinus(item): void {
    this.cartservice.decrese(item);
    this.refreshCart();
  }

  refreshCart(): void {
    this.cart = this.cartservice.cart.filter(p => !p.isTopping);
    this.toppingsCart = this.cartservice.cart.filter(p => p.isTopping);
    this.total = this.cartservice.total;
    this.toppingtotal = this.cartservice.toppingtotal;
  }

  clear(): void {
    this.cartservice.clearCart();
    this.cart = [];
    this.toppingsCart = [];
    this.updateTotals();
  }

  paylo(): void {
    this.router.navigateByUrl('/pay');  // Solo navigazione senza svuotare il carrello
  }

  updateTotals(): void {
    this.total = this.cartservice.getTotal();
    this.toppingtotal = this.cartservice.getToppingsTotal();
  }
}
