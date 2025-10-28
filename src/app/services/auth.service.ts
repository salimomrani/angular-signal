import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";

const USER_STORAGE_KEY = "user";

type LoginCredentials = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private userSignal = signal<User|null>(this.loadUserFromStorage());
  isLoggedIn = computed(() => !!this.user());
  user = this.userSignal.asReadonly();

  constructor() {
    // Persist user to localStorage whenever it changes
    effect(() => {
      const user = this.user();
      if ( user ) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    });
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>("http://localhost:9001/api/login", credentials).pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.router.navigate(["/"]);
      })
    );
  }

  logout(): void {
    this.userSignal.set(null);
    this.router.navigate(["/login"]);
  }

  private loadUserFromStorage(): User|null {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
