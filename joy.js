let circles = [];
let triangles = [];
let draggingTriangle = null;
let offsetX = 0;
let offsetY = 0;

// Dialogue system
let dialogueLinesStart = [
  "It looks like those people are looking for something.",
  "Let's help them out!",
  "(Click and drag the items on the bottom to the matching person.)"
];

let dialogueLinesEnd = [
  "It looks like we brought some joy to them by helping them out!",
  "We should be done with all the hints. Let's go back!"
];

let dialogueIndex = 0;
let inDialogue = true; // starts with dialogue
let endDialogue = false;

// End screen button
let showEndScreen = false;
let buttonX, buttonY, buttonW, buttonH;

// Images
let heartImg, diamondImg, squareImg, happyImg;

function preload() {
  heartImg = loadImage("img/heart.gif");
  diamondImg = loadImage("img/diamond.gif");
  squareImg = loadImage("img/square.gif");
  happyImg = loadImage("img/happy.png");
}

function setup() {
  createCanvas(800, 600);

  // Horizontal alignment
  let circleY = 150;
  let triangleY = 450;
  let positions = [(150+100), 400, 550];

  // Circles replaced with images
  circles.push({ x: positions[0], y: circleY, img: heartImg, matched: false });
  circles.push({ x: positions[1], y: circleY, img: diamondImg, matched: false });
  circles.push({ x: positions[2], y: circleY, img: squareImg, matched: false });

  // Triangles (logic placeholders, visuals overridden in draw)
  triangles.push({ x: positions[0], y: triangleY, size: 60, target: 0 });
  triangles.push({ x: positions[1], y: triangleY, size: 60, target: 2 });
  triangles.push({ x: positions[2], y: triangleY, size: 60, target: 1 });
}

function draw() {
  background(255);

  // Draw circles (images now)
  for (let c of circles) {
    let imgToShow = c.matched ? happyImg : c.img;
    imageMode(CENTER);
    image(imgToShow, c.x, c.y, (464 / 3), (595 / 3));
  }

  // Draw shapes instead of triangles
  for (let i = 0; i < triangles.length; i++) {
    let t = triangles[i];
    push();
    translate(t.x, t.y);
    noStroke();

    if (i === 0) {
      // Orange Heart
      fill("#F5BE00");
       ellipse(0, 0, t.size, t.size);
    } else if (i === 1) {
      // Purple Square
      fill("#7F4DE3");
      rectMode(CENTER);
      rect(0, 0, t.size, t.size);
    } else if (i === 2) {
      // Green Diamond
      fill("#08BD4A");
      beginShape();
      vertex(0, -t.size / 2);
      vertex(t.size / 2, 0);
      vertex(0, t.size / 2);
      vertex(-t.size / 2, 0);
      endShape(CLOSE);
    }

    pop();
  }

  // Show dialogue if active
  if (inDialogue) {
    drawDialogueBox(
      endDialogue ? dialogueLinesEnd[dialogueIndex] : dialogueLinesStart[dialogueIndex]
    );
  }

  // Check if all circles matched to trigger end dialogue
  if (!inDialogue && !endDialogue && circles.every(c => c.matched)) {
    inDialogue = true;
    endDialogue = true;
    dialogueIndex = 0;
  }

  // Draw end screen
  if (showEndScreen) {
    drawEndScreen();
  }
}

function mousePressed() {
  // Dialogue click handling
  if (inDialogue) {
    dialogueIndex++;
    if (!endDialogue && dialogueIndex >= dialogueLinesStart.length) {
      inDialogue = false;
    } else if (endDialogue && dialogueIndex >= dialogueLinesEnd.length) {
      inDialogue = false;
      showEndScreen = true;
    }
    return; // prevent triangle interaction during dialogue
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
        "https://www.figma.com/proto/4RbXcyrQdBXZmwyxPkiEoe/PORTFOLIO-CLASS-2025?node-id=52-339&t=BMoFEpF3cZKiq7n9-1&scaling=contain&content-scaling=fixed&page-id=38%3A2";
    }
    return;
  }

  // Shape drag start
  if (!inDialogue) {
    for (let t of triangles) {
      let d = dist(mouseX, mouseY, t.x, t.y);
      if (d < t.size / 2) {
        draggingTriangle = t;
        offsetX = t.x - mouseX;
        offsetY = t.y - mouseY;
        break;
      }
    }
  }
}

function mouseDragged() {
  if (draggingTriangle && !inDialogue) {
    draggingTriangle.x = mouseX + offsetX;
    draggingTriangle.y = mouseY + offsetY;
  }
}

function mouseReleased() {
  if (draggingTriangle && !inDialogue) {
    let targetCircle = circles[draggingTriangle.target];
    let d = dist(draggingTriangle.x, draggingTriangle.y, targetCircle.x, targetCircle.y);
    if (d <= 80) {
      targetCircle.matched = true;
      draggingTriangle.x = targetCircle.x;
      draggingTriangle.y = targetCircle.y + 50;
    }
    draggingTriangle = null;
  }
}

// Dialogue box rendering
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
    if (cleanWord === "joy") fill("#FFBE31");
    else fill(255);
    text(w + " ", x, y);
    x += textWidth(w + " ");
    if (x > width - 140) {
      x = 70;
      y += textAscent() + textDescent() + 4;
    }
  }
}

// End screen button
function drawEndScreen() {
  noStroke();
  fill(255);
  rect(0, 0, width, height);

  buttonW = 300;
  buttonH = 60;
  buttonX = width / 2 - buttonW / 2;
  buttonY = height / 2 - buttonH / 2;

  let hovering =
    mouseX > buttonX &&
    mouseX < buttonX + buttonW &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonH;

  if (hovering) fill(255, 255, 0);
  else fill(200);

  rect(buttonX, buttonY, buttonW, buttonH, 10);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Return to Main Scene", width / 2, height / 2);
}
