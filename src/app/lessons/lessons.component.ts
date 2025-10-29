import { Component, inject, signal } from "@angular/core";
import { lessonsStore } from "../services/lessons.store";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Lesson } from "../models/lesson.model";

@Component({
  selector: "lessons",
  templateUrl: "./lessons.component.html",
  styleUrl: "./lessons.component.scss",
  imports: [FormsModule],
  providers: [lessonsStore]
})
export class LessonsComponent {
  store = inject(lessonsStore);
  private router = inject(Router);

  searchInput = signal('');

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchInput.set(query);
    this.store.updateSearchQuery(query);
  }

  clearSearch() {
    this.searchInput.set('');
    this.store.clearSearch();
  }

  onLessonClick(lesson: Lesson) {
    // Pass the lesson via navigation state so lesson-detail can use it
    this.router.navigate(['/lessons', lesson.id], {
      state: { lesson }
    });
  }
}
