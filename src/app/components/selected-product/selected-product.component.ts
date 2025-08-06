import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { map } from 'rxjs';

@Component({
  selector: 'app-selected-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-product.component.html',
  styleUrls: ['./selected-product.component.scss'],
})
export class SelectedProductComponent implements OnInit {
  filmType!: string;
  images: string[] = [];
  isLoading = true;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit(): void {
    // Get filmType from route
    this.filmType = this.route.snapshot.paramMap.get('filmType') || '';

    if (!this.filmType) return;

    // Query Firestore for matching filmType
    const framesRef = collection(this.firestore, 'frameCounter');
    const q = query(framesRef, where('filmType', '==', this.filmType));

    collectionData(q)
      .pipe(map((docs: any[]) => docs.map((doc) => doc.url)))
      .subscribe((urls) => {
        this.images = urls;
        this.isLoading = false;
      });
  }
}
