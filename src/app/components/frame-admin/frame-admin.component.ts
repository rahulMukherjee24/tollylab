import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-frame-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './frame-admin.component.html',
  styleUrls: ['./frame-admin.component.scss'],
})
export class FrameAdminComponent {
  imageUrl: string = '';
  selectedFilmType: string = '';
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

    try {
      const frameCounterRef = collection(this.firestore, 'frameCounter');
      await addDoc(frameCounterRef, {
        url: trimmed,
        filmType: this.selectedFilmType,
        createdAt: new Date(),
      });

      this.successMessage = 'Image added successfully!';
      this.imageUrl = '';
      this.selectedFilmType = '';
    } catch (error) {
      this.errorMessage = 'Failed to add image.';
      console.error(error);
    }
  }
}
