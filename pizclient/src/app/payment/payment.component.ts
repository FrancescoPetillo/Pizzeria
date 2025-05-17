import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  formData = {
    nome: '',
    email: '',
    indirizzo: '',
    card: '',
    prodotti: [],
    totale: 0,
    metodoPagamento: 'simulato'
  };

  submitted = false;
  success = false;

  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.syncCartFromLocalStorage();
    this.formData.prodotti = this.cartService.cart;
    this.formData.totale = this.cartService.cart.reduce((sum, p) => sum + (this.getSafePrice(p) * this.getSafeQty(p)), 0);
  }

  getSafePrice(p: any): number {
    // Previene NaN, stringhe, prezzi negativi
    const price = parseFloat(p.price || p.prezzo);
    return isNaN(price) || price < 0 ? 0 : price;
  }

  getSafeQty(p: any): number {
    // Previene quantità negative o non numeriche
    const qty = p.qty !== undefined ? p.qty : p.quantita;
    return typeof qty === 'number' && qty > 0 && qty <= 10 ? qty : 1;
  }

  sanitizeString(str: string): string {
    // Rimuove caratteri pericolosi (XSS prevention)
    return str.replace(/[<>"'`]/g, '').trim();
  }

  onSubmit() {
    if (this.submitted) return; // Previene submit multipli
    this.submitted = true;
    // Validazione lato client avanzata
    const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.formData.email);
    const nameValid = this.sanitizeString(this.formData.nome).length >= 3;
    const addressValid = this.sanitizeString(this.formData.indirizzo).length > 0;
    const cardValid = /^[0-9]{4,}$/.test(this.formData.card);
    if (!emailValid || !nameValid || !addressValid || !cardValid) {
      alert('Compila correttamente tutti i campi!');
      this.submitted = false;
      return;
    }
    // Rimappa i prodotti per lo schema richiesto dal backend, solo se validi
    const mappedProducts = this.cartService.cart
      .filter((p: any) => p._id && typeof p._id === 'string' && this.getSafePrice(p) > 0 && this.getSafeQty(p) > 0)
      .map((p: any) => ({
        productId: p._id,
        quantity: this.getSafeQty(p)
      }));
    if (mappedProducts.length === 0) {
      alert('Il carrello è vuoto o contiene prodotti non validi.');
      this.submitted = false;
      return;
    }
    const payload = {
      name: this.sanitizeString(this.formData.nome),
      email: this.formData.email.trim(),
      address: this.sanitizeString(this.formData.indirizzo),
      products: mappedProducts,
      totalAmount: this.cartService.cart.reduce((sum, p) => sum + (this.getSafePrice(p) * this.getSafeQty(p)), 0),
      paymentMethod: this.formData.metodoPagamento,
      cardLast4: this.formData.card.slice(-4)
    };
    // Disabilita invio se totale incoerente
    if (payload.totalAmount <= 0 || isNaN(payload.totalAmount)) {
      alert('Totale ordine non valido.');
      this.submitted = false;
      return;
    }
    this.http.post('http://localhost:3000/api/orders', payload).subscribe({
      next: () => {
        this.success = true;
        this.submitted = false;
        this.cartService.clearCart();
        this.formData = { nome: '', email: '', indirizzo: '', card: '', prodotti: [], totale: 0, metodoPagamento: 'simulato' };
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          alert('❌ Errore: ' + err.error.message);
        } else {
          alert('❌ Errore durante il pagamento. Riprova più tardi.');
        }
        this.submitted = false;
      }
    });
  }
}
