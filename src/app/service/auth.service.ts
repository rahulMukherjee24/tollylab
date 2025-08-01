import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  UserCredential,
  onAuthStateChanged,
  User,
  signOut,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor(private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  async signUpWithEmail(email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    await this.saveUserToFirestore(userCredential);
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    await this.saveUserToFirestore(userCredential);
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    await this.saveUserToFirestore(userCredential);
  }

  private async saveUserToFirestore(credential: UserCredential): Promise<void> {
    const user = credential.user;
    const userRef = doc(this.firestore, 'Users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
      });
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        console.log('Logged out successfully');
        this.router.navigate(['/']); // or to a login page
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}
