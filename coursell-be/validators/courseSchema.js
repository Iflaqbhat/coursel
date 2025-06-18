const { z } = require("zod");

const coursePurchaseSchema = z.object({
  courseId: z.string().min(1),
});

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  imageLink: z.string().url(),
  published: z.boolean().optional(),
  content: z.string().optional(), // New field for course content
});

module.exports = {
  coursePurchaseSchema,
  courseSchema,
};
