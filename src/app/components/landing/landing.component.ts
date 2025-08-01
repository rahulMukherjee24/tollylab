import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { CommonModule } from '@angular/common';
import { FilmScrollComponent } from '../film-scroll/film-scroll.component';
import { FrameCounterComponent } from '../frame-counter/frame-counter.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [
    SignupComponent,
    CommonModule,
    FilmScrollComponent,
    FrameCounterComponent,
    RouterModule,
    LoginComponent,
  ],
})
export class LandingComponent implements OnInit {
  authService = inject(AuthService);
  isLoggedIn = false;
  isMobileMenuOpen = false;
  showSignup = false;
  showProfileTray = false;
  showLogin = false;

  openLogin() {
    this.showLogin = true;
  }

  films = [
    { image: 'assets/cam_roll1.png', title: 'Tolly 400' },
    { image: 'assets/cam_roll2.png', title: 'Grunge Max' },
    { image: 'assets/cam_roll3.png', title: 'Retro Chrome' },
    { image: 'assets/cam_roll4.png', title: 'Mono Classic' },
    { image: 'assets/cam_roll5.png', title: 'Color Grunge' },
  ];

  @ViewChild('filmScroll') filmScroll!: ElementRef;
  dropdownOpen: boolean = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  openSignup() {
    this.showSignup = true;
  }

  scrollLeft() {
    this.filmScroll.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight() {
    this.filmScroll.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  toggleProfileTray() {
    this.showProfileTray = !this.showProfileTray;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToOrders() {
    this.dropdownOpen = false;
    // navigate to orders
  }

  logout() {
    this.dropdownOpen = false;
    this.authService.logout(); // replace with your actual logout logic
  }
}
