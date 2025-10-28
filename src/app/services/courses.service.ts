import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { GetCoursesResponse } from "../models/get-courses.response";
import { Course } from "../models/course.model";

@Injectable({
  providedIn: "root"
})
export class CoursesService {
  httpClient = inject(HttpClient);

  getCourse$() {
    return this.httpClient.get<GetCoursesResponse>("http://localhost:9001/api/courses").pipe(map((res) => res.courses));
  }

  createCourse$(course: Partial<Course>): Observable<Course> {
    return this.httpClient.post<Course>("http://localhost:9001/api/courses", course);
  }

  updateCourse$(courseId: string, changes: Partial<Course>): Observable<Course> {
    return this.httpClient.put<Course>(`http://localhost:9001/api/courses/${courseId}`, changes);
  }

  // Example: Get courses without showing the loading indicator
  // getCourse$(skipLoading = false) {
  //   const context = skipLoading ? new HttpContext().set(SKIP_LOADING, true) : undefined;
  //   return this.httpClient.get<GetCoursesResponse>("http://localhost:9001/api/courses", { context }).pipe(map((res) => res.courses));
  // }

}
