// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { LaravelServiceResponseError } from '$lib/services/laravel-service';

declare global {
	namespace App {
		interface Error extends LaravelServiceResponseError {}
		interface Locals {
			userPromise: Promise<User>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		namespace Models {
			type User = {
				id: string;
				first_name: string;
				last_name: string;
				email: string;
			};
			type Workspace = {
				id: string
				name: string
				description? : string
				status: 'Published' | 'Private' | 'PasswordProtected'
				created_at: string
				updated_at: string
			}
		}
	}

}

export {};
