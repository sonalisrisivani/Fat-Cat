import { catPoses, isCatPose } from '../shared/cat-poses';

const cat = document.querySelector<HTMLImageElement>('#cat');
const caption = document.querySelector<HTMLParagraphElement>('#caption');
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-pose]');

if (!cat || !caption) {
  throw new Error('Character preview markup is incomplete.');
}

for (const button of buttons) {
  button.addEventListener('click', () => {
    const pose = button.dataset.pose;
    if (!isCatPose(pose)) return;
    cat.src = `../assets/cat/${pose}.svg`;
    cat.alt = catPoses[pose].alt;
    caption.textContent = catPoses[pose].caption;
    cat.classList.toggle('react', pose === 'pet');
    for (const control of buttons) {
      control.setAttribute('aria-pressed', String(control === button));
    }
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) cat.classList.remove('react');
});
