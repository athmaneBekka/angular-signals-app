import {User} from "../models/user.model";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const isUserAuthenticated : CanActivateFn = (
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const  authService = inject(AuthService);
    if (authService.isLogedIn()) {
        return true;
    }
    return router.parseUrl('/login');
}