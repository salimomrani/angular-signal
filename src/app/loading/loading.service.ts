import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private loadingCountSignal = signal(0);
  loading = this.loadingCountSignal.asReadonly();

  showLoader(): void {
    this.loadingCountSignal.update(count => count + 1);
  }

  hideLoader(): void {
    this.loadingCountSignal.update(count => Math.max(0, count - 1));
  }
}
