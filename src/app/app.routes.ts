import { SignupComponent } from './components/signup/signup.component';
import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { FrameAdminComponent } from './components/frame-admin/frame-admin.component';
import { CartComponent } from './components/cart/cart.component';
import { FilmScrollAdminComponent } from './components/film-scroll-admin/film-scroll-admin.component';
import { FrameGalleryComponent } from './components/frame-gallery/frame-gallery.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'frames',
    component: FrameAdminComponent,
  },
  {
    path: 'films',
    component: FilmScrollAdminComponent,
  },
  { path: 'frame-gallery', component: FrameGalleryComponent },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'selected-product/:filmType',
    loadComponent: () =>
      import('./components/selected-product/selected-product.component').then(
        (m) => m.SelectedProductComponent
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'orderHistory',
    loadComponent: () =>
      import('./components/order-history/order-history.component').then(
        (m) => m.OrderHistoryComponent
      ),
  },
  {
    path: 'darkRoom',
    loadComponent: () =>
      import('./components/darkroom/darkroom.component').then(
        (m) => m.DarkroomComponent
      ),
  },
  {
    path: 'signUp',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
];
