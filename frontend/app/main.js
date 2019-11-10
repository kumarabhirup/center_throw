/* eslint-disable no-use-before-define */
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const gfx = {}
const sfx = {}

let scaleFactor
let scaledWidth
let scaledHeight
let scaledMouseX
let scaledMouseY
const pixelsPerMeter = 160
const gameState = 'playing'
let dtTimer = 0
let sndMusic

function preload() {
  gfx.background = loadImage(Koji.config.images.backgroundInGame)
  gfx.heart = loadImage(Koji.config.images.heart)
  gfx.heartGrey = loadImage(Koji.config.images.heartGrey)
  gfx.star = loadImage(Koji.config.images.pickup)
  gfx.dirt = loadImage(Koji.config.images.ground)
  gfx.info = loadImage(Koji.config.images.info)
  gfx.player = loadImage(Koji.config.images.player)
  gfx.obstacle = loadImage(Koji.config.images.obstacle)

  sfx.grapple = loadSound(Koji.config.sounds.grapple)
  sfx.jump = loadSound(Koji.config.sounds.jump)
  sfx.star = loadSound(Koji.config.sounds.star)
  sfx.obstacleHit = loadSound(Koji.config.sounds.obstacleHit)
  masterVolume(0.4)

  swingPoints.preload()
}

function setup() {
  const canvas = createCanvas(window.innerWidth, window.innerHeight)

  strokeJoin(ROUND)
  scaleFactor = height / 900
  scaledWidth = width / scaleFactor
  scaledHeight = height / scaleFactor

  menu.load()
  player.load()
  ground.load()
  swingPoints.load()
  obstacles.load()
  stars.load()
  info.load()
  gameOver.load()

  // Sound stuffs
  function playMusic(music, volume = 0.4, loop = false) {
    if (music) {
      music.setVolume(volume)
      music.setLoop(loop)
      music.play()
    }
  }

  /**
   * Load music asynchronously and play once it's loaded
   * This way the game will load faster
   */
  if (Koji.config.sounds.backgroundMusic)
  sndMusic = loadSound(Koji.config.sounds.backgroundMusic, () =>
    playMusic(sndMusic, 0.2, true)
  )
}

function update() {
  scaledMouseX = (mouseX - width / 2) / scaleFactor + scaledWidth / 2
  scaledMouseY = (mouseY - height / 2) / scaleFactor + scaledHeight / 2
  const fixedDt = 1 / 60
  dtTimer += min(1 / frameRate(), 1 / 10)
  while (dtTimer > 0) {
    dtTimer -= fixedDt
    fixedUpdate(fixedDt)
  }
}

function fixedUpdate(dt) {
  switch (gameState) {
    case 'playing':
      player.update(dt)
      ground.update(dt)
      swingPoints.update(dt)
      obstacles.update(dt)
      stars.update(dt)
      info.update(dt)
      gameOver.update(dt)
      break
    case 'gameOver':
      info.update(dt)
      gameOver.update(dt)
      break
  }
}

function mousePressed() {
  switch (gameState) {
    case 'menu':
      menu.mousePressed()
      break
    case 'playing':
      player.mousePressed()
      break
    case 'gameOver':
      gameOver.mousePressed()
      break
  }
}
function touchStarted() {
  if (touches.length === 1) {
    mousePressed()
  }
}

function mouseReleased() {
  switch (gameState) {
    case 'playing':
      player.mouseReleased()
      break
  }
}
function touchEnded() {
  if (touches.length === 0) {
    mouseReleased()
  }
}

function draw() {
  update()
  noStroke()
  background(255)
  push()
  translate(width / 2, height / 2)
  scale(scaleFactor, scaleFactor)
  translate(-scaledWidth / 2, -scaledHeight / 2)
  switch (gameState) {
    case 'menu':
      menu.draw()
      window.setAppView('mainMenu')
      break
    case 'playing':
    case 'gameOver':
      image(gfx.background, -2, -2, scaledWidth + 4, 900 + 4)
      cam.set()
      ground.draw()
      obstacles.draw()
      swingPoints.draw()
      player.draw()
      stars.draw()
      cam.reset()

      // score
      fill(Koji.config.colors.scoreColor)
      textSize(64)
      textAlign(CENTER, CENTER)
      text(player.score, scaledWidth / 2, 80)

      // hp
      for (let i = -1; i <= 1; i++) {
        const img = i + 1 < player.lives ? gfx.heart : gfx.heartGrey
        image(img, scaledWidth / 2 + i * 40 - 16, 120)
      }

      info.draw()
      gameOver.draw()
      break
  }
  pop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  scaleFactor = height / 900
  scaledWidth = width / scaleFactor
  scaledHeight = height / scaleFactor
}
