let circleX = 50;
let circleY = 50;
let speedX = 1;
let speedY = 1;
let size = 100;
let sizeIncrement = 1;
let radius = size / 2;
let ballColor;
// indicates force on or off
let force = false;
// Add max size for ball
let MAX_SIZE = 75;
let MIN_SIZE = 25;
let radial_force;
let force_angle;
let speed_magnitude;
let max_speed = 25;
let force_multiplier = 1000;
let earth_radius = 150;
let earth_image;
let moon_image;
let circle_mask_moon;
let circle_mask_earth;
let trailing_pos = [];
let num_trailing = 100;
let trail_start_color;
let trail_end_color;

async function setup() {
  createCanvas(800, 600);
  stroke("#ffffff");
  earth_image = await loadImage("assets/earth.png");
  moon_image = await loadImage("assets/moon.png");
  circle_mask_moon = createGraphics(100, 100);
  circle_mask_moon.circle(50, 50, 90);
  moon_image.resize(100, 100);
  moon_image.mask(circle_mask_moon);
  circle_mask_earth = createGraphics(earth_radius, earth_radius);
  circle_mask_earth.circle(earth_radius/2, earth_radius/2, 120);
  earth_image.resize(earth_radius, earth_radius);
  earth_image.mask(circle_mask_earth);
  trail_start_color = color(45, 30, 99, 150);
  trail_end_color = color(100, 40, 20, 0);
  imageMode(CENTER);
}

function draw() {
  background("#000000");

  // If force is activated (when the mouse is pressed)
  if (force) {
    console.log("force on")
    //force of gravity proporitional to -1/r^2
    let diff_magn = sqrt((circleX - mouseX)**2 + (circleY - mouseY)**2);
    radial_force = force_multiplier / diff_magn;
    // trigonometry to project on x and y axis
    // dv = a * dt (with dt = 1 frame) and a = force
    speedX -= (circleX - mouseX) / diff_magn * radial_force / diff_magn;
    speedY -= (circleY - mouseY) / diff_magn * radial_force / diff_magn;
    // variating gradient gloz
    let r = earth_radius * (1 + 0.2 * sin(frameCount / 2));
    noStroke();
    // create gradient
    let myGradient = drawingContext.createRadialGradient(mouseX, mouseY, earth_radius / 2, mouseX, mouseY, r);
    myGradient.addColorStop(0, "#3760be");
    myGradient.addColorStop(0.2, "#4c2abd");
    myGradient.addColorStop(0.5, "#2b2046");
    myGradient.addColorStop(1, "#000000");
    drawingContext.fillStyle = myGradient;

    //draw gradient
    circle(mouseX, mouseY, r * 2);

    //create a line in direction of force
    stroke("#ffffff");
    line(
        circleX, 
        circleY, 
        circleX - (circleX - mouseX) / diff_magn * 100, 
        circleY - (circleY - mouseY) / diff_magn * 100
    )
  }
  //draw image
  image(earth_image, mouseX, mouseY);
  // clip speed
  speed_magnitude = sqrt(speedX**2 + speedY**2);
  if (speed_magnitude > max_speed) {
    speedX *= max_speed/speed_magnitude;
    speedY *= max_speed/speed_magnitude;
  }

  // move
  circleX = circleX + speedX;
  circleY = circleY + speedY;

  // grow (or shrink)
  size = size + sizeIncrement;
  // do not allow negative size
  if (size < 0) {
    size = abs(size);
    sizeIncrement = abs(sizeIncrement);
  }
  // do not allow past certain size
  if (size >= MAX_SIZE) {
    sizeIncrement = - abs(sizeIncrement);
  }
  // do not allow under size
  if (size <= MIN_SIZE) {
    sizeIncrement = abs(sizeIncrement);
  }
  radius = size / 2;

  // changed bounce formula because if the ball goes far enough
  // that reversing it doesnt put it back in boundaries in one loop,
  // then it reverses a second consecutive time, and this becomes
  // an infinite loop. This new formula keeps it in the right direction
  // as long as it's out of boundaries
  if (circleX >= width - radius) {
    speedX = - abs(speedX);
    circleX = width - radius;
    sizeIncrement = sizeIncrement * -1;
  }
  if (circleX < radius) {
    speedX = abs(speedX);
    circleX = radius;
    sizeIncrement = sizeIncrement * -1;
  }
  if (circleY >= height - radius) {
    speedY = - abs(speedY);
    circleY = height - radius;
  }
  if (circleY < radius) {
    speedY = abs(speedY);
    circleY = radius;
  }

  // update list of past position for trailing mark
  trailing_pos.push({x: circleX, y: circleY});
  if (trailing_pos.length > num_trailing) {
    trailing_pos = trailing_pos.slice(trailing_pos.length - num_trailing);
  }
  // draw trail with fading circle
  for (let i=0; i<trailing_pos.length; i++) {
    let pos = trailing_pos[i];
    let t = i / (trailing_pos.length - 1);
    let trail_color = lerpColor(trail_start_color, trail_end_color, 1 - t);
    fill(trail_color);
    noStroke();
    circle(pos.x, pos.y, size * t);
  }
  //draw the moon
  image(moon_image, circleX, circleY);
}

// activate the repellant force when pressed down
function mousePressed() {
  force = true;
}

//de-activate force when mouse is released
function mouseReleased(event) {
    force = false;
}