import { Component, inject } from "@angular/core";
import { Course } from "../models/course.model";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditCourseDialogComponent } from "../edit-course-dialog/edit-course-dialog.component";
import { EditCourseDialogData } from "../edit-course-dialog/edit-course-dialog.data.model";
import { courseStore } from "../services/course-store";

@Component({
  selector: "home",
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  providers: [courseStore]
})
export class HomeComponent {
  courseStore = inject(courseStore);
  modalDialog = inject(MatDialog);

  beginnerCourses = this.courseStore.beginnersCourses;
  advancedCourses = this.courseStore.advancedCourses;

  onAddCourse(): void {
    this.openCreateDialog();
  }

  onEditCourse(course: Course): void {
    this.openEditDialog(course);
  }

  onViewCourse(course: Course): void {
    this.openViewDialog(course);
  }

  private openCreateDialog(): void {
    const config = new MatDialogConfig<EditCourseDialogData>();
    config.disableClose = true;
    config.autoFocus = true;
    config.data = { mode: 'create', title: 'Create New Course' };

    const dialogRef = this.modalDialog.open(EditCourseDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newCourse: Partial<Course> = {
          title: result.title,
          longDescription: result.description,
          category: result.category,
          iconUrl: result.iconUrl
        };
        this.courseStore.createCourse(newCourse);
      }
    });
  }

  private openEditDialog(course: Course): void {
    const config = new MatDialogConfig<EditCourseDialogData>();
    config.disableClose = true;
    config.autoFocus = true;
    config.data = { mode: 'update', title: 'Update Course', course };

    const dialogRef = this.modalDialog.open(EditCourseDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const changes: Partial<Course> = {
          title: result.title,
          longDescription: result.description,
          category: result.category,
          iconUrl: result.iconUrl
        };
        this.courseStore.updateCourse({ courseId: course.id, changes });
      }
    });
  }

  private openViewDialog(course: Course): void {
    const config = new MatDialogConfig<EditCourseDialogData>();
    config.disableClose = false;
    config.autoFocus = true;
    config.data = { mode: 'view', title: 'View Course', course };

    this.modalDialog.open(EditCourseDialogComponent, config);
  }
}
