import {Course} from "../models/course.model";


export type EditCourseDialogData = {
  mode: 'create' | 'update' | 'view';
  title: string;
  course?: Course;
};
