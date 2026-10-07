// IAT 806 · Lab 03 starter: the dancers from Week 3, ready for your website.
// Run with Live Server. Uses p5 2.x (async setup, await loadImage).

const FRAME_COUNT = 8;

// one array holds all eight poses
let frames = [];

// which frame the click-controlled dancer shows
let index = 0;

// parallel arrays, one entry per animated dancer
let xs = [200, 360, 520];
let speeds = [4, 8, 16]; // draw-frames per pose: smaller = faster

async function setup() {
  const canvas = createCanvas(700, 420);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  textFont("monospace");
  textSize(14);

  // load all eight poses with a loop and string concatenation
  for (let i = 0; i < FRAME_COUNT; i++) {
    frames.push(await loadImage("dance_frames/dance" + i + ".png"));
  }
}

function draw() {
  background(240);

  // contact sheet: every pose, side by side
  for (let i = 0; i < frames.length; i++) {
    image(frames[i], i * 85, 0, 80, 100);
  }

  // click-controlled dancer
  image(frames[index], 20, 140, 160, 200);
  fill(0);
  text("click: frames[" + index + "]", 20, 370);

  // one loop draws every dancer, each at its own x and speed
  for (let i = 0; i < xs.length; i++) {
    let pose = floor(frameCount / speeds[i]) % frames.length;
    image(frames[pose], xs[i], 140, 160, 200);
  }
}

// advance the index, wrapping at the end
function mousePressed() {
  index = (index + 1) % frames.length;
}
