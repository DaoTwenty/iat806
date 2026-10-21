// IAT 806 · Lab 05 starter: Fighting Pit.
// Run with Live Server. Uses p5 2.x.

let bg;

let music;

// punch and grunt sounds, played one after another
let punch_sounds;
let grunt_sounds;

// an array to put all the fighters in.
let fighters = [];

let HEAD_RADIUS = 20;

let numFighters = 5;

let fighter_styles = [
  {
    name: "barbarian",
    file: "assets/heads/head-mohawk.png",
    color: "#f1c7a5",
    glove_color: "#a70000"
  },
  {
    name: "boxer",
    file: "assets/heads/head-buzz.png",
    color: "#8d5a3b",
    glove_color: "#1f4fbf"
  },
  {
    name: "monk",
    file: "assets/heads/head-bald.png",
    color: "#c68a5e",
    glove_color: "#e07b00"
  },
  {
    name: "samurai",
    file: "assets/heads/head-bun.png",
    color: "#e8b48f",
    glove_color: "#2e2e2e"
  },
  {
    name: "disco",
    file: "assets/heads/head-afro.png",
    color: "#5a3a28",
    glove_color: "#c9a227"
  }
]

// loads a style's head image at the size the fighter is drawn
async function load_head(style) {
  let head = await loadImage(style.file);
  head.resize(2 * HEAD_RADIUS, 2 * HEAD_RADIUS);
  return head;
}

async function setup() {
  const canvas = createCanvas(600, 600);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  angleMode(DEGREES);

  // load every head once
  for (let style of fighter_styles) {
    style.head = await load_head(style);
  }

  // make numFighters fighters, each with a random style and position and orientation
  for (let i = 0; i < numFighters; i++) {
    let style = random(fighter_styles);
    let x = random(HEAD_RADIUS, width - HEAD_RADIUS);
    let y = random(HEAD_RADIUS, height - HEAD_RADIUS);
    let angle = random(0, 360);
    fighters.push(new Fighter(x, y, angle, style.head, color(style.color), color(style.glove_color)));
  }

  bg = await loadImage("assets/pit.png");

  music = await loadSound("assets/music/crouch-jumping.mp3");
  music.amp(0.4);

  punch_sounds = new IterativeSound(sound_files("punch", 5), 0.05);
  grunt_sounds = new IterativeSound(sound_files("grunt", 5), 0.1);
  await punch_sounds.setup();
  await grunt_sounds.setup();
}

// help to list sound files
function sound_files(name, count) {
  let files = [];
  for (let i = 0; i < count; i++) {
    files.push("assets/sounds/" + name + "/" + name + i + ".mp3");
  }
  return files;
}

function draw() {
  background(bg);

  if (!music.isPlaying()) {
    music.loop(true);
    music.start();
  }

  // we iterate over the array of fighters, we update them, and we show them.
  for (let fighter of fighters) {
    fighter.fight(fighters);
    fighter.render();
  }
}

// browsers keep audio muted until the viewer clicks or presses a key
function mousePressed() {
  userStartAudio();
}

function keyPressed() {
  userStartAudio();
  if (key == "f") {
    let style = random(fighter_styles);
    let x = random(HEAD_RADIUS, width - HEAD_RADIUS);
    let y = random(HEAD_RADIUS, height - HEAD_RADIUS);
    let angle = random(0, 360);
    fighters.push(new Fighter(x, y, angle, style.head, color(style.color), color(style.glove_color)));
  }
}

// class defining how a fighter looks and behaves
class Fighter {

  constructor(x_init, y_init, angle_init, head_image, color, glove_color) {
    this.head = head_image;
    this.color = color;
    this.glove_color = glove_color;
    this.left_hit = false;
    this.right_hit = false;
    this.x = x_init;
    this.y = y_init;
    this.angle = angle_init;
    this.life = 100;
    this.punch_timer = -1;
    this.cooldown = -1;
    this.speed = 2;
    this.turn_speed = 5;
    this.damage = 10;
    this.inertia = 0;
    this.inertia_timer = -1;
    this.inertia_dir = 0;
  }

