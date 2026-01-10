import { z } from "zod";

export const workoutSchema = z.object({
    exerciseName: z
        .string()
        .min(2, "Exercise name must be at least 2 characters long")
        .max(50, "Exercise name must be at most 50 characters long"),

    weights: z.coerce.number({ invalid_type_error: "Weight must be a number" })
        .min(0, "Weight cannot be a negative"),

    sets: z.coerce
        .number()
        .int()
        .min(1, "At least 1 set is a must")
        .max(7, "That is not recommended"),

    reps: z.coerce
        .number()
        .int()
        .min(1, "At least 1 rep is a must")
        .max(20, "Increase the weight instead")
})
