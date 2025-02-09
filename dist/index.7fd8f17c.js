var t,e={};const s=new((t=class{constructor(t=null){this.size=4,this.score=0,this.status="idle",this.initialState=t,this.board=t?t.map(t=>[...t]):this.createEmptyBoard(),this.prevBoard=null}createEmptyBoard(){return Array.from({length:this.size},()=>Array(this.size).fill(0))}getState(){return this.board}getScore(){return this.score}getStatus(){return this.status}start(){"idle"===this.status&&(this.status="playing",this.addRandomNumber(),this.addRandomNumber())}restart(){this.status="idle",this.score=0,this.board=this.initialState?this.initialState.map(t=>[...t]):this.createEmptyBoard()}moveLeft(){this.makeMove("left")}moveRight(){this.makeMove("right")}moveUp(){this.makeMove("up")}moveDown(){this.makeMove("down")}makeMove(t,e=!1){"playing"===this.status&&(this.prevBoard=JSON.stringify(this.board),("up"===t||"down"===t)&&(this.board=this.transpose(this.board)),("right"===t||"down"===t)&&(this.board=this.board.map(t=>t.reverse())),this.board=this.board.map(t=>this.shiftRow(t)),e||(this.board=this.board.map(t=>this.mergeRow(t))),("right"===t||"down"===t)&&(this.board=this.board.map(t=>t.reverse())),("up"===t||"down"===t)&&(this.board=this.transpose(this.board)),this.prevBoard!==JSON.stringify(this.board)&&(this.addRandomNumber(),this.checkGameStatus()))}shiftRow(t){let e=t.filter(t=>0!==t);return[...e,...Array(this.size-e.length).fill(0)]}stackRow(t){let e=t.filter(t=>0!==t);return[...Array(this.size-e.length).fill(0),...e]}mergeRow(t){for(let e=0;e<t.length-1;e++)0!==t[e]&&t[e]===t[e+1]&&(t[e]*=2,t[e+1]=0,this.score+=t[e]);return this.shiftRow(t)}addRandomNumber(){let t=[];for(let e=0;e<this.size;e++)for(let s=0;s<this.size;s++)0===this.board[e][s]&&t.push([e,s]);if(0===t.length)return;let[e,s]=t[Math.floor(Math.random()*t.length)];this.board[e][s]=.9>Math.random()?2:4}transpose(t){return t[0].map((t,e)=>this.board.map(t=>t[e]))}canMakeMove(){if(this.board.some(t=>t.includes(0)))return!0;for(let t=0;t<this.size;t++)for(let e=0;e<this.size-1;e++)if(this.board[t][e]===this.board[t][e+1]||this.board[e][t]===this.board[e+1][t])return!0;return!1}checkGameStatus(){this.board.flat().includes(2048)?this.status="win":this.canMakeMove()||(this.status="lose")}}).__esModule?t.default:t),r=document.querySelector(".game-score"),i=document.querySelector(".button"),a=document.querySelectorAll(".field-cell"),o=document.querySelector(".message-win"),h=document.querySelector(".message-lose"),d=document.querySelector(".message-start");function n(){s.getState().flat().forEach((t,e)=>{let s=a[e];s.textContent=t||"",s.className=`field-cell ${t?`field-cell--${t}`:""}`}),r.textContent=s.getScore()}i.addEventListener("click",()=>{"idle"===s.getStatus()?(s.start(),i.classList.replace("start","restart"),i.textContent="Restart"):(s.restart(),i.classList.replace("restart","start"),i.textContent="Start"),n(),o.classList.add("hidden"),h.classList.add("hidden"),d.classList.add("hidden")}),document.addEventListener("keydown",t=>{if("playing"!==s.getStatus())return;let e=t.shiftKey,r={ArrowLeft:()=>s.moveLeft(),ArrowRight:()=>s.makeMove("right",e),ArrowUp:()=>s.moveUp(),ArrowDown:()=>s.moveDown()};r[t.key]&&(r[t.key](),n(),"win"===s.getStatus()?o.classList.remove("hidden"):"lose"===s.getStatus()&&h.classList.remove("hidden"))});
//# sourceMappingURL=index.7fd8f17c.js.map
