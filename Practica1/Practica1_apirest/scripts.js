const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const ctx = canvas.getContext('2d')



const theme = document.getElementById("theme");
theme.volume = 0.2
const deadSound = document.getElementById("deadSound");
deadSound.volume = 0.2
deadSound.loop = false
const shootSound = document.getElementById("shootSound");
shootSound.volume = 0.2
shootSound.loop = false

if(window.innerHeight > 720 && window.innerWidth > 1280){
    canvas.width = 1280
    canvas.height = 720
}else if(window.innerHeight >= window.innerWidth){
    canvas.width = window.innerWidth
    canvas.height = window.innerWidth*9/16 
}else{
    canvas.width = window.innerHeight*16/9
    canvas.height = window.innerHeight
}
// canvas.width = 1280
// canvas.height = 720

document.getElementById('gameOver').style.fontSize = `${(canvas.width*80)/1280}px`
document.getElementById('newRecord').style.fontSize = `${(canvas.width*80)/1280}px`
document.getElementById('finalScore').style.fontSize = `${(canvas.width*50)/1280}px`
document.getElementById('ldrBrd').style.fontSize = `${(canvas.width*30)/1280}px`
document.getElementById('score').style.fontSize = `${(canvas.width*15)/1280}px`
document.getElementById('rstBtn').style.fontSize = `${(canvas.width*30)/1280}px`
document.getElementById('rstBtn').style.padding = `${(canvas.width*20)/1280}px`
document.getElementById('rstBtn').style.borderRadius = `${(canvas.width*5)/1280}px`
document.getElementById('rstBtn').disabled = true
document.getElementById('btnRecord').style.fontSize = `${(canvas.width*30)/1280}px`
document.getElementById('btnRecord').style.padding = `${(canvas.width*20)/1280}px`
document.getElementById('btnRecord').style.borderRadius = `${(canvas.width*5)/1280}px`
document.getElementById('btnRecord').disabled = true

const invaderScale = (canvas.height*0.06)/720
const playerScale = (canvas.height*0.12)/720
const invaderWidth = 600 * invaderScale

async function showGameOver(){
    document.getElementById('score').style.opacity = 0
    document.getElementById('newRecord').style.opacity = 0
    document.getElementById('gameOver').style.opacity = 1
    document.getElementById('finalScoreEl').innerHTML = score
    document.getElementById('finalScore').style.opacity = 1
    document.getElementById('ldrBrd').style.opacity = 1
    document.querySelector('input').style.opacity = 0
    document.querySelector('input').disabled = true
    document.getElementById('rstBtn').style.zIndex = 10
    document.getElementById('btnRecord').style.zIndex = 0
    document.getElementById('btnRecord').disabled = true
    document.getElementById('rstBtn').disabled = false
    document.getElementById('rstBtn').style.cursor = 'pointer'
    document.getElementById('rstBtn').style.opacity = 1
    await fetch(`http://localhost:8000/records`).then(data => data.json()).then(records => {
                if(records.first.name != "")
                    document.getElementById('spanFirst').innerText = `1. ${records.first.name}: ${records.first.score}`
                else
                    document.getElementById('spanFirst').innerText = ''
                if(records.second.name != "")
                    document.getElementById('spanSecond').innerText = `2. ${records.second.name}: ${records.second.score}`
                else
                    document.getElementById('spanSecond').innerText = ''
                if(records.third.name != "")
                    document.getElementById('spanThird').innerText = `3. ${records.third.name}: ${records.third.score}`
                else
                    document.getElementById('spanThird').innerText = ''
            })
}

function showInputName(top){
    document.getElementById('score').style.opacity = 0
    document.getElementById('newRecord').innerText = "NEW " + top + " RECORD!"
    document.getElementById('newRecord').style.opacity = 1
    document.getElementById('finalScoreEl').innerHTML = score
    document.getElementById('finalScore').style.opacity = 1
    document.querySelector('input').style.opacity = 1
    document.querySelector('input').disabled = false
    document.getElementById('rstBtn').style.zIndex = 0
    document.getElementById('btnRecord').style.zIndex = 10
    document.getElementById('btnRecord').disabled = false
    document.getElementById('btnRecord').style.cursor = 'pointer'
    document.getElementById('btnRecord').style.opacity = 1
}



