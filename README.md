# Faurm
# VERY WIP 
__faurm__ (pronounced like "form" or "foarm") is a simple library
that aims to enhance the already great [Remote Form](https://svelte.dev/docs/kit/remote-functions#form) from the even greater [SvelteKit](https://svelte.dev/docs/kit/introduction) 

It brings an opinionated way of handling backend typed validation for your exported form functions.
```js
import z from 'zod/v4';
import {faurm} from '@grauw-fr/faurm';

const loginFormSchema = z.object({
    email: z.email('The email field must be a valid email address.'),
    password: z.string()
        .min(1, 'The password is required')
});


export const login = faurm(loginFormSchema, data => {
    // The rest of the owl
});
```

The library uses the "result" to communicate back validation failure. The "result" property has the following typesafe structure
```js
login.result = {
    success: false,
    status: 422,
    errors: {
        email: ["The email field must be a valid email address."]
    }
}
```

## Installation

Use any package manager to add faurm to your project.

```bash
npm install @grauw-fr/faurm
```

## Features
- Typesafe backend validation of forms, using [standard schemas](https://github.com/standard-schema/standard-schema)
- [ ] Devise ways to handle more complexe validation schemas (file inputs, nested schemas, etc)
- [ ] Add a form state manager
- [ ] Make Faurm work with (Formsnap)[https://formsnap.dev/docs]
- [ ] Add more exemples


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Who are we ?
We are the french digital agency GRAUW.
We love to build website and app, mainly using Laravel, Vue and SvelteKit.
Feel free to reach out ! 
[GRAUW.](https://grauw.fr/)