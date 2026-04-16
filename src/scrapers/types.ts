import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string(),
  university: z.string(),
  universitySlug: z.string(),
  state: z.string(),
  faculty: z.string(),
  courseName: z.string(),
  courseCode: z.string().optional(),
  level: z.enum(["undergraduate", "postgraduate", "diploma", "pathway"]),
  description: z.string(),
  duration: z.string().optional(),
  atar: z.number().nullable(),
  prerequisites: z.array(z.string()),
  assumedKnowledge: z.array(z.string()),
  recommendedSubjects: z.array(z.string()),
  secondarySubjects: z.array(z.string()),
  careerOutcomes: z.array(z.string()),
  officialUrl: z.string().url(),
  lastUpdated: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;

export const UniversitySchema = z.object({
  name: z.string(),
  slug: z.string(),
  state: z.string(),
  website: z.string().url(),
  courseSearchUrl: z.string().url(),
  type: z.enum(["public", "private", "religious"]),
  locations: z.array(z.string()),
});

export type University = z.infer<typeof UniversitySchema>;

export const AdmissionRoundSchema = z.object({
  id: z.string(),
  university: z.string(),
  universitySlug: z.string(),
  state: z.string(),
  roundType: z.enum(["early-entry", "regular", "scholarship"]),
  roundName: z.string(),
  applicationOpen: z.string().nullable(),
  applicationClose: z.string().nullable(),
  offerDate: z.string().nullable(),
  requirements: z.array(z.string()),
  officialUrl: z.string().url(),
  lastUpdated: z.string(),
});

export type AdmissionRound = z.infer<typeof AdmissionRoundSchema>;
