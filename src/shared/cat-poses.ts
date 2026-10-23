export const catPoses = {
  sleep: {
    alt: 'A round ginger cat curled up asleep',
    caption: 'Resting is a full-time job.'
  },
  stretch: {
    alt: 'A ginger cat stretching its front paws with its tail raised',
    caption: 'My one big plan for the afternoon.'
  },
  pet: {
    alt: 'A happy ginger cat leaning into a pet, with rosy cheeks and a heart',
    caption: 'Fine. One more pet.'
  }
} as const;

export type CatPose = keyof typeof catPoses;

export function isCatPose(value: unknown): value is CatPose {
  return typeof value === 'string' && Object.hasOwn(catPoses, value);
}
