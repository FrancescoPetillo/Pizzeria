import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: any[] = [];
  total: number = 0;
  toppingtotal: number = 0;
  private cartlength = new BehaviorSubject(0);

  constructor() {
    this.syncCartFromLocalStorage();
  }

  syncCartFromLocalStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cart = JSON.parse(saved);
      this.cartlength.next(this.getCartItemsCount());
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  clearCart() {
    this.cart = [];
  localStorage.removeItem('cart');
  this.cartlength.next(0);
  }

  addToCart(pizza: any) {
    console.log('Pizza aggiunta al carrello:', pizza); // <--- AGGIUNGI QUESTA RIGA
    const found = this.cart.find(item => item.id === pizza.id && !item.isTopping);
    if (found) {
      found.qty += 1;
    } else {
      this.cart.push({ ...pizza, _id: pizza._id, qty: 1, isTopping: false });
    }
    this.saveCart();
    this.cartlength.next(this.getCartItemsCount());
  }

  removeFromCart(item: any) {
    const index = this.cart.indexOf(item);
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
    this.cartlength.next(this.getCartItemsCount());
  }

  addToppings(topping: any): void {
    const existing = this.cart.find(item => item.id === topping.id && item.isTopping);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        id: topping.id,
        name: topping.name || topping.tname,
        price: topping.price,
        image: topping.image,
        qty: 1,
        isTopping: true
      });
    }
    this.saveCart();
    this.cartlength.next(this.getCartItemsCount());
  }

  removeToppings(topping: any): void {
    const index = this.cart.indexOf(topping);
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
    this.cartlength.next(this.getCartItemsCount());
  }

  increse(item: any) {
    const index = this.cart.indexOf(item);
    if (index !== -1) {
      this.cart[index].qty += 1;
      this.saveCart();
      this.cartlength.next(this.getCartItemsCount());
    }
  }

  decrese(item: any) {
    const index = this.cart.indexOf(item);
    if (index !== -1 && this.cart[index].qty > 1) {
      this.cart[index].qty -= 1;
      this.saveCart();
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
    return this.cart.reduce((acc, item) => !item.isTopping ? acc + (item.qty * parseFloat(item.price)) : acc, 0);
  }

  getToppingsTotal() {
    return this.cart.reduce((acc, item) => item.isTopping ? acc + (item.qty * parseFloat(item.price)) : acc, 0);
  }
}