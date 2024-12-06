import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MessagesService} from "../messages/messages.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'login',
    imports: [
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    fb = inject(FormBuilder);
    authService = inject(AuthService);
    router = inject(Router);

    form = this.fb.group({
        email: [''],
        password: ['']
    });

    messages = inject(MessagesService);

    async onLogin() {
        try {
            const { email, password } = this.form.value;
            if (!email || !password){
                console.error('Password ou Email incorrect');
                return;
            }
            await this.authService.login(email, password)
            await this.router.navigate(['/home']);
        }
        catch (error) {
            console.error(error);
        }
    }
}
