let robolegs, robobody, robohead;
let activePart;
let landedParts = [];
let drops = 0;
let maxDrops = 3;
let gameOver = false;
let speed = 3;

// Dialogue system
let dialogueLinesStart = [
    "Those look like robot legs?",
    "Maybe we'll have to build something this time.",
    "(Click to release the robot parts. Drop them at the right moment!)"
];

let dialogueLinesEnd = [
    "Wow, looking good!",
    "It feels pretty fun to make physical things once in a while.",
    "Let's head back now."
];

let dialogueIndex = 0;
let inDialogue = true; 
let endDialogue = false;

// End screen button
let showEndScreen = false;
let buttonX, buttonY, buttonW, buttonH;

function preload() {
    robolegs = loadImage("img/robolegs.png");
    robobody = loadImage("img/robobody.png");
    robohead = loadImage("img/robohead.png");
}

function setup() {
    createCanvas(800, 600);
    startNewPart();
}

function draw() {
    background(255);

    // Draw landed parts
    for (let p of landedParts) {
        image(p.img, p.x, p.y, p.width, p.height);
    }

    // Update active part
    if (activePart && !inDialogue) { 
        if (!activePart.dropping) {
            activePart.x += activePart.vx;
            if (activePart.x < 0 || activePart.x + activePart.width > width) {
                activePart.vx *= -1;
            }
        }

        if (activePart.dropping) {
            activePart.y += activePart.vy;

            // Collision with floor
            if (activePart.y + activePart.height >= height) {
                activePart.y = height - activePart.height;
                landPart();
            } else {
                // Collision with landed parts
                for (let p of landedParts) {
                    if (
                        activePart.y + activePart.height >= p.y &&
                        activePart.y < p.y + p.height
                    ) {
                        // Snap horizontally by center within 50px
                        let centerDiff = (activePart.x + activePart.width / 2) - (p.x + p.width / 2);
                        if (abs(centerDiff) <= 50) {
                            activePart.x = p.x + p.width / 2 - activePart.width / 2;
                        }

                        // Snap vertically on top of the part
                        activePart.y = p.y - activePart.height;
                        landPart();
                        break; // exit loop to avoid null issues
                    }
                }
            }
        }
    }

    // Draw active part
    if (activePart) {
        image(activePart.img, activePart.x, activePart.y, activePart.width, activePart.height);
    }

    // Show dialogue
    if (inDialogue) {
        drawDialogueBox(
            endDialogue ? dialogueLinesEnd[dialogueIndex] : dialogueLinesStart[dialogueIndex]
        );
    }

    // Check if all parts stacked perfectly
    if (!inDialogue && drops >= maxDrops && !showEndScreen) {
        if (checkStacked()) {
            inDialogue = true;
            endDialogue = true;
            dialogueIndex = 0;
        } else {
            resetGame();
        }
    }

    // Draw end screen
    if (showEndScreen) {
        drawEndScreen();
    }
}

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

    if (showEndScreen) {
        if (
            mouseX > buttonX &&
            mouseX < buttonX + buttonW &&
            mouseY > buttonY &&
            mouseY < buttonY + buttonH
        ) {
            window.location.href = "https://www.figma.com/proto/4RbXcyrQdBXZmwyxPkiEoe/PORTFOLIO-CLASS-2025?node-id=52-296&t=BMoFEpF3cZKiq7n9-1&scaling=contain&content-scaling=fixed&page-id=38%3A2";
        }
        return;
    }

    if (activePart && !activePart.dropping) {
        activePart.dropping = true;
    }
}

function startNewPart() {
    if (drops < maxDrops) {
        let partImages = [robolegs, robobody, robohead];
        let partWidths = [300, 350, 300]; 
        activePart = {
            img: partImages[drops],
            width: partWidths[drops],
            height: partWidths[drops] * (partImages[drops].height / partImages[drops].width),
            x: random(width - partWidths[drops]),
            y: 50,
            vx: speed,
            vy: 6,
            dropping: false
        };
    } else {
        activePart = null;
        gameOver = true;
    }
}

function landPart() {
    if (activePart) {
        landedParts.push(activePart);
        drops++;
        startNewPart();
    }
}

function checkStacked() {
    if (landedParts.length < maxDrops) return false;
    let baseCenter = landedParts[0].x + landedParts[0].width / 2;
    for (let p of landedParts) {
        let center = p.x + p.width / 2;
        if (abs(center - baseCenter) > 50) return false;
    }
    return true;
}

function resetGame() {
    landedParts = [];
    drops = 0;
    activePart = null;
    startNewPart();
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
        if (cleanWord === "physical") fill('#00D72B');
        else fill(255);
        text(w + " ", x, y);
        x += textWidth(w + " ");
        if (x > width - 140) {
            x = 70;
            y += textAscent() + textDescent() + 4;
        }
    }
}

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
