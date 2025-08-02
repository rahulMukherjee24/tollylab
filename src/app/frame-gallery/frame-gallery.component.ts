import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-frame-gallery',
  imports: [CommonModule, RouterModule],
  templateUrl: './frame-gallery.component.html',
  styleUrls: ['./frame-gallery.component.scss'],
})
export class FrameGalleryComponent implements OnInit {
  frameUrls$!: Observable<string[]>;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const frameCollection = collection(this.firestore, 'frameCounter');
    this.frameUrls$ = collectionData(frameCollection).pipe(
      // Type assertion to help extract just the 'url' field
      // If your Firestore data has just the URL strings, skip map
      map((docs: any[]) => docs.map((doc) => doc.url))
    );
  }
}
