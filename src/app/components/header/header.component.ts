import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SignupComponent, LoginComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private router: Router) {}

  navigateAndClose(path: string) {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }

  authService = inject(AuthService);
  isMobileMenuOpen = false;
  showSignup = false;
  showLogin = false;
  showProfileTray = false;
  isLoggedIn = false;
  isAdmin: boolean = false;

  openLogin() {
    this.showLogin = true;
  }

  ngOnInit() {
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
  dropdownOpen: boolean = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileTray() {
    this.showProfileTray = !this.showProfileTray;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  openSignup() {
    this.showSignup = true;
  }

  goToOrders() {
    this.dropdownOpen = false;
    // navigate to orders
  }

  logout() {
    this.dropdownOpen = false;
    this.authService.logout(); // replace with your actual logout logic
  }

  openCart() {
    this.router.navigate(['/cart']);
  }
}
