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
  async getLessons(search?: string): Promise<Lesson[]> {
    if (!search || search.trim() === '') {
      return [];
    }

    const query = `?query=${encodeURIComponent(search)}`;

    const rawBase = (environment as { apiUrl?: string }).apiUrl ?? '';
    const base = rawBase ? String(rawBase).trim().replace(/\/+$/,'') : '';

    const path = `/api/search-lessons${query}`;
    const url = base ? `${base}${path}` : path;

    const response = await firstValueFrom(this.http.get<{ lessons: Lesson[] }>(url));
    return response.lessons || [];
  }

  /**
   * Met à jour une lesson existante.
   * Retourne une Promise résolue avec la Lesson mise à jour.
   */
  async updateLesson(lessonId: string, changes: Partial<Lesson>): Promise<Lesson> {
    const rawBase = (environment as { apiUrl?: string }).apiUrl ?? '';
    const base = rawBase ? String(rawBase).trim().replace(/\/+$/,'') : '';

    const path = `/api/lessons/${lessonId}`;
    const url = base ? `${base}${path}` : path;

    return firstValueFrom(this.http.put<Lesson>(url, changes));
  }
}
