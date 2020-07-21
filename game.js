document.onkeydown = checkKey;
document.onkeyup = keyUp;

var stage = 0;

var hero = {
  pos: {x: 110, y: 250},
  speed: {x: 0, y: 0},
  acc: {x: 0, y: 2},
  health: 100,
  flash: 0,
  freezedown: 0,
  burst: {r: 0, x: 0, y: 0},
  degree: 0,
}
var MLGbuilds = 100;

var enemy = {
  pos: {x: 750, y: 30},
  health: 30,
  stunned: 0,
}

var blocks = Array();
var mode = 'test';
var viewPort = [-400,0];

var winx = 150
var winy = 250
for(i = 0; i < 1000; i += 20) {
  for(j = 260; j < 520; j += 20) {
    blocks.push([i, j]);
  }
}

// console.log('bricks')
// console.log(bricks.length)
for(i = 0; i < bricks.length; i++) {
  // console.log([bricks[i][0]*20, bricks[i][1]*20])
  blocks.push([bricks[i][0]*20 - 200, bricks[i][1]*20 - 800])
}

function checkKey(e) {
  if (e.key == 'ArrowRight' ) {
    hero.acc.x = 2;
  }
  if (e.key == 'ArrowLeft' ) {
    hero.acc.x = -2;
  }
  if (e.key == 'ArrowUp' ) {
    if(hero.speed.y == 0) {
      hero.speed.y = -15;
    }
  }

  if (e.key == ' ') {
    if (hero.freezedown == 0) {
      hero.burst.r = 10;
      hero.burst.x = hero.pos.x;
      hero.burst.y = hero.pos.y;
      if (
        Math.abs(enemy.pos.x - hero.pos.x) < 40 && 
        Math.abs(enemy.pos.y - hero.pos.y) < 40
      ) {
        if (enemy.health > 0) {
          enemy.health -= 10;
          enemy.stunned = 10;
          hero.freezedown = 100;
        }
      }
    }
  }
  if (e.key == 'm') {
    block = mineCheck(hero.pos.x, hero.pos.y);
    for (i = 0; i < blocks.length; i++) {
      if (block == blocks[i]) {
        blocks.splice(i,1);
        MLGbuilds = MLGbuilds + 1
        break;
      }
    }
  }
  if (e.key == 'b') {
    x = hero.pos.x - 10;
    y = hero.pos.y + 10;

    if (MLGbuilds > 0 && hero.pos.y > 10) {
      obstacle = obstacleCheck(hero.pos.x, hero.pos.y-20)
      if (!obstacle) {
        MLGbuilds = MLGbuilds - 1
        blocks.push([x, y - 20]);
        hero.pos.y = hero.pos.y - 20
      }
    }
  }
}

function keyUp(e) {
  if (e.key == 'ArrowRight' ) {
    hero.acc.x = 0;
  }
  if (e.key == 'ArrowLeft' ) {
    hero.acc.x = 0;
  }
}

function obstacleCheck(x, y) {
  x = x - 10;
  y = y - 10;
  obstacle = false;
  for (i = 0; i < blocks.length; i++) {
    block = blocks[i];
    if (
      (Math.abs(x - block[0]) < 20 && y - block[1] >= 0 && y - block[1] < 20)
    ) {
      obstacle = block;
      break;
    }
  }
  return obstacle;
}

function mineCheck(x, y) {
  x = x - 10;
  y = y - 10;
  obstacle = false;
  for (i = 0; i < blocks.length; i++) {
    block = blocks[i];
    if (
      (Math.abs(x - block[0]) < 10 && y + 20 == block[1])
    ) {
      obstacle = block;
      break;
    }
  }
  return obstacle;
}

function drawWin() {
  context.fillStyle = "yellow"
  context.fillRect(winx-viewPort[0],winy-viewPort[1],40,40)
}

function drawMap() {
  context.fillStyle = "black"
  context.strokeRect(1010,400,180,90)
  for(i=0; i<blocks.length; i++) {
    bx = blocks[i][0] + 0.0;
    by = blocks[i][1] + 0.0;
    context.fillRect(1010+bx/100.0,400+by/100.0,1,1)
  }
}

