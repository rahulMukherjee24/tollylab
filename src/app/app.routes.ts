import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { FrameAdminComponent } from './components/frame-admin/frame-admin.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'admin',
    component: FrameAdminComponent,
  },
];
