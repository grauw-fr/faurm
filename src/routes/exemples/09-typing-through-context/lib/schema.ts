import z from 'zod/v4';

export const createTodosFormSchema = z.object({
	todos: z.array(
		z.object({
			id: z.uuid(),
			title: z.string().min(1),
			date: z.string()
		})
	)
});