function drawBlocks() {
  context.fillStyle = 'grey';
  for (i = 0; i < blocks.length; i++) {
    block = blocks[i];
    xp = block[0];
    yp = block[1];
    context.fillRect(xp-viewPort[0],yp-viewPort[1], 20,20);
  }
}

function drawInventory() {
  context.clearRect(1005,0, 1200, 520);
  context.fillStyle = "#0eded9";
  context.fillRect(1000,0, 5,520);

  context.fillStyle = 'grey';
  context.fillRect(1100,10,20,20)
  context.fillStyle = 'green';
  context.font = "18px sans-serif";
  context.fillText(MLGbuilds + " X", 1050, 30);

  context.fillText("HP " + hero.health, 1050,345)
  
  context.fillText("x " + (winx - hero.pos.x), 1050,365)
  context.fillText("y " + (winy - hero.pos.y), 1050,385)
}

function drawHero() {
  x=hero.pos.x;
  y=hero.pos.y;
  context.fillStyle = "#FF0000";
  context.beginPath();
  context.arc(hero.pos.x-viewPort[0], hero.pos.y-viewPort[1], 10, 0, 2 * Math.PI);
  context.fill();

  context.fillStyle = 'black';
  context.beginPath();

  for (r = 0; r <= 9; r++) {
    context.arc(
      hero.pos.x-viewPort[0]+(r*Math.cos(hero.degree)), 
      hero.pos.y-viewPort[1]+(r*Math.sin(hero.degree)), 
      1, 0, 2 * Math.PI);
    context.fill();
  }

  if (hero.burst.r) {
    context.fillStyle = 'yellow';
    c = {x: hero.burst.x-viewPort[0], y: hero.burst.y-viewPort[1]}
    for (i = 0; i < 2 * Math.PI; i += 0.1) {
      context.beginPath();
      context.arc(c.x + hero.burst.r * Math.cos(i), c.y + hero.burst.r * Math.sin(i), 1, 0, 2 * Math.PI);
      context.fill();
    }
  }

  // context.fillStyle = "black";
  pixels = [
    {x: 2, y:1 },
    {x: 3, y:1 },
    {x: 6, y:1 },
    {x: 7, y:1 },

    {x: 1, y:2 },
    {x: 2, y:2 },
    {x: 3, y:2 },
    {x: 4, y:2 },
    {x: 5, y:2 },
    {x: 6, y:2 },
    {x: 7, y:2 },
    {x: 8, y:2 },

    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 3, y: 3},
    {x: 4, y: 3},
    {x: 5, y: 3},
    {x: 6, y: 3},
    {x: 7, y: 3},
    {x: 8, y: 3},

    {x: 1, y: 4},
    {x: 2, y: 4},
    {x: 3, y: 4},
    {x: 4, y: 4},
    {x: 5, y: 4},
    {x: 6, y: 4},
    {x: 7, y: 4},
    {x: 8, y: 4},

    {x: 2, y: 5},
    {x: 3, y: 5},
    {x: 4, y: 5},
    {x: 5, y: 5},
    {x: 6, y: 5},
    {x: 7, y: 5},

    {x: 2, y: 6},
    {x: 3, y: 6},
    {x: 4, y: 6},
    {x: 5, y: 6},
    {x: 6, y: 6},
    {x: 7, y: 6},
    
    {x: 3, y: 7},
    {x: 4, y: 7},
    {x: 5, y: 7},
    {x: 6, y: 7},
    
    {x: 4, y: 8},
    {x: 5, y: 8},
  ];
  // s = 2;
  // for(var i = 0; i < pixels.length; i++) {
  //   xp = (x-10) + pixels[i].x * s;
  //   yp = (y-10)+pixels[i].y * s;
  //   context.fillRect(xp-viewPort[0], yp-viewPort[1], s, s);
  // }
}

