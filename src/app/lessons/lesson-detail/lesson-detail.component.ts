import {Component, effect, inject, input, output, signal} from '@angular/core';
import {Lesson} from "../../models/lesson.model";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {LessonsService} from "../../services/lessons.service";
import {MessagesService} from "../../messages/messages.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'lesson-detail',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './lesson-detail.component.html',
    styleUrl: './lesson-detail.component.scss'
})
export class LessonDetailComponent {
  private fb = inject(FormBuilder);
  private lessonsService = inject(LessonsService);
  private messagesService = inject(MessagesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Input signal pour recevoir la lesson (optionnel, pour utilisation comme sous-composant)
  lesson = input<Lesson>();

  // Output signals pour notifier le parent
  lessonUpdated = output<Lesson>();
  cancel = output<void>();

  // Signal pour gérer l'état de sauvegarde et de chargement
  saving = signal(false);
  loading = signal(false);

  // Signal pour stocker la lesson courante (si elle vient de la route)
  currentLesson = signal<Lesson | null>(null);

  // Form pour éditer la lesson
  form = this.fb.nonNullable.group({
    description: ['', Validators.required],
    duration: ['', Validators.required],
    videoId: ['']
  });

  constructor() {
    // Effect pour initialiser le formulaire quand la lesson change
    effect(() => {
      const inputLesson = this.lesson();
      const routeLesson = this.currentLesson();
      const lessonToEdit = inputLesson || routeLesson;

      if (lessonToEdit) {
        this.form.patchValue({
          description: lessonToEdit.description,
          duration: lessonToEdit.duration,
          videoId: lessonToEdit.videoId || ''
        });
      }
    });

    // Si on est en mode route (pas d'input), charger la lesson depuis le paramètre de route
    if (!this.lesson()) {
      this.loadLessonFromRoute();
    }
  }

  private async loadLessonFromRoute() {
    // Try to get lesson from navigation state first
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || (history.state as any);

    if (state && state['lesson']) {
      const lesson = state['lesson'] as Lesson;
      this.currentLesson.set(lesson);
      return;
    }

    // If no lesson in state, redirect back to lessons list
    const lessonId = this.route.snapshot.paramMap.get('id');
    if (!lessonId) {
      this.messagesService.showMessage('No lesson ID provided', 'error');
      this.router.navigate(['/lessons']);
      return;
    }

    this.loading.set(true);
    // Note: L'API ne fournit pas d'endpoint GET /api/lessons/:id
    // L'utilisateur doit passer par la liste des lessons
    this.messagesService.showMessage('Please search for a lesson first', 'info');
    this.router.navigate(['/lessons']);
    this.loading.set(false);
  }

  getLesson(): Lesson | null {
    return this.lesson() || this.currentLesson();
  }

  async onSave() {
    const lessonToSave = this.getLesson();
    if (!lessonToSave) {
      this.messagesService.showMessage('No lesson to save', 'error');
      return;
    }

    if (this.form.invalid) {
      this.messagesService.showMessage('Please fill all required fields', 'error');
      return;
    }

    this.saving.set(true);

    try {
      const changes: Partial<Lesson> = this.form.getRawValue();
      const updatedLesson = await this.lessonsService.updateLesson(
        lessonToSave.id,
        changes
      );

      this.messagesService.showMessage('Lesson updated successfully!', 'success');

      // Si on a un output, émettre l'événement
      if (this.lesson()) {
        this.lessonUpdated.emit(updatedLesson);
      } else {
        // Sinon, revenir à la liste des lessons
        this.router.navigate(['/lessons']);
      }
    } catch (error) {
      this.messagesService.showMessage('Failed to update lesson', 'error');
      console.error('Error updating lesson:', error);
    } finally {
      this.saving.set(false);
    }
  }

  onCancel() {
    if (this.lesson()) {
      this.cancel.emit();
    } else {
      this.router.navigate(['/lessons']);
    }
  }
}
