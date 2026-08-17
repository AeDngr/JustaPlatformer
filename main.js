const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");
canvas.width=innerWidth;
canvas.height=innerHeight;

let keys={};
let mobile={left:false,right:false,jump:false};

let player={x:100,y:200,w:30,h:30,vx:0,vy:0};

let gravity=0.6;
let stage=1;

let stages=[
{
gravity:0.6,
platforms:[
{x:50,y:500,w:180,h:20},
{x:320,y:400,w:160,h:20,type:"move"},
{x:650,y:300,w:150,h:20,type:"fall"}
],
gravityZone:{x:450,y:350,w:100,h:120,power:-0.6},
portals:[
{x:780,y:240,w:40,h:60,targetX:120,targetY:120}
]
},
{
gravity:0.35,
platforms:[
{x:80,y:520,w:140,h:20},
{x:300,y:420,w:140,h:20},
{x:560,y:320,w:160,h:20}
],
gravityZone:{x:500,y:250,w:100,h:100,power:0.9},
portals:[
{x:760,y:200,w:40,h:60,targetX:100,targetY:100}
]
}
];

let world=stages[0];

document.addEventListener("keydown",e=>keys[e.code]=true);
document.addEventListener("keyup",e=>keys[e.code]=false);

function bind(id,key){
 let b=document.getElementById(id);
 b.ontouchstart=()=>mobile[key]=true;
 b.ontouchend=()=>mobile[key]=false;
}
bind("left","left");
bind("right","right");
bind("jump","jump");

function hit(a,b){
 return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
}

function update(){
 if(keys.ArrowLeft||mobile.left) player.vx=-5;
 else if(keys.ArrowRight||mobile.right) player.vx=5;
 else player.vx=0;

 if((keys.Space||mobile.jump)&&player.y+player.h>=500){
  player.vy=-12;
 }

 if(hit(player,world.gravityZone)){
  gravity=world.gravityZone.power;
 }else{
  gravity=world.gravity;
 }

 player.x+=player.vx;
 player.y+=player.vy;
 player.vy+=gravity;

 world.platforms.forEach(p=>{
  if(p.type==="move"){
   p.x+=2;
   if(p.x>600)p.x=320;
  }
  if(p.type==="fall"&&hit(player,p)){
   p.y+=3;
  }

  if(hit(player,p)&&player.vy>=0){
   player.y=p.y-player.h;
   player.vy=0;
  }
 });

 world.portals.forEach(p=>{
  if(hit(player,p)){
   player.x=p.targetX;
   player.y=p.targetY;
  }
 });

 if(player.y>canvas.height){
  player.x=100;
  player.y=100;
 }
}

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 ctx.fillStyle="#333";
 ctx.fillRect(0,0,canvas.width,canvas.height);

 world.platforms.forEach(p=>{
  ctx.fillStyle=p.type==="fall"?"orange":"green";
  ctx.fillRect(p.x,p.y,p.w,p.h);
 });

 ctx.fillStyle="purple";
 ctx.fillRect(world.gravityZone.x,world.gravityZone.y,world.gravityZone.w,world.gravityZone.h);

 world.portals.forEach(p=>{
  ctx.fillStyle="cyan";
  ctx.fillRect(p.x,p.y,p.w,p.h);
 });

 ctx.fillStyle="yellow";
 ctx.fillRect(player.x,player.y,player.w,player.h);

 updateStage(stage);
}

function loop(){
 update();
 draw();
 requestAnimationFrame(loop);
}
loop();
