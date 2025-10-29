import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { Lesson } from "../models/lesson.model";
import { LessonsService } from "./lessons.service";
import { computed, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from "rxjs";

type LessonsState = {
  lessons: Lesson[];
  loading: boolean;
  searchQuery: string;
  error: string | null;
};

const initialState: LessonsState = {
  lessons: [],
  loading: false,
  searchQuery: '',
  error: null
};

export const lessonsStore = signalStore(
  withState(initialState),
  withComputed(({ lessons, loading }) => ({
    lessonsCount: computed(() => lessons().length),
    isLoading: computed(() => loading()),
    hasLessons: computed(() => lessons().length > 0)
  })),
  withProps(() => ({
    lessonsService: inject(LessonsService)
  })),
  withMethods(({ lessonsService, ...store }) => {
    const searchLessons = rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => {
          patchState(store, {
            loading: true,
            searchQuery: query,
            error: null
          });
        }),
        switchMap((query) =>
          lessonsService.getLessons(query).then(
            (lessons) => {
              patchState(store, {
                lessons,
                loading: false
              });
            },
            (error) => {
              patchState(store, {
                error: error.message || 'Failed to load lessons',
                loading: false,
                lessons: []
              });
            }
          )
        )
      )
    );

    const updateSearchQuery = (query: string) => {
      searchLessons(query);
    };

    const clearSearch = () => {
      patchState(store, {
        searchQuery: '',
        lessons: [],
        error: null
      });
    };

    return {
      searchLessons,
      updateSearchQuery,
      clearSearch
    };
  })
);