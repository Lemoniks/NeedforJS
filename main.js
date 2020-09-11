const MAX_ENEMY = 7;


const score = document.querySelector(".score"),
  scorebest = document.querySelector(".scorebest"),
  start = document.querySelector(".start"),
  med = document.querySelector(".med"),
  hard = document.querySelector(".hard"),
  gameArea = document.querySelector(".gameArea"),
  car = document.createElement("div");
  

car.classList.add("car");

const audio = document.createElement('embed');

audio.src = 'audio.mp3';
audio.type = 'audio/mp3';
audio.style.cssText = `position: absolute; top: -1000px;`;

start.addEventListener("click", EasyGame);
med.addEventListener("click", MedGame);
hard.addEventListener("click", HardGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

const keys = {
  w: false,
  s: false,
  d: false,
  a: false,
};

const setting = {
  start: false,
  score: 0,
  bestscore: 0,
  speed: 0,
  traffic: 0
};

score.classList.add("hide");
scorebest.innerHTML = "BEST SCORE:<br>" + localStorage.getItem("bestscore");

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
  start.classList.add("hide");
  med.classList.add("hide");
  hard.classList.add("hide");
  gameArea.innerHTML = '';
  car.style.left = '175px';
  car.style.top = 'auto';

  
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * 100}px`;
    line.y = i * 100;
    gameArea.append(line);
  }
  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++ ){
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url("./image/enemy${randomEnemy}.png") center / cover no-repeat`;
    gameArea.append(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  document.body.append(audio);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function EasyGame() {
  setting.speed = 4;
  setting.traffic = 3;
  car.style.background =
    'transparent url("./image/playerEasy.png") center / cover no-repeat';
  startGame();
}

function MedGame () {
  setting.speed = 5;
  setting.traffic = 2;
  car.style.background =
    'transparent url("./image/playerMed.png") center / cover no-repeat';

  startGame();
}

function HardGame () {
  setting.speed = 6;
  setting.traffic = 1;
  car.style.background =
    'transparent url("./image/playerHard.png") center / cover no-repeat';
  startGame();
}


function playGame() {
  if (setting.start) {
    score.classList.remove("hide");
    setting.score += setting.speed;
    score.innerHTML = 'SCORE:<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.a && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.d && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }
    if (keys.s && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }
    if (keys.w && setting.y > 0) {
      setting.y -= setting.speed;
    }
    car.style.left = setting.x + "px";
    car.style.top = setting.y + "px";
    requestAnimationFrame(playGame);
  };
}

function startRun(event) {

  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }

}

function stopRun(event) {

  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

function moveRoad () {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line){
    line.y += setting.speed;
    line.style.top = line.y + 'px';
    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;

    }
  });
}

function moveEnemy () {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function(item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    let LS = Number(localStorage.getItem("bestscore"));

    if (carRect.top <= enemyRect.bottom && 
      carRect.right >= enemyRect.left && 
      carRect.left <= enemyRect.right && 
      carRect.bottom >= enemyRect.top) {
        setting.start = false;
        audio.remove();
        console.log('CRASHHH!');
        start.classList.remove('hide');
        med.classList.remove("hide");
        hard.classList.remove("hide");
        setting.bestscore = setting.score;
        
        if (localStorage.getItem("bestscore") === null) {
          localStorage.bestscore = setting.score;
        } else if (Number(localStorage.getItem("bestscore")) < setting.score) {
          localStorage.bestscore = setting.score;
        }
        scorebest.innerHTML =
          "BEST SCORE:<br>" + localStorage.getItem("bestscore");
        console.log(setting.bestscore);
    }
    



    item.y += setting.speed / 2;
    item.style.top = item.y + 'px'; 
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -150 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });

}