function drawSword(x, y) {
  context.fillStyle = "gray";
  pixels = [
    {x: 7, y:-2 , color:'red'},
    {x: 8, y:-2 , color:'red'},
    {x: 7, y:-1 , color:'red'},
    {x: 8, y:-1 , color:'red'},

    {x: 7, y:0 , color:'red'},
    {x: 8, y:0 , color:'red'},
    {x: 7, y:1 , color:'red'},
    {x: 8, y:1 , color:'red'},

    {x: 7, y:2 , color:'red'},
    {x: 8, y:2 , color:'red'},
    {x: 7, y:3 , color:'red'},
    {x: 8, y:3 , color:'red'},

    {x: 7, y:4 , color:'red'},
    {x: 8, y:4 , color:'red'},
    {x: 7, y:5 , color:'red'},
    {x: 8, y:5 , color:'red'},

    {x: 4, y: 6, color:'black'},
    {x: 6, y: 6, color:'gold'},
    {x: 7, y: 6, color:'gold'},
    {x: 8, y: 6, color:'gold'},
    {x: 9, y: 6, color:'gold'},
    {x: 11, y: 6, color:'black'},
    {x: 4, y: 7, color:'black'},
    {x: 6, y: 7, color:'gold'},
    {x: 7, y: 7, color:'gold'},
    {x: 8, y: 7, color:'gold'},
    {x: 9, y: 7, color:'gold'},
    {x: 11, y: 7, color:'black'},
    
    {x: 5, y: 8, color:'gold'},
    {x: 6, y: 8, color:'gold'},
    {x: 7, y: 8, color:'gold'},
    {x: 8, y: 8, color:'gold'},
    {x: 9, y: 8, color:'gold'},
    {x: 10, y: 8, color:'gold'},
    {x: 5, y: 9, color:'gold'},
    {x: 6, y: 9, color:'gold'},
    {x: 7, y: 9, color:'gold'},
    {x: 8, y: 9, color:'gold'},
    {x: 9, y: 9, color:'gold'},
    {x: 10, y: 9, color:'gold'},
    
    {x: 7, y: 10, color: 'brown'},
    {x: 8, y: 10, color: 'brown'},
    {x: 7, y: 11, color: 'brown'},
    {x: 8, y: 11, color: 'brown'},
    
    {x: 7, y: 12, color: 'brown'},
    {x: 8, y: 12, color: 'brown'},
    {x: 7, y: 13, color: 'brown'},
    {x: 8, y: 13, color: 'brown'},
    
    // {x: 3, y: 7},
    // {x: 4, y: 7},
  ];
  s = 1;
  for(var i = 0; i < pixels.length; i++) {
    context.fillStyle = pixels[i].color || 'gray';
    context.fillRect((x-10) + pixels[i].x * s, (y-10)+pixels[i].y * s, s, s);
  }
}

function drawEnemy() {
  x=enemy.pos.x-viewPort[0];
  y=enemy.pos.y-viewPort[1];
  if (enemy.health <= 0) {
    return;
  }
  context.fillStyle = "black";
  if (enemy.stunned > 0) {
    context.fillStyle = "gray";
  }

  context.beginPath();
  context.arc(x, y, 10, 0, 2 * Math.PI);
  context.fill();
  context.fillStyle = 'red';
  context.beginPath();
  context.arc(x-4, y, 3, 0, 2 * Math.PI);
  context.fill();
  context.beginPath();
  context.arc(x+4, y, 3, 0, 2 * Math.PI);
  context.fill();

  if(enemy.health > 0 ) {
    context.fillText(enemy.health,(enemy.pos.x - 10)-viewPort[0],(enemy.pos.y - 12)-viewPort[1])
  }
}

function drawRocks() {
  context.fillStyle = 'brown';
  rocks = [
    [3,12],
    [7,12],
    [16,12],
    [21,12],
    [21,11],
  ];
  for(i = 0; i < rocks.length; i++) {
    x = rocks[i][0];
    y = rocks[i][1];
    context.fillRect((x*20)-viewPort[0], (y*20)-viewPort[1], 20,20);
  }
}

function drawCooldown() {
  context.fillStyle = "orange"
  context.fillRect((hero.pos.x-50)-viewPort[0],(hero.pos.y+20)-viewPort[1],hero.freezedown,10)
}

