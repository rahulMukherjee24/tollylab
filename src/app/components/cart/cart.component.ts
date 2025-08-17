import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, SignupComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: (CartItem & { quantity: number })[] = [];
  isLoggedIn = false;
  isAdmin: boolean = false;
  showSignup = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkLoggedIn();
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
    if (this.isLoggedIn) {
      this.router.navigate(['/checkout']);
    } else {
      this.showSignup = true;
    }
  }

  checkLoggedIn(): void {
    this.authService.currentUserData$.subscribe((data: any) => {
      this.isAdmin = !!data?.isAdmin;
      console.log('User data: ', data);
    });
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  openSignup() {
    this.showSignup = true;
  }
}
