import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrderpizzaComponent } from './orderpizza/orderpizza.component';
import { BuildurpizzaComponent } from './buildurpizza/buildurpizza.component';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // <--- IMPORTA IL COMPONENTE REGISTRAZIONE


const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'order', component: OrderpizzaComponent },
    { path: 'build', component: BuildurpizzaComponent },
    { path: 'cart', component: CartComponent },
    { path: 'pay', component: PaymentComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }, // <--- AGGIUNGI QUESTA LINEA
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PagenotfoundComponent }

];

@NgModule({

    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
