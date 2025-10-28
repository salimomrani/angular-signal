import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EditCourseDialogData } from "./edit-course-dialog.data.model";
import { LoadingIndicatorComponent } from "../loading/loading.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "edit-course-dialog",
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule
  ],
  templateUrl: "./edit-course-dialog.component.html",
  styleUrl: "./edit-course-dialog.component.scss"
})
export class EditCourseDialogComponent {

  data = inject<EditCourseDialogData>(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<EditCourseDialogComponent>);


  form = this.fb.group({
    title: this.data.course?.title || "",
    description: this.data.course?.longDescription || "",
    category: this.data.course?.category || "BEGINNER",
    iconUrl: this.data.course?.iconUrl || ""
  });

  saveCourse(): void {
    this.dialogRef.close(this.form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
