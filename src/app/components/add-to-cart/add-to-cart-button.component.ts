import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../service/cart.service';

@Component({
  selector: 'add-to-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.scss'],
})
export class AddToCartButtonComponent implements OnInit {
  @Input() item!: CartItem; // Expect full item data from parent
  quantity = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.syncQuantity();
    this.cartService.cartItems$.subscribe(() => this.syncQuantity());
  }

  private syncQuantity(): void {
    const existing = this.cartService
      .getCartItems()
      .find(
        (i) =>
          i.title === this.item.title &&
          (i.size ?? '') === (this.item.size ?? '')
      );
    this.quantity = existing?.quantity ?? 0;
  }

  add(): void {
    this.cartService.addToCart({ ...this.item, quantity: 1 });
  }

  increase(): void {
    this.cartService.updateQuantity(this.item.title, this.quantity + 1);
  }

  decrease(): void {
    const newQty = this.quantity - 1;
    this.cartService.updateQuantity(this.item.title, newQty);
  }
}
