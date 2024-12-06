import {Component, Inject, signal} from '@angular/core';
import {Course} from "../models/course.model";
import {CoursesServiceWithFetch} from "../services/courses-fetch.service";

@Component({
  selector: 'course',
  standalone: true,
  imports: [],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent {
}
