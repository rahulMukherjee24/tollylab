import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-film-scroll-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './film-scroll-admin.component.html',
  styleUrls: ['./film-scroll-admin.component.scss'],
})
export class FilmScrollAdminComponent {
  imageUrl: string = '';
  selectedFilmType: string = '';
  pricePerRoll!: number;
  successMessage = '';
  errorMessage = '';

  filmTypes = [
    { key: 'bnw', value: 'Black and White' },
    { key: 'color', value: 'Color' },
    { key: 'infrared', value: 'Infrared' },
  ];

  constructor(private firestore: Firestore) {}

  async addImage() {
    this.successMessage = '';
    this.errorMessage = '';

    const trimmed = this.imageUrl.trim();

    if (!trimmed || !trimmed.startsWith('https://pub-')) {
      this.errorMessage = 'Please enter a valid direct ImgBB image URL.';
      return;
    }

    if (!this.selectedFilmType) {
      this.errorMessage = 'Please select a film type.';
      return;
    }

    if (!this.pricePerRoll) {
      this.errorMessage = 'Please enter a price';
      return;
    }

    try {
      const frameCounterRef = collection(this.firestore, 'filmScroll');
      await addDoc(frameCounterRef, {
        url: trimmed,
        filmType: this.selectedFilmType,
        price: this.pricePerRoll,
        createdAt: new Date(),
      });

      this.successMessage = 'Image added successfully!';
      this.imageUrl = '';
      this.selectedFilmType = '';
      this.pricePerRoll = 0;
    } catch (error) {
      this.errorMessage = 'Failed to add image.';
      console.error(error);
    }
  }
}
