// validators/adminSchema.js
const { z } = require("zod");

const adminSignupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const adminSigninSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  imageLink: z.string().url(),
  published: z.boolean(),
});

module.exports = {
  adminSignupSchema,
  adminSigninSchema,
  courseSchema,
};
