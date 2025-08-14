import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../service/cart.service';
import { environment } from '../../../environments/environment';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  cartTotal = 0;
  cartItems: CartItem[] = [];
  isProcessing = false;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      // ✅ Correct total with quantity support
      this.cartTotal = items.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );
    });
  }

  payWithRazorpay() {
    if (this.cartTotal <= 0) {
      alert('Your cart is empty!');
      return;
    }

    this.isProcessing = true;

    this.http
      .post<{ id: string }>(
        'https://tollylab-backend.vercel.app/create-order',
        { amount: this.cartTotal }
      )
      .subscribe({
        next: (order) => {
          this.isProcessing = false;
          this.openRazorpay(order.id);
        },
        error: (err) => {
          this.isProcessing = false;
          console.error(err);
          alert('Failed to start payment');
        },
      });
  }

  openRazorpay(orderId: string) {
    const options: any = {
      key: environment.razorpayKeyId,
      amount: this.cartTotal * 100, // Razorpay uses paise
      currency: 'INR',
      name: 'Tollylab',
      description: 'Order Payment',
      order_id: orderId,
      handler: async (response: any) => {
        alert('Payment Successful: ' + response.razorpay_payment_id);
        console.log(response);

        const user = this.auth.currentUser;
        if (user) {
          try {
            await addDoc(collection(this.firestore, 'orderHistory'), {
              userId: user.uid,
              orderId: orderId || this.generateOrderId(),
              items: this.cartItems.map((item) => ({
                title: item.title,
                price: item.price,
                quantity: item.quantity || 1,
                imageUrl: item.imageUrl,
              })),
              total: this.cartTotal,
              status: 'order placed',
              createdAt: serverTimestamp(),
            });

            // ✅ Clear cart and reset total instantly
            this.cartService.clearCart();
            this.cartTotal = 0;

            // ✅ Give Angular time to update UI before navigating
            setTimeout(() => {
              this.router.navigate(['/orderHistory']);
            }, 50);
          } catch (error) {
            console.error('Error saving order:', error);
            alert('Your payment succeeded but saving the order failed.');
          }
        }
      },
      prefill: {
        name: 'Rahul Mukherjee',
        email: 'rahulm.3564@gmail.com',
        contact: '9836026229',
      },
      theme: { color: '#F37254' },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now();
  }
}
