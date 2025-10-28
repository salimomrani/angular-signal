import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Lesson } from "../models/lesson.model";
import { firstValueFrom } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  // utilisation de l'API `inject()` au lieu du constructeur
  private http = inject(HttpClient);

  /**
   * Récupère les lessons depuis l'API.
   * Retourne une Promise résolue avec le tableau de Lesson.
   */
  getLessons(search?: string): Promise<Lesson[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';

    const rawBase = (environment as { apiUrl?: string }).apiUrl ?? '';
    const base = rawBase ? String(rawBase).trim().replace(/\/+$/,'') : '';

    const path = `/api/lessons${query}`;
    const url = base ? `${base}${path}` : path;

    return firstValueFrom(this.http.get<Lesson[]>(url));
  }
}
