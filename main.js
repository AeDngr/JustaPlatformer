const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

canvas.width=innerWidth;
canvas.height=innerHeight;

let keys={};
let mobile={left:false,right:false,jump:false};

let camera={x:0,y:0};

let player={
x:100,
y:200,
w:32,
h:32,
vx:0,
vy:0,
speed:5
};

let gravity=0.6;

let platforms=[
{x:0,y:500,w:250,h:20},
{x:350,y:400,w:200,h:20},
{x:700,y:300,w:200,h:20},
{x:1100,y:220,w:250,h:20}
];

let movingPlatforms=[
{x:500,y:250,w:150,h:20,d:1}
];

let fallingPlatforms=[
{x:900,y:450,w:150,h:20,fall:false}
];

let jumpPads=[
{x:620,y:380,w:60,h:20}
];

let obstacles=[
{x:280,y:470,w:40,h:30}
];

let gravityZones=[
{x:1100,y:120,w:150,h:120,power:-0.5}
];

let portals=[
{x:1400,y:180,w:50,h:80,targetX:100,targetY:200}
];

function hit(a,b){
return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
}

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

function reset(){
player.x=100;
player.y=200;
player.vy=0;
}

function update(){

if(keys.ArrowLeft||mobile.left) player.vx=-player.speed;
else if(keys.ArrowRight||mobile.right) player.vx=player.speed;
else player.vx=0;

if((keys.Space||mobile.jump)&&player.vy===0)
player.vy=-13;

gravity=0.6;

gravityZones.forEach(z=>{
if(hit(player,z)) gravity=z.power;
});

player.x+=player.vx;
player.y+=player.vy;
player.vy+=gravity;

platforms.forEach(p=>{
if(hit(player,p)&&player.vy>=0){
player.y=p.y-player.h;
player.vy=0;
}
});

movingPlatforms.forEach(p=>{
p.x+=p.d*2;
if(p.x>800||p.x<400)p.d*=-1;
if(hit(player,p)&&player.vy>=0){
player.y=p.y-player.h;
player.vy=0;
}
});

fallingPlatforms.forEach(p=>{
if(hit(player,p))p.fall=true;
if(p.fall)p.y+=3;
});

jumpPads.forEach(p=>{
if(hit(player,p))player.vy=-20;
});

obstacles.forEach(o=>{
if(hit(player,o))reset();
});

portals.forEach(p=>{
if(hit(player,p)){
player.x=p.targetX;
player.y=p.targetY;
}
});

if(player.y>1000)reset();

camera.x=player.x-canvas.width/2;
camera.y=player.y-canvas.height/2;

if(camera.x<0)camera.x=0;
if(camera.y<0)camera.y=0;
}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.save();
ctx.translate(-camera.x,-camera.y);

ctx.fillStyle="#222";
ctx.fillRect(camera.x,camera.y,canvas.width,canvas.height);

ctx.fillStyle="#3c9";
platforms.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));

ctx.fillStyle="#09f";
movingPlatforms.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));

ctx.fillStyle="#f90";
fallingPlatforms.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));

ctx.fillStyle="#0ff";
jumpPads.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));

ctx.fillStyle="#a0f";
gravityZones.forEach(z=>ctx.fillRect(z.x,z.y,z.w,z.h));

ctx.fillStyle="#fff";
portals.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));

ctx.fillStyle="#f33";
obstacles.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));

ctx.fillStyle="#ff0";
ctx.fillRect(player.x,player.y,player.w,player.h);

ctx.restore();
}

function loop(){
update();
draw();
requestAnimationFrame(loop);
}

loop();
