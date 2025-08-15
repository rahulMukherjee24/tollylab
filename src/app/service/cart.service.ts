import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  imageUrl: string;
  title: string;
  price: number;
  size?: string;
  quantity?: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  /**
   * Add to cart: if same title+size exists, increase its quantity; otherwise push new item.
   * Default quantity if not provided: 1
   */
  addToCart(item: CartItem): void {
    const items = [...this.getCartItems()];
    const existingIndex = items.findIndex(
      (i) => i.title === item.title && (i.size ?? '') === (item.size ?? '')
    );

    if (existingIndex !== -1) {
      items[existingIndex].quantity =
        (items[existingIndex].quantity ?? 0) + (item.quantity ?? 1);
    } else {
      items.push({ ...item, quantity: item.quantity ?? 1 });
    }

    this.cartItemsSubject.next(items);
  }

  // Update by setting exact quantity for given title (and implicit size ignored for simplicity)
  updateQuantity(title: string, quantity: number): void {
    const items = [...this.getCartItems()];
    const index = items.findIndex((i) => i.title === title);

    if (index !== -1) {
      if (quantity > 0) {
        items[index].quantity = quantity;
      } else {
        // remove if quantity 0 or less
        items.splice(index, 1);
      }
      this.cartItemsSubject.next(items);
    }
  }

  // Keep your existing helpers
  // remove by index (removes single occurrence / specific index)
  removeAt(index: number): void {
    const items = [...this.getCartItems()];
    if (index >= 0 && index < items.length) {
      items.splice(index, 1);
      this.cartItemsSubject.next(items);
    }
  }

  // Existing value-based remove (keeps backwards compatibility)
  removeFromCart(item: CartItem): void {
    const items = [...this.getCartItems()];
    const idx = items.findIndex(
      (i) =>
        i.title === item.title &&
        i.price === item.price &&
        i.imageUrl === item.imageUrl &&
        (i.size ?? '') === (item.size ?? '')
    );
    if (idx !== -1) this.removeAt(idx);
  }

  // New convenience: remove by title
  removeFromCartByTitle(title: string): void {
    const items = this.getCartItems().filter((i) => i.title !== title);
    this.cartItemsSubject.next(items);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce(
      (acc, item) => acc + item.price * (item.quantity ?? 1),
      0
    );
  }
}
