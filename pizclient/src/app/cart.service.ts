import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart = [];
  total: number = 0;
  toppingtotal: number = 0;
  private cartlength = new BehaviorSubject(0);

  constructor() { }

  clearCart() {
    this.cart = [];
    this.cartlength.next(0);
  }

  addToCart(pizza) {
    const found = this.cart.find(item => item.id === pizza.id && !item.isTopping);
    if (found) {
      found.qty += 1;
    } else {
      this.cart.push({ ...pizza, qty: 1, isTopping: false });
    }
    this.cartlength.next(this.getCartItemsCount());
  }

  removeFromCart(item) {
    const index = this.cart.indexOf(item);
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
    this.cartlength.next(this.getCartItemsCount());
  }

  addToppings(topping: any): void {
    const existing = this.cart.find(item => item.id === topping.id && item.isTopping);
    
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
      id: topping.id,
      name: topping.name || topping.tname, // <-- aggiunta qui
      price: topping.price,
      image: topping.image,
      qty: 1,
      isTopping: true
      });
    }

    this.cartlength.next(this.getCartItemsCount());
  }

  removeToppings(topping: any): void {
    const index = this.cart.indexOf(topping);
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
    this.cartlength.next(this.getCartItemsCount());
  }

  increse(item) {
    const index = this.cart.indexOf(item);
    if (index !== -1) {
      this.cart[index].qty += 1;
      this.cartlength.next(this.getCartItemsCount());
    }
  }

  decrese(item) {
    const index = this.cart.indexOf(item);
    if (index !== -1 && this.cart[index].qty > 1) {
      this.cart[index].qty -= 1;
      this.cartlength.next(this.getCartItemsCount());
    }
  }

  getCartItemsCount(): number {
    return this.cart.reduce((acc, item) => acc + item.qty, 0);
  }

  getLength() {
    return this.cartlength.asObservable();
  }

  getTotal() {
    this.total = 0;
    for (const item of this.cart) {
      if (!item.isTopping) {
        this.total += item.qty * parseFloat(item.price);
      }
    }
    return this.total;
  }

  getToppingsTotal() {
    this.toppingtotal = 0;
    for (const item of this.cart) {
      if (item.isTopping) {
        this.toppingtotal += item.qty * parseFloat(item.price);
      }
    }
    return this.toppingtotal;
  }
}
