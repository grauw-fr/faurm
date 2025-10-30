<script lang="ts">
    import {createProfile} from "./lib/profil.remote.js";
    import {useFaurm} from "$lib/use-faurm.svelte.js";
    import {Control, Description, Errors, Field, Fieldset, Label, Legend} from "$lib/components/index.js";
    import {createProfileFormSchema} from "./lib/schema.js";
    import {FormLabel} from "$lib/components/ui/form/index.js";

    const form = useFaurm(createProfile, {
        validate: createProfileFormSchema,
        initialData: {
            name: "Alex"
        },
        delay: 500,
        timeout: 3000
    })
</script>

<form {...form.enhance} enctype="multipart/form-data">
    <Field {form} name="name">
        <Control>
            {#snippet children({props, field})}
                <FormLabel>What is your name</FormLabel>
                <input autocomplete="given-name" {...props} {...field.as('text')}/>
            {/snippet}
        </Control>
        <Description>Your given birth name</Description>
        <Errors/>
    </Field>

    <Field {form} name="bio">
        <Control>
            {#snippet children({props, field})}
                <Label>Biography</Label>
                <textarea {...props} {...field.as("text")}></textarea>
            {/snippet}
        </Control>
        <Description>Tell us about yourself</Description>
        <Errors/>
    </Field>

    <Fieldset {form} name="favorite_framework">
        <Legend>What is your favorite framework</Legend>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('radio', 'SvelteKit')}/>
                <Label>SvelteKit</Label>
            {/snippet}
        </Control>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('radio', 'Svelte')}/>
                <Label>Svelte</Label>
            {/snippet}
        </Control>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('radio', 'Kit')}/>
                <Label>Kit</Label>
            {/snippet}
        </Control>
        <Errors />
    </Fieldset>

    <Fieldset {form} name="privacy_options">
        <Legend>I agree to</Legend>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('checkbox', 'marketing')}/>
                <Label>Receive marketing emails</Label>
            {/snippet}
        </Control>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('checkbox', 'newsletter')}/>
                <Label>Receive our daily newsletter</Label>
            {/snippet}
        </Control>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('checkbox', 'all')}/>
                <Label>Receive all emails</Label>
            {/snippet}
        </Control>

        <Errors />
    </Fieldset>

    <Field {form} name="profile_picture">
        <Control>
            {#snippet children({props, field})}
                <Label>Profile Picture</Label>
                <input {...props} {...field.as('file')}/>
            {/snippet}
        </Control>
        <Description>Please provide a recent picture of yourself</Description>
        <Errors />
    </Field>
    <input type="submit" value="Submit"/>
</form>