import {afterNextRender, Component, computed, effect, Inject, inject, Injector, OnInit, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {openEditCourseDialog} from "../edit-course-dialog/edit-course-dialog.component";

@Component({
    selector: 'home',
    imports: [
        MatTabGroup,
        MatTab,
        CoursesCardListComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

    #courses = signal<Course[]>([]);
    coursesService = inject(CoursesService);
    dialog = inject(MatDialog);

    beginerCourses = computed(() => {
        const courses = this.#courses();
        return courses.filter(course =>
            course.category === "BEGINNER"
        );
    });

    advancedCourses = computed(() => {
        const courses = this.#courses();
        return courses.filter(course =>
            course.category === "ADVANCED"
        );
    });

    constructor() {
        effect(() => {
            console.log(`Beginner courses`, this.beginerCourses());
            console.log(`Advanced courses`, this.advancedCourses());
        });

        this.loadCourses().then(() => {
            console.log("HTTP GET", this.#courses());
        });
    }

    async loadCourses() {
        try {
            const courses = await this.coursesService.loadAllCourses();
            this.#courses.set(courses.sort(sortCoursesBySeqNo));
        }
        catch (error) {
            console.log(error);
        }
    }


    onCourseUpdated(updatedCourse: Course) {
        const courses = this.#courses();
        const newCourses = courses.map(course => (
            course.id === updatedCourse.id ? updatedCourse : course)
        );
        this.#courses.set(newCourses);
    }

    async onCourseDeleted(courseId: string) {
        try {
            await this.coursesService.deleteCourse(courseId);
            const courses = this.#courses();
            const newCourses = courses.filter(course => course.id !== courseId);
            this.#courses.set(newCourses);
        } catch (err) {
            console.log(err);
        }
    }

    async addCourse() {
        const newCourse = await openEditCourseDialog(
            this.dialog,
            {
                mode: "create",
                title: "Add Course",
            }
        )
        const newCourses = [
            ...this.#courses(),
            newCourse
        ];
        this.#courses.set(newCourses);
    }
}
