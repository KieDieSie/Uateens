function setup() {
    createCanvas(400, 400);
    Game.addCommonBalloon();
}

function draw() {
    background('skyblue');

    for (let balloon of Game.balloons) {
        balloon.display();
        balloon.move(Game.score);

        if (balloon.y < 25 && balloon.constructor.name != 'AngryBalloon') {
            noLoop();
            clearInterval(interval)
            Game.balloons.length = 0;
            background(136, 220, 166);
            let finalScore = Game.score;
            Game.score = '';
            textSize(64);
            fill('white');
            textAlign(CENTER, CENTER);
            text('FINISH', 200, 200);
            textSize(34);
            text('Score: ' + finalScore, 200, 300);
        }
    }

    textSize(32);
    fill('black');
    text(Game.score, 20, 40);

    if (frameCount % 50 === 0) {
        Game.addCommonBalloon();
    }
    if (frameCount % 100 === 0) {
        Game.addUniqBalloon();
    }
    if (frameCount % 120 === 0) {
        Game.addAngryBalloon();
    }
}

function mousePressed() {
    if (!isLooping()) {
        loop();
        Game.score = 0;
        interval = setInterval(() => {
            SStats()
        }, 5000);
    }
    Game.checkIfBalloonBurst();
    Game.countOfClick++
}

function SStats() {
    let stats = {
        score: Game.score,
        CommonBalloons: Game.countOfCommonBalloon,
        UniqBalloons: Game.countOfUniqBalloon,
        AngryBalloons: Game.countOfAngryBalloon,
        Clicks: Game.countOfClick
    }


    fetch('/stats', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stats)
    })
}

let interval = setInterval(() => {
    SStats()
}, 5000);

class Game {
    static balloons = [];
    static score = 0;
    static countOfCommonBalloon = 0
    static countOfUniqBalloon = 0
    static countOfAngryBalloon = 0
    static countOfClick = 0


    static addCommonBalloon() {
        let commonBalloon = new CommonBalloon('blue', 50);
        this.balloons.push(commonBalloon);
    }

    static addUniqBalloon() {
        let uniqBalloon = new UniqBalloon('green', 30);
        this.balloons.push(uniqBalloon);
    }

    static addAngryBalloon() {
        let angryBalloon = new AngryBalloon('black', 50);
        this.balloons.push(angryBalloon);
    }

    static checkIfBalloonBurst() {
        this.balloons.forEach((balloon, index) => {
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
            if (distance <= balloon.size / 2) {
                balloon.burst(index);
            }
        });
    }
}

class CommonBalloon {
    constructor(color, size) {
        this.x = random(width);
        this.y = random(height - 10, height + 50);
        this.color = color;
        this.size = size;
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
    }

    move(score) {
        if (score < 100) {
            this.y -= 1;
        } else if (score > 100 && score < 200) {
            this.y -= 1.5;
        } else this.y -= 2;
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.score += 1;
        Game.countOfCommonBalloon++
    }
}

class UniqBalloon extends CommonBalloon {
    constructor(color, size) {
        super(color, size);
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.score += 10;
        Game.countOfUniqBalloon++
    }
}

class AngryBalloon extends CommonBalloon {
    constructor(color, size) {
        super(color, size);
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.score -= 10;
        Game.countOfAngryBalloon++
    }
}

