// import flow from './node_modules/lodash-es/flow.js'

const clock = 100
let lastFrameTime = performance.now()
const directions = {
    ArrowLeft: [-20, 0],
    ArrowRight: [20, 0],
    ArrowDown: [0, 20],
    ArrowUp: [0, -20],
}
let score = 0;

export const loopDraw = () => {
    const snakePlayer = new snake(60, 0)
    const canvas = document.getElementById('snake')
    const ctx = canvas.getContext('2d')
    addControllers(snakePlayer)
    const food = generateFood()
    drawScene(ctx, snakePlayer, food)
}

const drawScene = (ctx, snakePlayer, food) => {
    if (performance.now() - lastFrameTime > clock) {
        clearScene(ctx)
        snakePlayer.move()

        const foodToBeEaten = checkCollision(snakePlayer.getHeadSegment(), food)

        food = foodToBeEaten.length > 0 ? eat(foodToBeEaten, food) : food
        snakePlayer.segments = foodToBeEaten.length > 0 ? addSegment(snakePlayer.segments) : snakePlayer.segments
        score  = foodToBeEaten.length > 0 ? ++score : score

        draw(ctx, drawText, [{text: `Score: ${score}`}])
        draw(ctx, drawRect, snakePlayer.segments)
        draw(ctx, drawRect, food)
        lastFrameTime = performance.now()
    }
    requestAnimationFrame(() => {
        drawScene(ctx, snakePlayer, food)
    })
}

const snake = class Snake {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.direction = {
            x: 20,
            y: 0,
        }
        this.segments = [
            { x: x - 40, y },
            { x: x - 20, y },
            { x, y },
        ]
    }

    move() {
        this.segments = this.segments.map((segment, index) => {
            const headSegment = {
                x: segment.x + this.direction.x,
                y: segment.y + this.direction.y,
            }

            return index != this.segments.length - 1 ? this.segments[index + 1] : headSegment
        })
    }

    changeDirection(x, y) {
        this.direction = {
            x,
            y,
        }
    }

    getHeadSegment() {
      return this.segments[this.segments.length - 1]
    }
}

const draw = (ctx, drawFunc, elements) => {
    elements.forEach((element) => {
        drawFunc(ctx, element)
    })
}

const drawRect = (ctx, element) => {
    ctx.fillStyle = 'rgb(200, 0, 0)'
    ctx.fillRect(element.x, element.y, 20, 20)
}

const drawText = (ctx, element) => {
  ctx.font = '48px serif';
  ctx.fillStyle = 'rgb(0, 0, 0)'
  ctx.fillText(element.text, 10, 50);
}

const addSegment = (segments) => {
    const segment = {
        x: segments[0].x - Math.abs(segments[1].x - segments[0].x),
        y: segments[0].y - Math.abs(segments[1].y - segments[0].y),
    }
    return [segment, ...segments]
}

const eat = (foodIndexes, food) => {
    const foodIndex = foodIndexes[0]
    food.splice(foodIndex, 1)
    return food
}

const generateFood = () => {
    let food = []
    for (let i = 0; i < 50; i++) {
        const x = getRandomInt(0, 1600)
        const y = getRandomInt(0, 800)
        food.push({
            x: x - (x % 20) + 20 * !!(x % 20),
            y: y - (y % 20) + 20 * !!(y % 20),
        })
    }

    return food
}

const checkCollision = (agent, colliders) => {
    return colliders
        .map((collider, index) => {
            if (collider.x === agent.x && collider.y == agent.y) {
                collider = { ...collider, index }
            }

            return collider
        })
        .filter((collider) => collider.index !== undefined)
        .map((collider) => collider.index)
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

const addControllers = (player) => {
    document.addEventListener('keydown', function (event) {
        const [x, y] = directions[event.code] || [20, 0]
        player.changeDirection(x, y)
    })
}

const clearScene = (ctx) => {
  return ctx.clearRect(0, 0, 1600, 800)
}

window.loopDraw = loopDraw
