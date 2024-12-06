import {inject} from "@angular/core";
import {HttpEvent, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {LoadingService} from "../loading/loading.service";
import {finalize, Observable} from "rxjs";

export const loadingInterceptor : HttpInterceptorFn =
    (req: HttpRequest<unknown>, next: HttpInterceptorFn): Observable<HttpEvent<any>> => {
        const loadingService = inject(LoadingService);
        loadingService.loadingOn();
        // @ts-ignore
        return next(req)
            .pipe(
                finalize(() => {
                    loadingService.loadingOff();
                })
            )
    }