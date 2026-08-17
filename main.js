const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");
canvas.width=innerWidth;
canvas.height=innerHeight;

let keys={},mobile={left:false,right:false,jump:false};
let stage=0,playing=false,startTime=0;
let camera={x:0};
let coins=[];
let collected=[];

let save=JSON.parse(localStorage.getItem("platformSave")||"{}");

let player={x:100,y:400,w:32,h:32,vx:0,vy:0};

let stages=[
{
time:50,
platforms:[
{x:0,y:500,w:300,h:20},{x:400,y:450,w:180,h:20},
{x:700,y:370,w:220,h:20},{x:1100,y:450,w:250,h:20},
{x:1500,y:300,w:220,h:20},{x:1900,y:400,w:250,h:20},
{x:2400,y:280,w:300,h:20},{x:2900,y:200,w:300,h:20}
],
coins:[{x:500,y:400},{x:1600,y:250},{x:2500,y:230}],
portal:{x:3300,y:120,w:50,h:80},
help:"1-1 Tutorial: 이동, 점프, 코인, 포탈"
},
{
time:70,
platforms:[
{x:0,y:500,w:250,h:20},{x:500,y:350,w:200,h:20},
{x:900,y:250,w:250,h:20},{x:1400,y:400,w:300,h:20}
],
coins:[{x:600,y:300},{x:1000,y:200},{x:1500,y:350}],
gravity:[{x:800,y:100,w:200,h:200,power:-0.5}],
portal:{x:1800,y:300,w:50,h:80},
help:"1-2 Challenge: 중력 구역"
}
];

function hit(a,b){
return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
}

function loadStage(){
player.x=100;
player.y=400;
player.vy=0;
coins=stages[stage].coins;
collected=[];
document.getElementById("info").innerHTML=stages[stage].help;
}

document.addEventListener("keydown",e=>keys[e.code]=true);
document.addEventListener("keyup",e=>keys[e.code]=false);

function bind(id,k){
let b=document.getElementById(id);
if(b){
b.ontouchstart=()=>mobile[k]=true;
b.ontouchend=()=>mobile[k]=false;
}
}
bind("left","left");
bind("right","right");
bind("jump","jump");

function clearStage(){
let t=(Date.now()-startTime)/1000;
let star=t<=stages[stage].time?3:t<=stages[stage].time+20?2:1;

save[stage]={
clear:true,
stars:Math.max(save[stage]?.stars||0,star),
coins:collected.length
};

localStorage.setItem("platformSave",JSON.stringify(save));

alert("Clear "+star+" Stars");
document.getElementById("menu").style.display="block";
playing=false;
}

function update(){
if(!playing)return;
let s=stages[stage];
let gravity=.6;

if(s.gravity){
s.gravity.forEach(g=>{
if(hit(player,g))gravity=g.power;
});
}

player.vx=(keys.ArrowRight||mobile.right)?5:(keys.ArrowLeft||mobile.left)?-5:0;

if((keys.Space||mobile.jump)&&player.vy===0)
player.vy=-13;

player.x+=player.vx;
player.y+=player.vy;
player.vy+=gravity;

s.platforms.forEach(p=>{
if(hit(player,p)&&player.vy>=0){
player.y=p.y-player.h;
player.vy=0;
}
});

coins.forEach((c,i)=>{
if(!collected.includes(i)&&hit(player,{x:c.x,y:c.y,w:20,h:20}))
collected.push(i);
});

if(hit(player,s.portal))clearStage();

if(player.y>1000){
player.x=100;
player.y=400;
player.vy=0;
}

camera.x=Math.max(0,player.x-canvas.width/2);
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.save();
ctx.translate(-camera.x,0);

let s=stages[stage];

ctx.fillStyle="#333";
ctx.fillRect(camera.x,0,canvas.width,canvas.height);

ctx.fillStyle="#3c9";
s.platforms.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));

ctx.fillStyle="gold";
coins.forEach((c,i)=>{
if(!collected.includes(i))ctx.fillRect(c.x,c.y,20,20);
});

ctx.fillStyle="cyan";
ctx.fillRect(s.portal.x,s.portal.y,s.portal.w,s.portal.h);

ctx.fillStyle="yellow";
ctx.fillRect(player.x,player.y,player.w,player.h);

ctx.restore();

ctx.fillStyle="white";
ctx.fillText("Coin "+collected.length+"/3",20,30);
}

function loop(){
update();
draw();
requestAnimationFrame(loop);
}
loop();
