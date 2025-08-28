var velocidad = 1;
var angulo = 0;
var girando = false;

var pocion, pocionI;
var pintura, pinturaI;
var pinturaR, pinturaRI;
var ground;

var pinturagroup;
var pinturaRgroup;

var score = 0;
var vidas = 3;
var estado = "menu";

var morir;
var splash;
var perderVida;

function preload() {
  pinturaI = loadImage("pintura amarilla.png");
  pinturaRI = loadImage("pintura roja.png");
  pocionI = loadImage("pocion.webp");
  morir = loadSound("morir.mp3");
  perderVida = loadSound("perdervida.mp3");
  splash = loadSound("splash.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  pocion = createSprite(width / 2, height - 40, 20, 20);
  pocion.addImage(pocionI);
  pocion.scale = 0.2;

  pinturagroup = createGroup();
  pinturaRgroup = createGroup();

  ground = createSprite(width / 2, height - 20, width, 30);
  ground.shapeColor = "purple";
}

function draw() {
  background(125, 171, 255);

  if (estado === "menu") {
    mostrar_menu();
  } else if (estado === "juego") {
    jugar();
  } else if (estado === "gameOver") {
    gameOver();
  }
}

function jugar() {
  fill("green");
  textSize(30);
  text("Puntos: " + score, 10, 25);
  text("Vidas: " + vidas, 10, 50);

  // Controles con teclado
  if (keyIsDown(LEFT_ARROW)) pocion.x -= 13;
  if (keyIsDown(RIGHT_ARROW)) pocion.x += 13;
  if (keyIsDown(UP_ARROW)) pocion.y -= 13;
  if (keyIsDown(DOWN_ARROW)) pocion.y += 13;
  if (keyDown("space")) pocion.velocityY = -10;

  // Controles con pantalla táctil (izquierda/derecha)
  if (touches.length > 0) {
    if (touches[0].x < width / 2) {
      pocion.x -= 13;
    } else {
      pocion.x += 13;
    }
    touches = [];
  }

  pocion.velocityY += 0.5;
  pocion.collide(ground);

  // Crear pinturas
  pinturas();
  pinturasR();

  // Colisiones
  if (pocion.isTouching(pinturagroup)) {
    pinturagroup.destroyEach();
    score += 1;
    splash.play();
  }

  if (pocion.isTouching(pinturaRgroup)) {
    pinturaRgroup.destroyEach();
    vidas -= 1;
    perderVida.play();

    if (vidas <= 0) {
      estado = "gameOver";
      if (!morir.isPlaying()) {
        morir.play();
      }
    }
  }

  if (pinturagroup.isTouching(ground)) {
    pinturagroup.destroyEach();
    score -= 1;
  }

  drawSprites();
}

function pinturas() {
  if (frameCount % 60 === 0) {
    pintura = createSprite(random(10, width - 10), 30, 50, 50);
    pintura.addImage(pinturaI);
    pintura.scale = 0.3;
    pintura.velocityY = 6 + Math.floor(score / 5) * 2;
    pinturagroup.add(pintura);
  }
}

function pinturasR() {
  if (frameCount % 70 === 0) {
    pinturaR = createSprite(random(10, width - 10), 30, 50, 50);
    pinturaR.addImage(pinturaRI);
    pinturaR.scale = 0.1;
    pinturaR.velocityY = 6 + Math.floor(score / 5) * 2;
    pinturaRgroup.add(pinturaR);
  }
}

function mostrar_menu() {
  textAlign(CENTER, CENTER);
  textSize(40);
  fill("black");
  text("POCIÓN ATRAPAPINTURA", width / 2, height / 3);
  textSize(20);
  text("Presiona tu pantalla o clic para comenzar", width / 2, height / 2);

  if (touches.length > 0 || mouseIsPressed) {
    reiniciarJuego();
    estado = "juego";
  }
}

function gameOver() {
  textAlign(CENTER, CENTER);
  textSize(40);
  fill("red");
  text("GAME OVER", width / 2, height / 3);
  textSize(20);
  text("Puntos finales: " + score, width / 2, height / 2);
  text("Presiona pantalla/clic o ENTER para comenzar", width / 2, height / 1.5);

  if (touches.length > 0 || mouseIsPressed || keyDown("ENTER")) {
    reiniciarJuego();
    estado = "juego";
  }
}

function reiniciarJuego() {
  score = 0;
  vidas = 3;
  pinturagroup.destroyEach();
  pinturaRgroup.destroyEach();
  pocion.position.x = width / 2;
  pocion.position.y = height - 80;
  touches = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ground.position.x = width / 2;
  ground.position.y = height - 30;
  ground.width = width;
}
