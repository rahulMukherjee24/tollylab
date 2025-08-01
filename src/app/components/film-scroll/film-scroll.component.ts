import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-film-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-scroll.component.html',
  styleUrls: ['./film-scroll.component.scss'],
})
export class FilmScrollComponent {
  products = [
    { title: 'Tollygrunge Vol. 1', img: 'assets/cam_roll1.png' },
    { title: 'Midnight Alley', img: 'assets/cam_roll2.png' },
    { title: 'Suburban Screamers', img: 'assets/cam_roll3.png' },
    { title: 'Retro Noir', img: 'assets/cam_roll4.png' },
  ];

  scrollLeft(container: HTMLDivElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLDivElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
