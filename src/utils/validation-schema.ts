import { z as zod } from 'zod';

const countryNames = ['Nigeria', 'Ghana'];
const allowedCountryOfResidence = ['Nigeria'];
function nameSchema(field: string, regex: RegExp, min: number, max: number) {
  return zod
    .string()
    .regex(regex)
    .min(min, `${field} must contain at least 3 characters`)
    .max(max, `${field} must contain at most 30 characters`);
}
const today = new Date();
const minDOB = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
);

const stepOneSchema = zod.object({
  firstName: nameSchema('First name', /[a-zA-Z'-\\s]+$/, 3, 30),
  lastName: nameSchema('Last name', /[a-zA-Z'-\\s]+$/, 3, 30),
  username: nameSchema('Username', /^[a-zA-Z0-9_]+$/, 3, 30),
  email: zod.string().email({ message: 'Please provide a valid email' }),
  dateOfBirth: zod.coerce
    .date()
    .max(minDOB, { message: 'You must be at least 18 years old' })
    .min(new Date('1923-01-01'), {
      message: 'Date of birth cannot be before 1923'
    }),
  gender: zod.enum(['male', 'female'], { message: 'Please select a gender' })
});

const stepTwoSchema = zod.object({
  address: zod
    .string()
    .min(10, 'Address must be at least 10 characters long')
    .max(1000, 'Address must not exceed 1000 characters')
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, 'Invalid address format')
    .nonempty('Address is required'),
  nationality: zod.enum(countryNames as [string, ...string[]]),
  countryOfResidence: zod.enum(
    allowedCountryOfResidence as [string, ...string[]]
  )
});
const stepThreeSchema = zod.object({
  password: zod
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message:
        'Password must include uppercase, lowercase, a digit, and a special character.'
    }),
  confirmPassword: zod.string()
});

export const combinedSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export const stepFields = [
  ['firstName', 'lastName', 'username', 'email', 'dateOfBirth', 'gender'],
  ['address', 'nationality', 'countryOfResidence'],
  ['password', 'confirmPassword']
] as const;

export type FormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  address: string;
  nationality: string;
  countryOfResidence: string;
  password: string;
  confirmPassword: string;
};

// const watchedValues = watch(
//   currentStepFields as readonly (keyof FormValues)[]
// );
