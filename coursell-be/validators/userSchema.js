const { z } = require("zod");

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// New schema for profile update
const profileSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
});

module.exports = {
  signupSchema,
  signinSchema,
  profileSchema, // Export new schema
};
