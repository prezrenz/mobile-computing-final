import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonInput, IonRippleEffect } from '@ionic/angular';
import { Router } from '@angular/router';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { AuthService } from '../../auth.service';
import { minLength, email, form, FormField, required } from '@angular/forms/signals';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.page.html',
	styleUrls: ['./sign-in.page.scss'],
	imports: [
		IonContent,
		IonInput,
		IonRippleEffect,
		CommonModule,
		FormsModule,
		FormField,
		SpinnerComponent,
		IonIcon
	]
})
export class SignInPage {
	private router = inject(Router);

	passwordVisible = signal(false);
	signInModel = signal({
		email: '',
		password: ''
	});

	signInForm = form(this.signInModel, (schema) => {
		email(schema.email, { message: 'Please enter your email.' });
		required(schema.password, { message: 'This field is required.' });
		required(schema.email, { message: 'This field is required.' });
		minLength(schema.password, 5, { message: 'Please enter more details.' });
	});

	private authService = inject(AuthService);

	authMutationError = signal('');

	authMutation = injectMutation(() => ({
		mutationFn: async (data: { email: string; password: string }) => {
			const result = this.authService.signIn(data.email, data.password);

			return result;
		},
		onSuccess: () => {
			this.router.navigate([''], { replaceUrl: true });
		},

		onError: (err) => {
			this.authMutationError.update(() => err.message);
		}
	}));

	togglePasswordVisibility() {
		this.passwordVisible.update(() => !this.passwordVisible());
	}

	inputPasswordType() {
		return this.passwordVisible() ? 'text' : 'password';
	}

	handleSignIn() {
		if (this.signInForm().invalid()) {
			this.signInForm().markAsTouched();
			return;
		}

		const data = this.signInForm().value();

		this.authMutation.mutate(data);
	}

	handleGoSignUp() {
		this.router.navigate(['/auth/sign-up']);
	}
}
