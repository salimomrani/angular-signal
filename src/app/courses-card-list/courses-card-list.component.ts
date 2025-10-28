import { Component, input, InputSignal, output } from "@angular/core";
import { Course } from "../models/course.model";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";

@Component({
  selector: "courses-card-list",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions
  ],
  templateUrl: "./courses-card-list.component.html",
  styleUrl: "./courses-card-list.component.scss"
})
export class CoursesCardListComponent {

  editCourseEvent = output<Course>();
  deleteCourseEvent = output<Course>();
  viewCourseEvent = output<Course>();

  courses: InputSignal<Course[]> = input.required<Course[]>();

  editCourse(course: Course): void {
    this.editCourseEvent.emit(course);
  }

  viewCourse(course: Course) {
    this.viewCourseEvent.emit(course);
  }
}
