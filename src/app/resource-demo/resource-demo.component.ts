import { Component, effect, inject, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { Lesson } from "../models/lesson.model";
import { LessonsService } from "../services/lessons.service";


@Component({
  selector: "app-resource-demo",
  templateUrl: "./resource-demo.component.html",
  styleUrls: ["./resource-demo.component.scss"]
})
export class ResourceDemoComponent {

  // typer explicitement pour éviter l'erreur TS lorsque l'objet environment est "{}"
  env: { apiUrl?: string; [key: string]: unknown } = environment;

  search = signal<string>("");

  lessons = signal<Lesson[]>([]);

  private lessonsService = inject(LessonsService);

  constructor() {
    effect(() => {
      console.log("searching lessons:", this.search());
    });
  }

  searchLessons(search: string) {
    this.search.set(search);
  }

  reset() {
    // remet la recherche et la liste à l'état initial
    this.search.set("");
    this.lessons.set([]);
  }

  async reload(): Promise<void> {
    // recharge les lessons depuis l'API via le service LessonsService
    try {
      const data = await this.lessonsService.getLessons(this.search());
      // met à jour le signal avec les données reçues
      this.lessons.set(data ?? []);
    } catch (err) {
      console.error('Failed to load lessons', err);
      // en cas d'erreur, vider la liste pour rester dans un état cohérent
      this.lessons.set([]);
    }
  }
}
