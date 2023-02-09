const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const ctx = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 720


const invaderScale = 0.06
const invaderWidth = 600 * invaderScale;

class Player{
    constructor(){
        this.velocity = {x: 0, y: 0}
        this.position = {x: 0, y: 0}
        this.rotation = 0
        this.opacity = 1

        const image = new Image();
        image.src = 'img/cannon.png'
        image.onload = () => {
            const scale = 0.12
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width/2 - this.width/2,
                y: canvas.height - this.height - 20}
        }
    }

    draw(){
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height) 
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.translate(player.position.x + player.width/2, player.position.y + player.height/2)
        ctx.rotate(this.rotation)
        ctx.translate(-player.position.x - player.width/2, -player.position.y - player.height/2)
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        ctx.restore()
    }

    update(){
        if(this.image){
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 3
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'yellow'
        ctx.fill()
        ctx.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({position, velocity, radius, color, fade}){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fade = fade
    }

    draw(){
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.fade)
            this.opacity -= 0.015
    }
}

class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 10
    }

    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader{
    constructor({position}){
        this.velocity = {x: 0, y: 0}
        this.position = {x: 0, y: 0}

        const image = new Image();
        image.src = 'img/invader.png'
        image.onload = () => {
            const scale = invaderScale
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y}
        }
    }

    draw(){
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height) 
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}){
        if(this.image){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles){
        invaderProjectiles.push(new InvaderProjectile({
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height
            },
            velocity:{
                x: 0,
                y: 6
            }
        }))
    }
}

class Grid {
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 5,
            y: 0.3
        }

        this.invaders = []

        this.randomProjectileInterval = Math.floor((Math.random()*60) + 80)

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * invaderWidth

        for(let x=0; x < columns; x++){
            for(let y=0; y < rows; y++){
                this.invaders.push(new Invader({
                    position:{
                        x: x * invaderWidth,
                        y: y * invaderWidth,
                    }
                }))
            }
        }
    }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x
        }

    }
}

const player = new Player()
const projectiles = []
const invaderProjectiles = []
const particles = []
const grids = []
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    space: {
        pressed: false,
    }
}

let frames = 0
// invaders spawn rate
let randomInterval = Math.floor((Math.random()*500) + 250)

let game = {
    over: false,
    active: true
}

let score = 0

// create stars
for(let i=0; i<100; i++){
    particles.push(new Particle({
        position:{
            x: Math.floor(Math.random()*canvas.width),
            y: Math.floor(Math.random()*canvas.height)
        },
        velocity:{
            x: 0,
            y: 1
        },
        radius: Math.random()*1,
        color: 'white',
        fade: false
    }))    
}

// particles for explosions
function createParticles({object, color}){
    for(let i=0; i<15; i++){
        particles.push(new Particle({
            position:{
                x: object.position.x + object.width/2,
                y: object.position.y + object.height/2
            },
            velocity:{
                x: (Math.random() - 0.5)*2,
                y: (Math.random() - 0.5)*2
            },
            radius: Math.random()*3,
            color: color || 'yellow',
            fade: true
        }))    
    }
}

function playerDead(){
    if(player.opacity != 0){
        console.log("Game Over")
        createParticles({object: player, color: 'red'})
        setTimeout(() => {
            player.opacity = 0
            game.over = true
        }, 0)
        setTimeout(() => {
            grids.length = 0
            invaderProjectiles.length = 0
            projectiles.length = 0
        }, 1950)
        setTimeout(() => {
            game.active = false

            document.getElementById('score').style.opacity = 0
            document.getElementById('gameOver').style.opacity = 1
            document.getElementById('finalScoreEl').innerHTML = score
            document.getElementById('finalScore').style.opacity = 1
            document.getElementById('rstBtn').disabled = false
            document.getElementById('rstBtn').style.cursor = 'pointer'
            document.getElementById('rstBtn').style.opacity = 1
        }, 2000)
        
    }
}

function animate(){
    if(!game.active) return
    //requestAnimationFrame(animate)
    ctx.fillStyle = '#24283b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    player.update()

    // animate particles (explosions)
    particles.forEach((particle, index) => {

        if(particle.position.y - particle.radius >= canvas.height && !particle.fade){
            particle.position.x = Math.floor(Math.random()*canvas.width)
            particle.position.y = - particle.radius
        }

        if(particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(index, 1)
            }, 0)
        } else{
            particle.update()
        }
    })
    
    // animate projectiles
    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }else{
            projectile.update()
        }
    })

    // animate invader projectiles
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(() => {
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                }, 0)
            })
        }else{
            invaderProjectile.update()
        }

        // invader projectile hits player
        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width){
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
            playerDead()
        }
    })

    // animate grids of invaders
    grids.forEach((grid, indexGrid) => {
        grid.update()
        //spawn invader projectiles
        if(frames % grid.randomProjectileInterval === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles)
            grid.randomProjectileInterval = Math.floor((Math.random()*60) + 80)
        }

        grid.invaders.forEach((invader, indexInv) => {
            invader.update({velocity: grid.velocity})

            //enemy hits player
            if(invader.position.y + invader.height >= player.position.y &&
                invader.position.x + invader.width/2 >= player.position.x &&
                invader.position.x - invader.width/2 <= player.position.x + player.width/2 &&
                invader.position.y <= player.position.y + player.height){
                    playerDead()
                }

            // player projectiles hit enemy
            projectiles.forEach((projectile, indexPr) => {
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y){

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invaderCheck => {
                            return invaderCheck === invader
                        })
                        const projectileFound = projectiles.find(projectileCheck => {
                            return projectileCheck === projectile
                        })
                        //remove invader and projectile
                        if(invaderFound && projectileFound){
                            score += 100
                            scoreEl.innerHTML = score
                            createParticles({object: invader, fade: true})
                            grid.invaders.splice(indexInv, 1)
                            projectiles.splice(indexPr, 1)

                            if(grid.invaders.length > 0){
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length -1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x 
                            }else{
                                grids.splice(indexGrid, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })

    // player movement 
    if(keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -7
        player.rotation = -0.15
    }else if(keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 7
        player.rotation = 0.15
    }else{
        player.velocity.x = 0
        player.rotation = 0
    }

    //spawn enemies
    if(frames % randomInterval === 0){
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random()*500) + 250)
        frames = 0
    }

    frames++
}

//animate()

// animate at 45fps 
setInterval(function(){animate()}, 1000/45)

addEventListener('keydown', ({key}) => {
    if(game.over) return

    switch(key){
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            if(keys.space.pressed === false){
                projectiles.push(new Projectile({
                    position:{
                        x: player.position.x + player.width/2,
                        y: player.position.y
                    },
                    velocity:{
                        x: 0,
                        y: -15,
                    }
                }))
            }
            keys.space.pressed = true
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch(key){
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break
    }
})

document.getElementById('rstBtn').addEventListener("click", function(){
    document.getElementById('score').style.opacity = 1
    score = 0
    scoreEl.innerHTML = 0
    frames = 0
    document.getElementById('gameOver').style.opacity = 0
    document.getElementById('finalScore').style.opacity = 0
    document.getElementById('rstBtn').style.opacity = 0
    document.getElementById('rstBtn').disabled = true
    document.getElementById('rstBtn').style.cursor = 'default'
    player.position.x = canvas.width/2 - player.width/2
    player.opacity = 1
    game.over = false
    game.active = true
    animate()
});