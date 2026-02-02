import { workoutSchema } from './src/schema.js';

const tests = [
    { val: "", label: "Empty string" },
    { val: undefined, label: "Undefined" },
    { val: null, label: "Null" },
    { val: "5", label: "String '5'" },
    { val: 0, label: "Number 0" },
    { val: "0", label: "String '0'" }
];

tests.forEach(t => {
    const result = workoutSchema.safeParse({
        exerciseName: "Test",
        sets: t.val,
        reps: t.val,
        weights: 50
    });
    console.log(`${t.label}: Success=${result.success}`);
    if (!result.success) {
        console.log(JSON.stringify(result.error.issues, null, 2));
    }
});
