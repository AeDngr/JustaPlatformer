function startStage(n){
stage=n;
playing=true;
startTime=Date.now();
document.getElementById("menu").style.display="none";
loadStage();
}
