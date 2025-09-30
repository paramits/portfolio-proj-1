let img;
let ghostImg;
let splatters = [];
let numEnemy = 10;
let enemies = []; // array to store enemy positions
let diameter = 100; // fixed diameter

// Dialogue system
let dialogueLinesStart = [
  "Looks like those guys are messing around with that painting!",
  "Getting rid of them might give us a hint to help Sabrina.",
  "(Click on the ghosts to get rid of them.)"
];

let dialogueLinesEnd = [
  "Nice job! They're all gone now.",
  "Too bad they messed up the painting... or maybe not?",
  "It looks a little more creative now wouldn't you say?",
  "Anyways, let's head back for now."
];

let dialogueIndex = 0;
let inDialogue = true; // starts with dialogue
let endDialogue = false;

// End screen button
let showEndScreen = false;
let buttonX, buttonY, buttonW, buttonH;

function preload() {
  // Load local ghost SVG
  ghostImg = loadImage("img/ghost.svg");

  // Load painting background
  img = loadImage(
    "img/painting.png"
  );
}

function setup() {
  createCanvas(800, 600);

  // Initialize enemies
  for (let i = 0; i < numEnemy; i++) {
    let enemy = {
      x: random(diameter / 2, width - diameter / 2),
      y: random(diameter / 2, height - diameter / 2),
      vx: random(-2, 2),
      vy: random(-2, 2),
    };
    enemies.push(enemy);
  }
}

function draw() {
  background(220);

  // Draw painting background
  fill(255);
  rect(400 - 200, 300 - 200, 400, 400);
  image(img, 400,300, 350, 350);

  // Draw splatters
  for (let s of splatters) {
    fill(s.color);
    noStroke();
    for (let p of s.particles) {
      ellipse(p.x, p.y, p.size);
    }
  }

  // Draw enemies only if not end screen
  if (!showEndScreen) {
    for (let c of enemies) {
      c.x += c.vx;
      c.y += c.vy;

      if (c.x < diameter / 2 || c.x > width - diameter / 2) c.vx *= -1;
      if (c.y < diameter / 2 || c.y > height - diameter / 2) c.vy *= -1;

      imageMode(CENTER);
      image(ghostImg, c.x, c.y, diameter, diameter);
    }
  }

  // Show dialogue box if in dialogue
  if (inDialogue) {
    drawDialogueBox(
      endDialogue
        ? dialogueLinesEnd[dialogueIndex]
        : dialogueLinesStart[dialogueIndex]
    );
  }

  // If all enemies are gone, trigger end dialogue
  if (!inDialogue && enemies.length === 0 && !endDialogue && !showEndScreen) {
    inDialogue = true;
    endDialogue = true;
    dialogueIndex = 0;
  }

  // Show end screen after final dialogue
  if (showEndScreen) {
    drawEndScreen();
  }
}

function drawDialogueBox(line) {
  fill(0, 0, 0, 250);
  rect(50, height - 120, width - 100, 100);

  textSize(20);
  textAlign(LEFT, TOP);

  let words = line.split(" ");
  let x = 70;
  let y = height - 100;

  for (let w of words) {
    let cleanWord = w.replace(/[.,!?]/g, "");
    if (cleanWord === "creative") {
      fill(255, 0, 0); // red for "creative"
    } else {
      fill(255);
    }
    text(w + " ", x, y);
    x += textWidth(w + " ");
    if (x > width - 140) {
      x = 70;
      y += textAscent() + textDescent() + 4;
    }
  }
}

function drawEndScreen() {
  // White screen
  fill(255);
  rect(0, 0, width, height);

  // Button dimensions
  buttonW = 300;
  buttonH = 60;
  buttonX = width / 2 - buttonW / 2;
  buttonY = height / 2 - buttonH / 2;

  // Hover state check
  let hovering =
    mouseX > buttonX &&
    mouseX < buttonX + buttonW &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonH;

  // Button background
  if (hovering) {
    fill(255, 255, 0); // yellow on hover
  } else {
    fill(200); // gray default
  }
  rect(buttonX, buttonY, buttonW, buttonH, 10);

  // Button text
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Return to Main Scene", width / 2, height / 2);
}

// Detect click
function mousePressed() {
  if (inDialogue) {
    dialogueIndex++;
    if (!endDialogue && dialogueIndex >= dialogueLinesStart.length) {
      inDialogue = false;
    } else if (endDialogue && dialogueIndex >= dialogueLinesEnd.length) {
      inDialogue = false;
      showEndScreen = true;
    }
    return;
  }

  // Handle end screen button click
  if (showEndScreen) {
    if (
      mouseX > buttonX &&
      mouseX < buttonX + buttonW &&
      mouseY > buttonY &&
      mouseY < buttonY + buttonH
    ) {
      window.location.href =
        "https://www.figma.com/proto/4RbXcyrQdBXZmwyxPkiEoe/PORTFOLIO-CLASS-2025?node-id=52-143&t=URdfekjVnAUjTBZI-0&scaling=contain&content-scaling=fixed&page-id=38%3A2";
    }
    return;
  }

  // Enemy click only if not in dialogue
  for (let i = enemies.length - 1; i >= 0; i--) {
    let c = enemies[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d < diameter / 2) {
      createSplatter(c.x, c.y);
      enemies.splice(i, 1);
    }
  }
}

function createSplatter(x, y) {
  let splatter = {
    color: color(random(255), random(255), random(255)),
    particles: [],
  };

  for (let i = 0; i < 10; i++) {
    let angle = random(TWO_PI);
    let radius = random(80, 100);
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;
    let size = random(15, 30);
    splatter.particles.push({ x: px, y: py, size: size });
  }

  splatters.push(splatter);
}
