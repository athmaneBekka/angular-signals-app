import {computed, effect, inject, Injectable, signal, WritableSignal} from "@angular/core";
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #userSignal: WritableSignal<User | null> = signal<User | null>(null);
  http = inject(HttpClient);
  router = inject(Router);
  user = this.#userSignal.asReadonly();
  isLogedIn = computed(() => !!this.user());

  constructor() {
    this.loadUserFromLocalStorage();
    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  async login(email: string, password: string) : Promise<User> {
    const user$ = this.http.post<User>(`${environment.apiRoot}/login`, { email, password });
    const user = await firstValueFrom(user$);
    this.#userSignal.set(user);
    return user;
  }

  loadUserFromLocalStorage() {
    const json = localStorage.getItem(USER_STORAGE_KEY);
    if (json) {
      this.#userSignal.set(JSON.parse(json));
    }
  }

  async lougOut() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.#userSignal.set(null);
    await this.router.navigateByUrl('/login');
  }

}
