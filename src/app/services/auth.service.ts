import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { User } from '../model/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: any;

  constructor(
    private fAuth: AngularFireAuth,
    private fStore: AngularFirestore,
    private router: Router
  ) {
    this.fAuth.authState.subscribe(user => {
      if(user) {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  googleAuth() {
    return this.fAuth.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {
      this.setUserData(result.user);
    }).catch((error) => {
      window.alert(error);
    });
  }

  setUserData(user) {
    const userDoc: AngularFirestoreDocument<User> = this.fStore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return userDoc.set(userData, { merge: true });
  }

  signOut() {
    return this.fAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['home']);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }

}