class Player{
    constructor(){
        this.velocity = {x: 0, y: 0}
        this.position = {x: 0, y: 0}
        this.rotation = 0
        this.opacity = 1

        const image = new Image();
        image.src = 'img/cannon.png'
        image.onload = () => {
            //const scale = 0.12
            this.image = image
            this.width = image.width * playerScale
            this.height = image.height * playerScale
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
        this.radius = (canvas.width*3)/1280
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
        this.width = (canvas.width*3)/1280
        this.height = (canvas.height*10)/720
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
                y: (canvas.height*6)/720
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
            x: (canvas.width*5)/1080,
            y: (canvas.height*0.3)/720
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
        radius: Math.random()*((canvas.width*1)/1280),
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
            radius: Math.random()*((canvas.width*3)/1280),
            color: color || 'yellow',
            fade: true
        }))    
    }
}

let newTop

function playerDead(){
    if(player.opacity != 0){
        console.log("Game Over")
        createParticles({object: player, color: 'red'})
        theme.pause()
        theme.currentTime = 0;
        deadSound.play();
        setTimeout(() => {
            player.opacity = 0
            game.over = true
        }, 0)
        setTimeout(() => {
            grids.length = 0
            invaderProjectiles.length = 0
            projectiles.length = 0
        }, 1950)    
        setTimeout(async () => {
            game.active = false
            await fetch(`http://localhost:8000/records`).then(data => data.json()).then(records => {
                if(score > records.first.score){
                    showInputName("1ST")
                    newTop = "first"
                } else if(score > records.second.score){
                    showInputName("2ND")
                    newTop = "second"
                } else if(score > records.third.score){
                    showInputName("3RD")
                    newTop = "third"
                } else{
                    showGameOver()
                }
            })
        }, 2000)
    }
}
let songPlayed = false;

function animate(){
    //if(!game.active) return
    //requestAnimationFrame(animate)
    ctx.fillStyle = '#24283b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)


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

    player.update()
    
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
        player.velocity.x = -(canvas.width*7)/1280
        player.rotation = -0.15
    }else if(keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = (canvas.width*7)/1280
        player.rotation = 0.15
    }else{
        player.velocity.x = 0
        player.rotation = 0
    }

    //spawn enemies
    if(game.active){
        if(frames % randomInterval === 0){
            grids.push(new Grid())
            randomInterval = Math.floor((Math.random()*500) + 250)
            frames = 0
        }
    }
    

    frames++
}

//animate()

// animate at 45fps 
setInterval(function(){animate()}, 1000/45)

addEventListener('keydown', ({key}) => {
    if(key === "Enter"){
        if(document.getElementById('rstBtn').disabled === false){

            document.getElementById('rstBtn').click()
        }
    }

    if(game.over) return
    
    if(!songPlayed){
        theme.play();
        songPlayed = true
    }

    switch(key){
        case 'a':
        case 'A':
        case 'ArrowLeft':
            keys.a.pressed = true
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
            keys.d.pressed = true
            break
        case ' ':
            if(keys.space.pressed === false){
                shootSound.currentTime = 0.03
                shootSound.play();
                projectiles.push(new Projectile({
                    position:{
                        x: player.position.x + player.width/2,
                        y: player.position.y
                    },
                    velocity:{
                        x: 0,
                        y: -(canvas.height*15)/720,
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
        case 'A':
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
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
    songPlayed = false
    document.getElementById('gameOver').style.opacity = 0
    document.getElementById('finalScore').style.opacity = 0
    document.getElementById('ldrBrd').style.opacity = 0
    document.getElementById('rstBtn').style.opacity = 0
    document.getElementById('rstBtn').disabled = true
    document.getElementById('rstBtn').style.cursor = 'default'
    player.position.x = canvas.width/2 - player.width/2
    player.opacity = 1
    game.over = false
    game.active = true
    animate()
});

document.getElementById('btnRecord').addEventListener("click", async function(){
    const name = document.querySelector('input')
    await fetch(`http://localhost:8000/put/${newTop}/${name.value}/${score}`, {method: 'POST'})
    name.value = ""

    showGameOver()
});

document.querySelector('input').addEventListener("keypress", ({key}) =>{
    if(key === "Enter"){
        document.getElementById('btnRecord').click()
    }
})