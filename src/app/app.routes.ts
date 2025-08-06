import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { FrameAdminComponent } from './components/frame-admin/frame-admin.component';
import { FrameGalleryComponent } from './frame-gallery/frame-gallery.component';
import { CartComponent } from './components/cart/cart.component';
import { FilmScrollAdminComponent } from './components/film-scroll-admin/film-scroll-admin.component';

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
];
