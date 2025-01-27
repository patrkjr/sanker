import * as z from 'zod';

export const createFormSchema = z.object({
  price: z
    .string({
      required_error: 'Price is required.',
      invalid_type_error: 'Price must be a whole number.',
    })
    .regex(/^\d+$/, 'Must be a number'),
  title: z
    .string()
    .min(2, 'Give your item a title that is at least 3 characters long.'),
  condition: z.enum(['new', 'used', 'worn'], {
    errorMap: (issue, ctx) => ({ message: 'Please describe the condition.' }),
  }),
  description: z.string(),
  use_user_address: z.boolean(),
  show_exact_address: z.boolean(),
  image_urls: z
    .array(
      z.object({
        uri: z.string().url(),
      })
    )
    .min(1, 'You need at least 1 image'),
});