  // renders at position x, y
  render() {
    push();

    // Position and rotaion
    translate(this.x,this.y);
    angleMode(DEGREES);
    rotate(this.angle);

    ellipseMode(CENTER);

    // if dead
    if (this.dead()) {
      this.draw_dead();
      imageMode(CENTER);
      image(this.head, 0, 0);
      pop();
      return;
    }

    // draw right arm
    push();
    fill(this.color);
    noStroke();
    if (this.right_hit) {
      // biceps, extended arm
      ellipse(0.45 * HEAD_RADIUS, 0.8 * HEAD_RADIUS, 0.9 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      // forearm
      ellipse(1.2 * HEAD_RADIUS, 0.8 * HEAD_RADIUS, 0.9 * HEAD_RADIUS, 0.45 * HEAD_RADIUS);
      // glove
      push();
      fill(this.glove_color)
      ellipse(1.6 * HEAD_RADIUS, 0.8 * HEAD_RADIUS, 0.2 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      ellipse(1.8 * HEAD_RADIUS, 0.8 * HEAD_RADIUS, 0.6 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      pop();
    } else {
      // biceps
      ellipse(0, 1.2 * HEAD_RADIUS, 0.5 * HEAD_RADIUS, 0.9 * HEAD_RADIUS);
      // forearm
      ellipse(0.3 * HEAD_RADIUS, 1.5 * HEAD_RADIUS, 0.9 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      // glove
      push();
      fill(this.glove_color)
      ellipse(0.7 * HEAD_RADIUS, 1.5 * HEAD_RADIUS, 0.2 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      ellipse(0.9 * HEAD_RADIUS, 1.5 * HEAD_RADIUS, 0.6 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      pop();
    }
    pop();

    // draw left arm
    push();
    fill(this.color);
    noStroke();
    if (this.left_hit) {
      // biceps, extended arm
      ellipse(0.45 * HEAD_RADIUS, -0.8 * HEAD_RADIUS, 0.9 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      // forearm
      ellipse(1.2 * HEAD_RADIUS, -0.8 * HEAD_RADIUS, 0.9 * HEAD_RADIUS, 0.45 * HEAD_RADIUS);
      // glove
      push();
      fill(this.glove_color)
      ellipse(1.6 * HEAD_RADIUS, -0.8 * HEAD_RADIUS, 0.2 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      ellipse(1.8 * HEAD_RADIUS, -0.8 * HEAD_RADIUS, 0.6 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      pop();
    } else {
      // biceps
      ellipse(0, -1.2 * HEAD_RADIUS, 0.5 * HEAD_RADIUS, 0.9 * HEAD_RADIUS);
      // forearm
      ellipse(0.3 * HEAD_RADIUS, -1.5 * HEAD_RADIUS, 0.9 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      // glove
      push();
      fill(this.glove_color)
      ellipse(0.7 * HEAD_RADIUS, -1.5 * HEAD_RADIUS, 0.2 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      ellipse(0.9 * HEAD_RADIUS, -1.5 * HEAD_RADIUS, 0.6 * HEAD_RADIUS, 0.5 * HEAD_RADIUS);
      pop();
    }
    pop();

    // draw head
    imageMode(CENTER);
    image(this.head, 0, 0);
    pop();
  }

  // return true if dead
  dead() {
    return (this.life <= 0);
  }

  // draws the body lying flat on its back, feet toward +x, arms spread out
  draw_dead() {
    push();
    noStroke();
    fill(this.color);

    // legs and feet
    ellipse(3.6 * HEAD_RADIUS, 0.45 * HEAD_RADIUS, 2.0 * HEAD_RADIUS, 0.6 * HEAD_RADIUS);
    ellipse(3.6 * HEAD_RADIUS, -0.45 * HEAD_RADIUS, 2.0 * HEAD_RADIUS, 0.6 * HEAD_RADIUS);
    ellipse(4.7 * HEAD_RADIUS, 0.5 * HEAD_RADIUS, 0.35 * HEAD_RADIUS, 0.55 * HEAD_RADIUS);
    ellipse(4.7 * HEAD_RADIUS, -0.5 * HEAD_RADIUS, 0.35 * HEAD_RADIUS, 0.55 * HEAD_RADIUS);

    // torso
    ellipse(1.8 * HEAD_RADIUS, 0, 2.4 * HEAD_RADIUS, 1.7 * HEAD_RADIUS);

    // arms outwards
    ellipse(1.1 * HEAD_RADIUS, 1.3 * HEAD_RADIUS, 0.5 * HEAD_RADIUS, 1.0 * HEAD_RADIUS);
    ellipse(1.1 * HEAD_RADIUS, -1.3 * HEAD_RADIUS, 0.5 * HEAD_RADIUS, 1.0 * HEAD_RADIUS);
    ellipse(0.9 * HEAD_RADIUS, 2.1 * HEAD_RADIUS, 0.45 * HEAD_RADIUS, 0.9 * HEAD_RADIUS);
    ellipse(0.9 * HEAD_RADIUS, -2.1 * HEAD_RADIUS, 0.45 * HEAD_RADIUS, 0.9 * HEAD_RADIUS);

    // shorts and gloves
    fill(this.glove_color);
    ellipse(2.9 * HEAD_RADIUS, 0, 1.0 * HEAD_RADIUS, 1.6 * HEAD_RADIUS);
    ellipse(0.75 * HEAD_RADIUS, 2.75 * HEAD_RADIUS, 0.55 * HEAD_RADIUS, 0.6 * HEAD_RADIUS);
    ellipse(0.75 * HEAD_RADIUS, -2.75 * HEAD_RADIUS, 0.55 * HEAD_RADIUS, 0.6 * HEAD_RADIUS);

    pop();
  }

  // scans all others fighters and finds a targett
  find_target(fighters) {
    let target = null;
    let target_dist = 10 * max(width, height);
    // try all fighters
    for (let f of fighters) {
      // if themself or dead figher, skip
      if (f == this || f.dead()) {
        continue;
      }
      let d = dist(this.x, this.y, f.x, f.y);
      // If closer than current target, update
      if (d < target_dist) {
        target = f;
        target_dist = d;
      }
    }
    return target;
  }

  // move towards a target
  move_towards(target) {
    // get orientation of target
    let abs_angle_to_target = atan2(target.y - this.y, target.x - this.x);
    let relative_angel = (abs_angle_to_target - this.angle + 540) % 360 - 180;
    this.angle += constrain(relative_angel, -this.turn_speed, this.turn_speed);

    // get direction towards target
    let d = dist(this.x, this.y, target.x, target.y);
    let x_dir = (target.x - this.x) / d;
    let y_dir = (target.y - this.y) / d;
    // if not close enough, update position
    if (d > 2 * HEAD_RADIUS) {
      this.move(this.speed * x_dir, this.speed * y_dir);
    }
  }

  fight(fighters) {
    this.update_timers();

    // update position based on inertia
    if (this.inertia_timer > 0) {
      let force = map(this.inertia_timer, 0, 20, 0, 10);
      this.move(cos(this.inertia_dir) * force, sin(this.inertia_dir) * force);
    }

    // stop if dead
    if (this.dead()) {
      this.left_hit = false;
      this.right_hit = false;
      return;
    }

    let target = this.find_target(fighters);
    if (target == null) {
      return;
    }
    this.move_towards(target);
    this.punch(target);
  }

  // move fighter by amount, with bouncing off the canvas limits
  move(byHowMuchX, byHowMuchY) {
    this.x += byHowMuchX;
    this.y += byHowMuchY;
    // barrier: keep the whole head inside the canvas
    this.x = constrain(this.x, HEAD_RADIUS, width - HEAD_RADIUS);
    this.y = constrain(this.y, HEAD_RADIUS, height - HEAD_RADIUS);
  }


  // turn fighter 
  turn(byHowMuch) {
    this.angle += byHowMuch;
  }

  // Get hit, deals damage and inertia from the punch
  get_hit(dealer, damage) {
    // ignore hit if dead
    if (this.dead()) {
      return;
    }
    this.life -= damage;
    // grunt on some hits, always on the knockout
    if (this.dead() || random() < 0.4) {
      grunt_sounds.play();
    }
    this.inertia_timer = 20;
    this.inertia_dir =  this.inertia_dir = atan2(this.y - dealer.y, this.x - dealer.x);
  }

  // Punch the target
  punch(target) {
    // if couldown not done, we can'tt punch yet
    if (this.cooldown > 0) {
      return;
    }
    // If we're too far away
    if (dist(this.x, this.y, target.x, target.y) > 2.5 * HEAD_RADIUS) {
      return;
    }
    // randomly use right or left arm
    if (random() < 0.5) {
      this.left_hit = true;
    } else {
      this.right_hit = true;
    }
    // start punch animation timer
    this.punch_timer = 8;
    this.cooldown = int(random(20, 60));

    // random damage amount
    let damage = Math.floor(random(0.6 * this.damage, this.damage));

    // play punch sound
    punch_sounds.play();

    // deal damage to other fighter
    target.get_hit(this, damage);
  }

  // update timers used to track states (punch and inertia)
  update_timers() {

    // update timer for punch animation
    if (this.punch_timer > 0) {
      this.punch_timer += -1;
      if (this.punch_timer == 0) {
        this.left_hit = false;
        this.right_hit = false;
      }
    }

    // update countdown before next punch
    if (this.cooldown > 0) {
      this.cooldown += -1
    }

    // update timer for hit inertia
    if (this.inertia_timer > 0) {
      this.inertia_timer += -1
    }

  }

  changeSize(byHowMuch) {
    // we fix the size like this:
    // the constrain is saying that it shouldn't grow larger than a certain amount.
    this.r = constrain(this.r + random(-byHowMuch, byHowMuch), 2, 50);
  }

}
