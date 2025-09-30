let mockup;
let headingImg, formImg, closeImg;
let clickableImages = [];
let score = 0;
let maxScore = 3;

// Dialogue system
let dialogueLinesStart = [
  "Hm... Seems like we have to find some UX errors on this mockup.",
  "It looks more like your expertise, so I'll leave it to you!",
  "(Find and click on three UX violations!)"
];

let dialogueLinesEnd = [
  "I knew you could do it!",
  "Now that we've found the errors, hopefully someone can improve the accessibility and usability of this website.",
  "That's none of our business though. Let's move on to the next hint!"
];

let dialogueIndex = 0;
let inDialogue = true; // starts with dialogue
let endDialogue = false;

// End screen button
let showEndScreen = false;
let buttonX, buttonY, buttonW, buttonH;

function preload() {
  // Load painting background
  mockup = loadImage("img/UXmockup.png");
  headingImg = loadImage("img/heading.png");
  formImg = loadImage("img/form.png");
  closeImg = loadImage("img/close.png");
}

function setup() {
  createCanvas(800, 600);
  let startX = width / 2 - 100;
  let y = height / 2 - 150;
  clickableImages.push({ img: headingImg, x: 166, y: y, clicked: false });
  clickableImages.push({ img: formImg, x: 166, y: 340, clicked: false });
  clickableImages.push({ img: closeImg, x: 610, y: 410, clicked: false });
}

function draw() {
  background(255);

  image(mockup, 120, 100, 576, 398);

  // Draw clickable images with optional red stroke if clicked
  for (let item of clickableImages) {
    image(item.img, item.x, item.y);

    if (item.clicked) {
      noFill();
      stroke(255, 0, 0);
      strokeWeight(4);
      rectMode(CORNER); // ✅ fix: match how images are drawn
      rect(item.x, item.y, item.img.width, item.img.height);
    }
  }

  // Draw score indicator at top-right
  fill(255, 0, 0);
  noStroke();
  textSize(24);
  textAlign(RIGHT, TOP);
  text(`UX errors: ${score}/${maxScore}`, 267, 50);

  // Show dialogue box if in dialogue
  if (inDialogue) {
    drawDialogueBox(
      endDialogue
        ? dialogueLinesEnd[dialogueIndex]
        : dialogueLinesStart[dialogueIndex]
    );
  }

  // Trigger end dialogue when all items clicked
  if (!inDialogue && !endDialogue && score >= maxScore) {
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

    // ✅ Only change color for end dialogue
    if (endDialogue && (cleanWord.toLowerCase() === "accessibility" || cleanWord.toLowerCase() === "usability")) {
      fill("#0080ffff"); // blue
    } else if (cleanWord === "creative") {
      fill(255, 0, 0); // red for "creative"
    } else {
      fill(255); // default white
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

  // Check if any clickable image was clicked (only if dialogue finished)
  for (let item of clickableImages) {
    if (!item.clicked) {
      let halfW = item.img.width;
      let halfH = item.img.height;
      if (
        mouseX > item.x &&
        mouseX < item.x + halfW &&
        mouseY > item.y &&
        mouseY < item.y + halfH
      ) {
        item.clicked = true;
        score++;
        break; // only one image can be clicked at a time
      }
    }
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
        "https://www.figma.com/proto/4RbXcyrQdBXZmwyxPkiEoe/PORTFOLIO-CLASS-2025?node-id=52-226&t=Vgo36DrmaUO5A9XL-0&scaling=contain&content-scaling=fixed&page-id=38%3A2";
    }
    return;
  }
}
