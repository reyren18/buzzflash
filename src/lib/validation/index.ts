// in this file we will keep all our validations in one place and export them 
import * as z from "zod";

// this is the schema that validates our sign up form.
export const SignUpFormSchema = z.object({
    username: z.string().min(2, {message: "Username must be at least 2 characters"}).max(20, {message: "Username must be at most 20 characters"}),
    email: z.string().email({message: "Email is not valid"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"}),
    name: z.string().min(2, {message: "Name must be at least 2 characters"}),
  });


  export const SignInFormSchema = z.object({
    email: z.string().email({message: "Email is not valid"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"}),
  });

export const PostSchema = z.object({
  caption: z.string(),
  file: z.custom<File[]>(),
  location: z.string(),
  tags: z.string(),
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});