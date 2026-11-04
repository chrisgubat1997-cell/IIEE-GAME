/* IIEE GAME ZONE - Additional touch games */
(() => {
 const $ = id => document.getElementById(id);
 const titles = {
  troubleshooter:"ELECTRICAL TROUBLESHOOTER", schematic:"SCHEMATIC DECODER",
  equipment:"IDENTIFY THE EQUIPMENT", calculation:"POWER CALCULATION",
  reaction:"REACTION CHALLENGE", lucky:"LUCKY SPIN"
 };
 const banks = {
  troubleshooter:[
   {q:"A lamp does not turn on. The supply is present and the bulb is good. What should you inspect first?",a:["Open or loose connection","Paint color of the panel","Room temperature","Cable label font"],c:0,why:"A loose or open connection can interrupt the current path."},
   {q:"A fuse repeatedly blows after a new load is connected. What is the safest next step?",a:["Install a larger fuse immediately","Check for overload or short circuit","Bypass the fuse","Use bare wire"],c:1,why:"Find and correct the cause. Never bypass protection or oversize a fuse without proper design."},
   {q:"A circuit breaker trips as soon as it is reset. What should you do?",a:["Hold it in the ON position","Keep resetting it","Isolate the circuit and investigate the fault","Replace it with a bigger breaker"],c:2,why:"Repeated tripping signals a fault that must be investigated safely."}
  ],
  schematic:[
   {q:"Which symbol represents a resistor?",a:["─[Ω]─","─| |─","─(M)─","─o/ o─"],c:0,why:"A resistor is commonly shown as a rectangle or zigzag symbol."},
   {q:"Which symbol represents a capacitor?",a:["─(A)─","─| |─","─[F]─","─(M)─"],c:1,why:"Two parallel plates represent a capacitor."},
   {q:"What does ─o/ o─ represent?",a:["Lamp","Fuse","Open switch","Ground"],c:2,why:"The angled contact indicates an open switch."}
  ],
  equipment:[
   {q:"Which instrument measures electrical current?",a:["Voltmeter","Ammeter","Megger","Watt-hour meter"],c:1,why:"An ammeter measures current and is connected in series when measuring a circuit."},
   {q:"Which equipment is used to measure insulation resistance?",a:["Clamp meter","Megohmmeter (Megger)","Wattmeter","Phase sequence meter"],c:1,why:"A megohmmeter applies a test voltage to measure insulation resistance."},
   {q:"Which device converts AC voltage from one level to another?",a:["Transformer","Contactor","Fuse","Receptacle"],c:0,why:"A transformer transfers energy by electromagnetic induction."}
  ],
  calculation:[
   {q:"A 12 Ω resistor is connected to 24 V. What is the current?",a:["0.5 A","2 A","12 A","288 A"],c:1,why:"I = V ÷ R = 24 ÷ 12 = 2 A."},
   {q:"A device uses 5 A at 220 V. What is its power?",a:["44 W","225 W","1,100 W","2,200 W"],c:2,why:"P = V × I = 220 × 5 = 1,100 W."},
   {q:"A 1,000 W appliance operates for 2 hours. How much energy does it use?",a:["0.5 kWh","1 kWh","2 kWh","2,000 kWh"],c:2,why:"Energy = 1 kW × 2 h = 2 kWh."}
  ]
 };
 let current=null,locked=false,reactionTimer=null,reactionStart=0,reactionReady=false,miniTeamPlayers=3;
 function showScreen(){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("miniGame").classList.add("active");}
 function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
 function shell(title,sub,body){
  $("miniGame").innerHTML='<div class="mini-head"><div class="eyebrow">IIEE GAME ZONE</div><h2>'+title+'</h2><p>'+sub+'</p></div>'+body+'<button class="secondary mini-back" onclick="miniGameMenu()">MAIN MENU</button>';
  showScreen();
 }
 window.miniGameMenu=()=>{clearTimeout(reactionTimer);document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("modeSelect").classList.add("active");};
 function playQuiz(type){
  current={type,items:banks[type].slice().sort(()=>Math.random()-.5),index:0,score:0,team:type==="troubleshooter"||type==="schematic"};
  locked=false;if(current.team){renderMiniTeamSetup();return;}renderQuiz();
 }
 function renderMiniTeamSetup(){
  shell(titles[current.type],"Cooperative team game: take turns and earn one shared score.",
   '<div class="extra-rules"><b>HOW TO PLAY</b><p>Every member gets a turn to answer.</p><p>Correct answers add to one shared team score.</p><p>No competing teams — work together!</p></div><div class="extra-count"><button onclick="miniTeamSize(-1)">−</button><strong id="miniTeamCount">'+miniTeamPlayers+' PLAYERS</strong><button onclick="miniTeamSize(1)">+</button></div><button class="primary mini-next" onclick="miniTeamStart()">START TEAM GAME</button>');
 }
 window.miniTeamSize=d=>{miniTeamPlayers=Math.max(2,Math.min(8,miniTeamPlayers+d));$("miniTeamCount").textContent=miniTeamPlayers+" PLAYERS";};
 window.miniTeamStart=()=>{current.index=0;current.score=0;renderTeamQuiz();};
 window.miniTeamReplay=()=>startMiniGame(current.type);
 function renderTeamQuiz(){
  const item=current.items[current.index%current.items.length],answers=item.a.map((a,i)=>({a,i})).sort(()=>Math.random()-.5);
  current.answerOrder=answers;locked=false;
  shell(titles[current.type],"PLAYER "+(current.index+1)+" OF "+miniTeamPlayers+" • SHARED SCORE: "+current.score,
   '<div class="mini-progress"><span style="width:'+current.index/miniTeamPlayers*100+'%"></span></div><div class="mini-question">'+escapeHtml(item.q)+'</div><div class="mini-answers">'+answers.map((x,i)=>'<button class="mini-answer" onclick="miniAnswer('+i+')"><b>'+String.fromCharCode(65+i)+'</b>'+escapeHtml(x.a)+'</button>').join("")+'</div><div id="miniFeedback" class="mini-feedback">Your turn. Choose an answer.</div><div class="mini-score">SHARED TEAM SCORE: '+current.score+'</div>');
 }
 function renderQuiz(){
  const item=current.items[current.index];
  const answers=item.a.map((a,i)=>({a,i})).sort(()=>Math.random()-.5);
  current.answerOrder=answers;
  shell(titles[current.type],"Question "+(current.index+1)+" of "+current.items.length,
   '<div class="mini-progress"><span style="width:'+current.index/current.items.length*100+'%"></span></div><div class="mini-question">'+escapeHtml(item.q)+'</div><div class="mini-answers">'+answers.map((x,i)=>'<button class="mini-answer" onclick="miniAnswer('+i+')"><b>'+String.fromCharCode(65+i)+'</b>'+escapeHtml(x.a)+'</button>').join("")+'</div><div id="miniFeedback" class="mini-feedback">Choose your answer.</div><div class="mini-score">SCORE: '+current.score+'</div>');
 }
 window.miniAnswer=(index)=>{
  if(locked)return;locked=true;const item=current.items[current.team?current.index%current.items.length:current.index],picked=current.answerOrder[index];
  document.querySelectorAll(".mini-answer").forEach((b,i)=>{b.disabled=true;if(current.answerOrder[i].i===item.c)b.classList.add("is-correct");else if(i===index)b.classList.add("is-wrong");});
  if(picked.i===item.c)current.score++;
  $("miniFeedback").textContent=(picked.i===item.c?"CORRECT! ":"NOT QUITE. ")+item.why;
  $("miniFeedback").className="mini-feedback "+(picked.i===item.c?"good":"bad");
  const next=document.createElement("button");next.className="primary mini-next";
  if(current.team){next.textContent=current.index===miniTeamPlayers-1?"SEE TEAM RESULT":"PASS TO NEXT PLAYER";next.onclick=()=>{current.index++;if(current.index<miniTeamPlayers)renderTeamQuiz();else showMiniTeamResult();};}
  else{next.textContent=current.index===current.items.length-1?"SEE RESULT":"NEXT QUESTION";next.onclick=()=>{current.index++;locked=false;if(current.index<current.items.length)renderQuiz();else showQuizResult();};}
  $("miniGame").insertBefore(next,$("miniGame").querySelector(".mini-back"));
 };
 function showMiniTeamResult(){shell("TEAM CHALLENGE COMPLETE","Everyone contributed to the shared score.",'<div class="mini-result-score">'+current.score+' / '+miniTeamPlayers+'</div><p class="mini-result-copy">Great teamwork! Your group completed '+miniTeamPlayers+' turns.</p><button class="primary mini-next" onclick="miniTeamReplay()">PLAY AGAIN</button>');}
 function showQuizResult(){shell("CHALLENGE COMPLETE","Your result",'<div class="mini-result-score">'+current.score+' / '+current.items.length+'</div><p class="mini-result-copy">'+(current.score===current.items.length?"Excellent work! Perfect score.":"Good effort! Try again to improve your score.")+'</p><button class="primary mini-next" onclick="startMiniGame(\''+current.type+'\')">PLAY AGAIN</button>');}
 window.startMiniGame=(type)=>{
  if(banks[type]){playQuiz(type);return;}
  if(type==="reaction"){startReaction();return;}
  if(type==="lucky"){startLucky();return;}
 };
 function startReaction(){
  shell(titles.reaction,"Tap only when the panel turns GREEN.",'<div id="reactionPad" class="reaction-pad waiting" onclick="reactionTap()">WAIT FOR GREEN</div><div id="reactionMessage" class="mini-feedback">Press START, then wait for the signal.</div><button id="reactionStart" class="primary mini-next" onclick="reactionBegin()">START</button>');
 }
 window.reactionBegin=()=>{
  clearTimeout(reactionTimer);reactionReady=false;reactionStart=0;
  $("reactionPad").className="reaction-pad waiting";$("reactionPad").textContent="WAIT...";$("reactionMessage").textContent="Do not tap yet!";
  $("reactionStart").disabled=true;
  reactionTimer=setTimeout(()=>{reactionReady=true;window.GameAudio?.play("go");reactionStart=performance.now();$("reactionPad").className="reaction-pad go";$("reactionPad").textContent="TAP NOW!";},1200+Math.random()*3000);
 };
 window.reactionTap=()=>{
  if(!reactionStart){if(!reactionReady){$("reactionMessage").textContent="Too soon! Press START to try again.";clearTimeout(reactionTimer);$("reactionPad").className="reaction-pad waiting";$("reactionPad").textContent="FALSE START";$("reactionStart").disabled=false;}return;}
  const ms=Math.round(performance.now()-reactionStart);window.GameAudio?.play("win");reactionStart=0;reactionReady=false;
  $("reactionPad").className="reaction-pad done";$("reactionPad").textContent=ms+" ms";
  $("reactionMessage").textContent=ms<250?"Lightning fast!":ms<400?"Great reaction!":"Keep practicing!";
  $("reactionStart").disabled=false;$("reactionStart").textContent="TRY AGAIN";
 };
 const luckyChallenges=["Answer a quick electrical safety question.","Name one instrument used in electrical testing.","Explain the purpose of a fuse.","Identify one common electrical hazard.","State the unit of electrical power.","Give one example of personal protective equipment."];
 function startLucky(){shell(titles.lucky,"Tap the button to reveal your random event challenge.",'<div class="lucky-token">?</div><div id="luckyText" class="mini-question">Ready for a surprise?</div><button class="primary mini-next" onclick="spinLucky()">SPIN THE CHALLENGE</button>');}
 window.spinLucky=()=>{const n=Math.floor(Math.random()*luckyChallenges.length);$("miniGame").querySelector(".lucky-token").textContent="✳";$("luckyText").textContent=luckyChallenges[n];};
})();
