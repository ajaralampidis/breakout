import './style.css'
import {COLORS} from './constants'

const canvas = document.querySelector('canvas')
function hasCanvas(canvas: HTMLCanvasElement | null): asserts canvas is HTMLCanvasElement {
  if(canvas == null ) {alert("Canvas not found"); throw new Error("Canvas not found")}
}
hasCanvas(canvas)
const cnv: HTMLCanvasElement = canvas
cnv.width = 448
cnv.height = 400

const context = cnv.getContext("2d")
function hasCtx(ctx: CanvasRenderingContext2D | null): asserts ctx is CanvasRenderingContext2D {
  if(ctx == null) {alert("Context not found"); throw new Error("Canvas not found")}
}
hasCtx(context);
const ctx: CanvasRenderingContext2D = context


// Ball:
const ballRadius = 3;
let x = cnv.width / 2
let y = cnv.height - 30
let dx = -2
let dy = -2
// End Ball

// Paddle
const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (cnv.width - paddleWidth) / 2
let paddleY = cnv.height - paddleHeight - 10

let rightPressed = false
let leftPressed = false
// End Paddle

// Bricks
interface brick {
  x: number
  y: number,
  status: BRICK_STATUS,
  color: number
}

enum BRICK_STATUS {
  ACTIVE = 1,
  DESTROYED = 0
}

const brickRowCount = 6
const brickColumnCount = 13
const brickWidth = 30
const brickHieght = 14
const brickPadding = 2
const brickOffsetTop = 80
const brickOffsetLeft = 20
const bricks: brick[][] = []

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for(let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
    const brickY = r * (brickHieght + brickPadding) + brickOffsetTop
    const random = Math.floor(Math.random() * 8)
    bricks[c][r] = {
      x: brickX, y: brickY, status: BRICK_STATUS.ACTIVE, color: random
    }
  }
}
// End Bricks

function drawBall():void {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = COLORS.BALL
  ctx.fill()
  ctx.closePath()
}

function drawPaddle():void {
  ctx.fillStyle = COLORS.PADDLE
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight)
  ctx.closePath()
}
function drawBricks():void {
  for (let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      ctx.fillStyle = COLORS.BRICK
      ctx.rect(
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHieght
      )
      ctx.strokeStyle = COLORS.BRICK_BORDER
      ctx.stroke()
      ctx.fill()
    }
  }
  ctx.closePath()

}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;
      
      const isBallSameXAsBrick = x > currentBrick.x && x < (currentBrick.x + brickWidth)
      const isBallSameYAsBrick = y > currentBrick.y && y < (currentBrick.y + brickHieght)
      if(isBallSameXAsBrick && isBallSameYAsBrick) {
        currentBrick.status = BRICK_STATUS.DESTROYED
        dy = -dy
      }
    
    }
  }
}
function ballMovement() {
  // ball touches sides
  if(
    x + dx > cnv.width - ballRadius ||
    x + dx < 0 + ballRadius
  ) {
    dx = -dx
  }
  // ball touches top
  if(
    y + dy < 0 + ballRadius
  ) {
    dy = -dy
  }

  // ball touches paddle
  const isBallSameXAsPaddle = x > paddleX && x < (paddleX + paddleWidth)
  const isBallSameYAsPaddle = y + dy > paddleY
  if(isBallSameXAsPaddle && isBallSameYAsPaddle) {
    dy = -dy
  }

  // ball touches ground
  if (y + dy > cnv.height - ballRadius) {
    x = cnv.width / 2
    y = cnv.height - 30
    dx = -2
    dy = -2
  }

  x += dx
  y += dy
}
function paddleMovement() {
  const paddleRightBoudnary = paddleX + paddleWidth < cnv.width

  if(rightPressed && paddleRightBoudnary) {
    paddleX += 5
  }

  if(leftPressed && paddleX > 0) {
    paddleX -= 5
  }
}


function cleanCanvas(): void {
  ctx.clearRect(0,0, cnv.width, cnv.height)
}

function initEvents () {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)

  function keyDownHandler (event: KeyboardEvent) {
    const { key } = event
    if(rightPressed || leftPressed) return;
    if (key === 'Right' || key === 'ArrowRight') {
      rightPressed = true
    }
    if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = true
    }
  }

  function keyUpHandler (event: KeyboardEvent) {
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight') {
      rightPressed = false
    }
    if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = false
    }
  }


}

function draw() {
  cleanCanvas()
  collisionDetection()
  
  initEvents()
  drawBricks()
  
  drawBall()
  ballMovement()
  paddleMovement()
  drawPaddle()

  window.requestAnimationFrame(draw)
}

draw()