const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const lineWidth = 15;
const gapX = 15

const mouse = { x: 0, y: 0 }

//Desenho do campo
const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        ctx.fillStyle = "#286047";
        ctx.fillRect(0, 0, this.w, this.h);
    }
}

// Linha
const line = {
    w: 15,
    h: field.h,
    draw: function () {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
    }

}

//Raquete esquerda
const leftPadlle = {
    x: gapX,
    y: 0,
    w: lineWidth,
    h: 200,
    speed: 5,
    _move: function () {
        this.y = mouse.y - this.h / 2;
    },
    draw: function () {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    }
}

//raquete direita
const rightPadlle = {
    x: field.w - line.w - gapX,
    y: 300,
    w: lineWidth,
    h: 200,
    speed: 5,
    _move: function () {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed
        } else {
            this.y -= this.speed
        }
    },
    speedUp: function () {
        this.speed += 2;
    },
    draw: function () {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    }
}

//Bola
const ball = {
    x: 0,
    y: 0,
    r: 20,
    speed: 2,
    directionX: 1,
    directionY: 1,

    calcPosition: function () {

        //Verifica pontuação do human
        if (this.x > field.w - gapX - this.r - lineWidth) {
            //verifica se a raquete rebateu
            if (this.y + this.r > rightPadlle.y &&
                this.y - this.r < rightPadlle.y + rightPadlle.h) {
                this.reverseX();
            } else {
                //marca ponto e retorna bola ao centro
                score.increaseHuman();
                this.pointUp();
            }
        }


        //Verifica pontuação do computador
        if (this.x < this.r + leftPadlle.w + gapX) {
            //verifica se a raquete rebateu
            if (this.y + this.r > leftPadlle.y &&
                this.y - this.r < leftPadlle.y + leftPadlle.h) {
                this.reverseX();
            } else {
                //marca ponto e retorna bola ao centro
                score.increaseCpu();
                this.pointUp();
                rightPadlle.speedUp();
            }
        }


        //Rebate a bola nas laterais do campo
        if ((this.y > field.h - this.r && this.directionY > 0) ||
            (this.y - this.r < 0 && this.directionY < 0)) {
            this.reverseY();
        }

    },



    //Muda a direção da bola alterando para incremento negativo no eixo X
    reverseX: function () {
        this.directionX *= -1;
    },

    //Muda a direção da bola alterando para incremento negativo no eixo Y
    reverseY: function () {
        this.directionY *= -1;
    },

    //retorna a bola ao meio do campo
    pointUp: function () {
        this.speedUp();

        this.x = field.w / 2;
        this.y = field.h / 2;
    },

    //Movimentção da bola
    _move: function () {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    },

    //aumenta a velocidade da bolinha
    speedUp: function () {
        this.speed += 3;
    },


    draw: function () {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        ctx.fill();

        this.calcPosition();
        this._move();

    }
}

//pontuação
const score = {
    human: 1,
    cpu: 0,
    increaseHuman: function () {
        this.human++
    },
    increaseCpu: function () {
        this.cpu++
    },
    draw: function () {
        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#01341D";

        ctx.fillText(this.human, field.w / 4, 100);
        ctx.fillText(this.cpu, field.w / 4 + field.w / 2, 100);
    }

}


function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.height = window.innerHeight;
    ctx.width = window.innerWidth;
}

function draw() {

    field.draw();
    line.draw();
    leftPadlle.draw();
    rightPadlle.draw();
    score.draw();
    ball.draw();

}

//suaviza animação
window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup();
main();

canvas.addEventListener("mousemove", function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;

    console.log(mouse)
})
