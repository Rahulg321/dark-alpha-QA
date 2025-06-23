'use server';

import { z } from 'zod';

import { createUser, getUser, verifyUser, userVerified, generateVerificationToken} from '@/lib/db/queries';

import { signIn } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,"invalid password"),
  verifiedPassword: z.optional(z.string()),
});

const allowedDomains = [
  "darkalphacapital.com",
  "gmail.com"
];

export const verify = async (
  userId: string,
  verificationToken: string
): Promise<boolean> => {
  try {
    return await verifyUser(userId, verificationToken);
  } catch (error) {
    return false;
  }
};

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!userVerified(validatedData.email)) {
      return {status: 'unverified_account'};
    }

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
      verifiedPassword: formData.get('verify-password'),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: 'user_exists' } as RegisterActionState;
    }
    if (validatedData.password !== validatedData.verifiedPassword) {
      return {status: 'unverified_password'} as RegisterActionState;
    }
    if (!allowedDomains.includes(validatedData.email.split('@').pop())) {
      return {status: 'unallowed_domain'} as RegisterActionState;
    }

    await createUser(validatedData.email, validatedData.password);

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues);
      if (error.issues[0].message == "invalid password") {
        return {
          status: 'invalid_password'
        };
      }
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export const newVerificationLink = async (
  userEmail: string,
): Promise<boolean> => {
  try {
    const [user] = await getUser(userEmail);
    generateVerificationToken(userEmail, user.id);
  } catch (error) {
    console.log(error)
  }
};
