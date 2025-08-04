import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { FrameAdminComponent } from './components/frame-admin/frame-admin.component';
import { FrameGalleryComponent } from './frame-gallery/frame-gallery.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'admin',
    component: FrameAdminComponent,
  },
  { path: 'frame-gallery', component: FrameGalleryComponent },
  {
    path: 'cart',
    component: CartComponent
  }
];
