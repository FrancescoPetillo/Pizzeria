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
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(this.isValidCartItem)) {
          this.cart = parsed;
          this.cartlength.next(this.getCartItemsCount());
        } else {
          this.clearCart(); // reset se dati corrotti
        }
      } catch {
        this.clearCart();
      }
    }
  }

  private isValidCartItem(item: any): boolean {
    // Accetta sia _id che id, per compatibilità vecchi dati
    const id = typeof item._id === 'string' && item._id.length > 5 ? item._id : (typeof item.id === 'string' && item.id.length > 0 ? item.id : null);
    return (
      item &&
      id &&
      typeof item.price !== 'undefined' && !isNaN(parseFloat(item.price)) && parseFloat(item.price) >= 0 &&
      typeof item.qty === 'number' && item.qty > 0 && item.qty <= 10
    );
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  clearCart() {
    console.log('[DEBUG] clearCart chiamato!', new Error().stack);
    this.cart = [];
    localStorage.removeItem('cart');
    this.cartlength.next(0);
  }

  addToCart(pizza: any) {
    if (!this.isValidCartItem({ ...pizza, _id: pizza._id, price: pizza.price, qty: 1 })) {
      return;
    }
    const found = this.cart.find(item => item._id === pizza._id && !item.isTopping);
    if (found) {
      if (found.qty < 10) found.qty += 1;
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
    if (!topping || isNaN(parseFloat(topping.price)) || parseFloat(topping.price) < 0) {
      return;
    }
    const existing = this.cart.find(item => item.id === topping.id && item.isTopping);
    if (existing) {
      if (existing.qty < 10) existing.qty += 1;
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
    if (index !== -1 && this.cart[index].qty < 10) {
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

  // Utility per feedback UX
  isCartEmpty(): boolean {
    return this.cart.length === 0;
  }

  hasInvalidItems(): boolean {
    return !this.cart.every(this.isValidCartItem);
  }
}