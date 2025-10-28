import { Component, input } from "@angular/core";
import { Course } from "../models/course.model";

@Component({
  selector: "course",
  standalone: true,
  templateUrl: "./course.component.html",
  styleUrl: "./course.component.scss"
})
export class CourseComponent {
  course = input.required<Course>();
}
