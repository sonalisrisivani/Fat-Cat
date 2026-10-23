import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPose, poseDetails, poses } from '../src/shared/character.ts';

test('only supported pose values cross the UI boundary', () => {
  for (const pose of poses) assert.equal(isPose(pose), true);
  for (const value of [undefined, null, {}, [], 1, '', 'Sleep', '../sleep', 'walk']) {
    assert.equal(isPose(value), false);
  }
});

test('every pose has distinct accessible description and caption', () => {
  assert.equal(new Set(poses.map((pose) => poseDetails[pose].description)).size, 3);
  assert.equal(new Set(poses.map((pose) => poseDetails[pose].caption)).size, 3);
  for (const pose of poses) assert.ok(poseDetails[pose].label.length > 0);
});
