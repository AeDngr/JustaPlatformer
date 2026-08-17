const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let keys = {};
let mobile = {
  left:false,
  right:false,
  jump:false
};

// 카메라
let camera = {
  x:0,
  y:0
};

// 플레이어
let player = {
  x:100,
  y:200,
  w:32,
  h:32,
  vx:0,
  vy:0,
  speed:5
};

let gravity = 0.6;

// 스테이지 구조
let platforms = [
  {x:0, y:500, w:250, h:20},
  {x:350, y:400, w:200, h:20},
  {x:700, y:300, w:200, h:20},
  {x:1050,y:220,w:250,h:20},
  {x:1500,y:350,w:300,h:20}
];

// 움직이는 플랫폼
let movingPlatforms = [
  {
    x:500,
    y:250,
    w:150,
    h:20,
    dir:1
  }
];

// 떨어지는 플랫폼
let fallingPlatforms = [
  {
    x:900,
    y:450,
    w:150,
    h:20,
    falling:false
  }
];

// 점프 패드
let jumpPads = [
  {
    x:620,
    y:380,
    w:60,
    h:20
  }
];

// 장애물
let obstacles = [
  {
    x:280,
    y:470,
    w:40,
    h:30
  }
];

// 중력 변경 구역
let gravityZones = [
  {
    x:1100,
    y:150,
    w:150,
    h:150,
    power:-0.5
  }
];

// 위치 이동 포탈
let portals = [
  {
    x:1700,
    y:280,
    w:50,
    h:80,
    targetX:200,
    targetY:200
  }
];


document.addEventListener("keydown", e=>{
  keys[e.code]=true;
});

document.addEventListener("keyup", e=>{
  keys[e.code]=false;
});


// 모바일 버튼
function bindButton(id,key){
  let btn=document.getElementById(id);
  if(!btn) return;

  btn.ontouchstart=()=>{
    mobile[key]=true;
  };

  btn.ontouchend=()=>{
    mobile[key]=false;
  };
}

bindButton("left","left");
bindButton("right","right");
bindButton("jump","jump");


// 충돌
function hit(a,b){
  return (
    a.x < b.x+b.w &&
    a.x+a.w > b.x &&
    a.y < b.y+b.h &&
    a.y+a.h > b.y
  );
}


function resetPlayer(){
  player.x=100;
  player.y=200;
  player.vy=0;
}


function update(){

  // 이동
  if(keys.ArrowLeft || mobile.left){
    player.vx=-player.speed;
  }
  else if(keys.ArrowRight || mobile.right){
    player.vx=player.speed;
  }
  else{
    player.vx=0;
  }


  // 점프
  if(
    (keys.Space || mobile.jump)
    &&
    player.vy===0
  ){
    player.vy=-13;
  }


  // 중력 변경
  gravity=0.6;

  gravityZones.forEach(zone=>{
    if(hit(player,zone)){
      gravity=zone.power;
    }
  });


  player.x+=player.vx;
  player.y+=player.vy;

  player.vy+=gravity;


  // 일반 플랫폼
  platforms.forEach(p=>{
    if(hit(player,p)&&player.vy>=0){
      player.y=p.y-player.h;
      player.vy=0;
    }
  });


  // 움직이는 플랫폼
  movingPlatforms.forEach(p=>{

    p.x+=p.dir*2;

    if(p.x>800 || p.x<400){
      p.dir*=-1;
    }


    if(hit(player,p)&&player.vy>=0){
      player.y=p.y-player.h;
      player.vy=0;
    }

  });


  // 떨어지는 플랫폼
  fallingPlatforms.forEach(p=>{

    if(hit(player,p)){
      p.falling=true;
    }

    if(p.falling){
      p.y+=3;
    }

  });


  // 점프패드
  jumpPads.forEach(p=>{
    if(hit(player,p)){
      player.vy=-20;
    }
  });


  // 장애물
  obstacles.forEach(o=>{
    if(hit(player,o)){
      resetPlayer();
    }
  });


  // 포탈
  portals.forEach(p=>{
    if(hit(player,p)){
      player.x=p.targetX;
      player.y=p.targetY;
    }
  });


  // 낙사
  if(player.y>1000){
    resetPlayer();
  }


  // 카메라 추적
  camera.x =
    player.x -
    canvas.width/2;

  camera.y =
    player.y -
    canvas.height/2;


  if(camera.x<0)
    camera.x=0;

  if(camera.y<0)
    camera.y=0;

}



function draw(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  ctx.save();

  // 카메라 적용
  ctx.translate(
    -camera.x,
    -camera.y
  );


  // 배경
  ctx.fillStyle="#222";
  ctx.fillRect(
    camera.x,
    camera.y,
    canvas.width,
    canvas.height
  );


  // 플랫폼
  ctx.fillStyle="#3c9";

  platforms.forEach(p=>{
    ctx.fillRect(
      p.x,
      p.y,
      p.w,
      p.h
    );
  });


  // 움직이는 플랫폼
  ctx.fillStyle="#09f";

  movingPlatforms.forEach(p=>{
    ctx.fillRect(
      p.x,
      p.y,
      p.w,
      p.h
    );
  });


  // 떨어지는 플랫폼
  ctx.fillStyle="#f90";

  fallingPlatforms.forEach(p=>{
    ctx.fillRect(
      p.x,
      p.y,
      p.w,
      p.h
    );
  });


  // 점프패드
  ctx.fillStyle="#0ff";

  jumpPads.forEach(p=>{
    ctx.fillRect(
      p.x,
      p.y,
      p.w,
      p.h
    );
  });


  // 중력 구역
  ctx.fillStyle="#a0f";

  gravityZones.forEach(z=>{
    ctx.fillRect(
      z.x,
      z.y,
      z.w,
      z.h
    );
  });


  // 포탈
  ctx.fillStyle="#fff";

  portals.forEach(p=>{
    ctx.fillRect(
      p.x,
      p.y,
      p.w,
      p.h
    );
  });


  // 장애물
  ctx.fillStyle="#f33";

  obstacles.forEach(o=>{
    ctx.fillRect(
      o.x,
      o.y,
      o.w,
      o.h
    );
  });


  // 플레이어
  ctx.fillStyle="#ff0";

  ctx.fillRect(
    player.x,
    player.y,
    player.w,
    player.h
  );


  ctx.restore();


  ctx.fillStyle="white";
  ctx.font="20px Arial";

  ctx.fillText(
    "Camera X : "+Math.floor(camera.x),
    20,
    30
  );

}



function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}


loop();
