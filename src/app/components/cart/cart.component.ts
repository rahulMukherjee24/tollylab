import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: (CartItem & { quantity: number })[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items.map((item) => ({
        ...item,
        quantity: (item as any).quantity || 1,
      }));
    });
  }

  removeFromCartAt(index: number): void {
    // this.cartService.removeAt(index);
  }

  increaseQuantity(item: any): void {
    item.quantity++;
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) item.quantity--;
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
