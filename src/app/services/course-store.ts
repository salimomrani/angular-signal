import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { Course } from "../models/course.model";
import { CoursesService } from "./courses.service";
import { computed, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";

const initialState = {
  courses: [] as Course[],
  selectedCourse: null as Course|null,
  error: null as string|null
};

export const courseStore = signalStore(
  withState(initialState),
  withComputed(({ courses }) => ({
    beginnersCourses: computed(() => courses().filter(course => course.category === "BEGINNER")),
    advancedCourses: computed(() => courses().filter(course => course.category === "ADVANCED"))
  })),
  withProps(() => ({
    courseService: inject(CoursesService)
  })),
  withMethods(({ courseService, ...store }) => {
    const loadCourses = rxMethod<void>(
      pipe(
        switchMap(() =>
          courseService.getCourse$().pipe(
            tap((courses) => patchState(store, { courses }))
          )
        )
      )
    );

    const createCourse = rxMethod<Partial<Course>>(
      pipe(
        switchMap((course) =>
          courseService.createCourse$(course).pipe(
            tap((newCourse) => {
              const courses = [...store.courses(), newCourse];
              patchState(store, { courses });
            })
          )
        )
      )
    );

    const updateCourse = rxMethod<{ courseId: string; changes: Partial<Course> }>(
      pipe(
        switchMap(({ courseId, changes }) =>
          courseService.updateCourse$(courseId, changes).pipe(
            tap((updatedCourse) => {
              const courses = store.courses().map(course =>
                course.id === courseId ? updatedCourse : course
              );
              patchState(store, { courses });
            })
          )
        )
      )
    );

    return { loadCourses, createCourse, updateCourse };
  }),
  withHooks({
    onInit({ loadCourses }) {
      loadCourses();
    }
  })
);