function clockTick() {
  setTimeout(function() {

    if (enemy.stunned == 0) {
      var enemyStep;
      if (
          Math.abs(enemy.pos.x - hero.pos.x) < 200 &&
          Math.abs(enemy.pos.x - hero.pos.x) < 200
         ) {
        //enemy close
        enemyStep = 5;
        if (enemy.pos.x > hero.pos.x) {
          enemy.pos.x -= enemyStep;
        } else {
          enemy.pos.x += enemyStep;
        }
        if (enemy.pos.y > hero.pos.y) {
          enemy.pos.y -= enemyStep;
        } else {
          enemy.pos.y += enemyStep;
        }
      } else {
        //enemy far
        enemyStep = 1;
        if (Math.random() > 0.5) {
          //check if enemy is about to hit a block
          if(!obstacleCheck(enemy.pos.x+enemyStep, enemy.pos.y) ) {
            enemy.pos.x = enemy.pos.x + enemyStep
          }
        } else {
          enemy.pos.x = enemy.pos.x - enemyStep
        }
        if (Math.random() > 0.5) {
          if (enemy.pos.y < 520) {
            enemy.pos.y = enemy.pos.y + enemyStep
          }
        } else {
          if (enemy.pos.y > 0) {
            enemy.pos.y = enemy.pos.y - enemyStep
          }
        }
      }
    }

    // player-enemy collision detection
    if (
        (Math.abs(enemy.pos.x - hero.pos.x) < 10) && 
        (Math.abs(enemy.pos.y - hero.pos.y) < 10)
      ) {
      if (hero.flash == 0) {
        if (enemy.health > 0 ) {
          hero.health -= 10;
          hero.flash = 20;
        }
      }
    }

    // player-exit collision detection
    if (
        (Math.abs(exitx - (hero.pos.x)) < 10) && (Math.abs(exity - (hero.pos.y)) < 10)
      ) {
        console.log('cleared level')
    }

    if (hero.flash > 0) {
      hero.flash = hero.flash - 1
    }

    if (hero.freezedown > 0) {
      hero.freezedown = hero.freezedown - 3
      if(hero.freezedown < 0)
        hero.freezedown = 0
    }

    if (enemy.stunned > 0) {
      enemy.stunned -= 1;
    }

    if (hero.speed.x != 0) {
      newpos = hero.pos.x + hero.speed.x;
      obstacle = obstacleCheck(newpos,hero.pos.y);
      if (!obstacle) {
        hero.pos.x = hero.pos.x = newpos;
        if (hero.speed.x > 0) {
          hero.degree += 0.5;
        } else {
          hero.degree -= 0.5;
        }
      }
    }
    hero.speed.x += hero.acc.x;
    // friction
    if (hero.speed.x > 0) {
      hero.speed.x--;
    } else if (hero.speed.x < 0) {
      hero.speed.x++;
    }

    hero.speed.y += hero.acc.y;
    if (hero.speed.y != 0) {
      newpos = hero.pos.y + hero.speed.y;
      obstacle = obstacleCheck(hero.pos.x,newpos+20);
      if (obstacle) {
        hero.pos.y = obstacle[1] - 10;
        hero.speed.y = 0;
      } else {
        hero.pos.y = newpos;
      }
    }
    if (hero.speed.y > 20) {
      hero.speed.y = 20;
    }
    if (hero.burst.r) {
      hero.burst.r +=2;
      if (hero.burst.r == 40) {
        hero.burst.r = 0;
      }
    }

    viewPort = [hero.pos.x-500, hero.pos.y-250];
    drawAll();
    clockTick();
  }, 50)
}

function drawAll() {
  context.clearRect(0,0, 1200, 520);
  drawRocks();
  drawBlocks();
  drawExit();
  drawHero();
  drawEnemy();
  drawCooldown();
  drawInventory();
  drawWin();
  drawMap();
} 

function drawExit() {
  context.fillStyle = "orange"
  context.fillRect(
    exitx+(0-viewPort[0])-10,exity+(0-viewPort[1])-10, 20,20
  );
}
