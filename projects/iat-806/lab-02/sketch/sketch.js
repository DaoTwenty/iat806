let circleX = 50;
let circleY = 50;
let speedX = 1;
let speedY = 1;
let size = 100;
let sizeIncrement = 1;
let radius = size / 2;
let rightColor = "blue";
let leftColor = "red";
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
let force_multiplier = 25;
let earth_radius = 150;
let earth_image;
let moon_image;
let circle_mask_moon;
let circle_mask_earth;

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
  imageMode(CENTER);
}

function draw() {
  background("#000000");

  // left half is one color, right half is the other
  /*
  if (circleX > width / 2) {
    ballColor = rightColor;
  } else {
    ballColor = leftColor;
  }
  */

  if (force) {
    console.log("force on")
    radial_force = force_multiplier /sqrt((circleX - mouseX)**2 + (circleY - mouseY)**2);
    speedX -= (circleX - mouseX) * radial_force / sqrt((circleX - mouseX)**2 + (circleY - mouseY)**2);
    speedY -= (circleY - mouseY) * radial_force / sqrt((circleX - mouseX)**2 + (circleY - mouseY)**2);
    stroke("#ffffff");
    line(
        circleX, 
        circleY, 
        circleX - 200 * (circleX - mouseX)/ sqrt((circleX - mouseX)**2 + (circleY - mouseY)**2), 
        circleY - 200 * (circleY - mouseY) / sqrt((circleX - mouseX)**2 + (circleY - mouseY)**2)
    )
    let r = earth_radius * (1 + 0.2 * sin(frameCount / 30));
    noStroke();
    
    let myGradient = drawingContext.createRadialGradient(mouseX, mouseY, earth_radius / 2, mouseX, mouseY, r);
    myGradient.addColorStop(0, "#3760be");
    myGradient.addColorStop(0.4, "#4c2abd");
    myGradient.addColorStop(0.8, "#2b2046");
    myGradient.addColorStop(1, "#000000");
    drawingContext.fillStyle = myGradient;
    //drawingContext.strokeStyle = 'rgba(210, 202, 202, 0)';

    //stroke("#ffffff");
    circle(mouseX, mouseY, r * 2);
  }
  image(earth_image, mouseX, mouseY);
  speed_magnitude = sqrt(speedX**2 + speedY**2);
  if (speed_magnitude > max_speed) {
    speedX = max_speed;
    speedY = max_speed;
  }
  //noFill();
  //fill(ballColor);

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

  // bounce off the left and right walls, and flip growing/shrinking
  /*
  if (circleX >= width - radius || circleX < radius) {
    speedX = speedX * -1;
    sizeIncrement = sizeIncrement * -1;
  }
  */
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
    speedY = - abs(speedY)
  }
  if (circleY < radius) {
    speedY = abs(speedY)
  }

  // bounce off the top and bottom walls
  /*
  if (circleY >= height - radius || circleY < radius) {
    speedY = speedY * -1;
  }
  */

  //let circle_shape = circle(circleX, circleY, size);
  //circleMask.circle(circleX, circleY, size);
  //moon_image.resize(size, size)
  //moon_image.mask(circleMask);
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