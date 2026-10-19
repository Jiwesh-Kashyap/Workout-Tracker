export const SET_TYPES = [
  {
    value: "Standard",
    label: "Standard / Straight Set",
    shortTag: "Standard",
    description: "Standard execution stopping 1-2 reps shy of failure",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/40"
  },
  {
    value: "Partials",
    label: "Till failure plus partials",
    shortTag: "Partials",
    description: "Perform reps to failure, then continue with lengthened partials",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40"
  },
  {
    value: "Form Failure",
    label: "Till form failure",
    shortTag: "Form Failure",
    description: "Perform the set until strict form breaks down",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  },
  {
    value: "Negatives",
    label: "Eccentric only after failure",
    shortTag: "Negatives",
    description: "Focus on 3-5s eccentric-only work after reaching failure",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40"
  },
  {
    value: "Drop Set",
    label: "Drop set (failure + reduce weight)",
    shortTag: "Drop Set",
    description: "Reach failure, immediately reduce weight by 20-30% and continue",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
  },
  {
    value: "Myo-Reps",
    label: "Myo-reps / Rest-Pause",
    shortTag: "Myo-Reps",
    description: "Set to failure, rest 10-15s, then perform 3-5 mini-sets",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  },
  {
    value: "Slow Tempo",
    label: "Slow tempo (accentuated eccentric)",
    shortTag: "Slow Tempo",
    description: "Slow 3-4s lowering tempo on every repetition",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40"
  },
  {
    value: "Static Hold",
    label: "Static hold (isometric at failure)",
    shortTag: "Static Hold",
    description: "Hold the contracted or stretched position to failure",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40"
  }
];

export const getSetTypeInfo = (val) => {
  if (!val) return null;
  const match = SET_TYPES.find(
    t => t.value.toLowerCase() === val.toLowerCase() ||
         t.shortTag.toLowerCase() === val.toLowerCase() ||
         t.label.toLowerCase() === val.toLowerCase()
  );
  if (match) return match;
  return {
    value: val,
    label: val,
    shortTag: val,
    description: val,
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/40"
  };
};
