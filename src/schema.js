import { z } from "zod";

const preprocessNumber = (val) => {
    if (val === "" || val === null || val === undefined || (typeof val === "number" && isNaN(val))) {
        return 0; // Return 0 so min(1) validation will catch it with proper error message
    }
    return Number(val);
};

export const workoutSchema = z.object({
    exerciseName: z
        .string()
        .min(2, "Exercise name must be at least 2 characters long")
        .max(50, "Exercise name must be at most 50 characters long"),

    weights: z.preprocess(preprocessNumber, z.coerce.number({ invalid_type_error: "Weight must be a number" })
        .min(0, "Weight cannot be a negative")),

    sets: z.preprocess(preprocessNumber, z.coerce.number({ invalid_type_error: "Must be a number" })
        .int()
        .min(1, "At least 1 set is a must"))
    ,
    reps: z.preprocess(preprocessNumber, z.coerce.number({ invalid_type_error: "Must be a number" })
        .int()
        .min(1, "At least 1 rep is a must"))
})
