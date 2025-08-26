const custom_play=document.querySelector(".icon-1-play");
const play_with_ai=document.querySelector(".icon-2-play");

custom_play.addEventListener("click",(e)=>{
    window.location.href = 'customplay.html';
});

play_with_ai.addEventListener("click",(e)=>{
    window.location.href = 'challengewithai.html';

});
