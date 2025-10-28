import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './loading.service';
import { finalize } from 'rxjs';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Check if this request should skip the loading indicator
  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }

  loadingService.showLoader();

  return next(req).pipe(
    finalize(() => {
      loadingService.hideLoader();
    })
  );
};
