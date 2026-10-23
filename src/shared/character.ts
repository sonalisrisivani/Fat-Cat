export const poses = ['sleep', 'stretch', 'pet'] as const;
export type Pose = (typeof poses)[number];

export interface PoseDetails {
  label: string;
  description: string;
  caption: string;
}

export const poseDetails: Record<Pose, PoseDetails> = {
  sleep: {
    label: 'Sleep',
    description: 'A round ginger cat curled up asleep, its tail tucked around its belly.',
    caption: 'Doing absolutely nothing. Beautifully.',
  },
  stretch: {
    label: 'Stretch',
    description: 'A chubby ginger cat stretching its front paws, with its rump in the air.',
    caption: 'A big stretch. A very full schedule.',
  },
  pet: {
    label: 'Pet',
    description: 'A happy ginger cat sitting with closed eyes and a little heart above its head.',
    caption: 'Fine. One more head scratch.',
  },
};

export function isPose(value: unknown): value is Pose {
  return typeof value === 'string' && poses.some((pose) => pose === value);
}
