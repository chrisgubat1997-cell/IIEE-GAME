/* IIEE GAME ZONE - Extra solo and cooperative games */
(() => {
 const root=()=>document.getElementById("miniGame");
 const menu=()=>{document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));document.getElementById("modeSelect").classList.add("active");};
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const shell=(title,desc,body)=>{root().innerHTML='<div class="mini-head"><div class="eyebrow">IIEE GAME ZONE</div><h2>'+title+'</h2><p>'+desc+'</p></div>'+body+'<button class="secondary mini-back" onclick="extraGamesMenu()">MAIN MENU</button>';document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));root().classList.add("active");};
 window.extraGamesMenu=menu;
 const pairs=[["Ω","RESISTOR"],["| |","CAPACITOR"],["(M)","MOTOR"],["o/ o","SWITCH"]];
 let mem;
 window.startMemoryMatch=()=>{mem={tiles:pairs.flatMap((p,i)=>[{v:p[0],p:i},{v:p[1],p:i}]).sort(()=>Math.random()-.5),first:null,found:[],moves:0,busy:false};drawMem();};
 function drawMem(){shell("MEMORY MATCH","Match each electrical symbol with its correct name.",'<p class="extra-stats">MATCHED '+mem.found.length+'/4 &nbsp; • &nbsp; MOVES '+mem.moves+'</p><div class="extra-memory">'+mem.tiles.map((t,i)=>'<button class="extra-tile" onclick="memoryMatchFlip('+i+')" '+(mem.found.includes(t.p)?'disabled':'')+'>'+(mem.found.includes(t.p)||mem.first===i?t.v:'?')+'</button>').join("")+'</div><p id="memMsg" class="mini-feedback">Tap two cards to reveal a pair.</p><button class="primary mini-next" onclick="startMemoryMatch()">PLAY AGAIN</button>');}
 window.memoryMatchFlip=i=>{if(mem.busy||mem.found.includes(mem.tiles[i].p)||mem.first===i)return;if(mem.first===null){mem.first=i;drawMem();return;}const a=mem.first,b=i;mem.moves++;if(mem.tiles[a].p===mem.tiles[b].p){window.GameAudio?.play("match");mem.found.push(mem.tiles[a].p);mem.first=null;drawMem();if(mem.found.length===4)document.getElementById("memMsg").textContent="PERFECT! All pairs matched.";}else{mem.first=b;mem.busy=true;drawMem();setTimeout(()=>{mem.first=null;mem.busy=false;drawMem();},850);}};
 const ohm=[
  {q:"V = 24 V and R = 12 Ω. Find current.",a:["2 A","12 A","288 A"],c:0,w:"I = V ÷ R = 24 ÷ 12 = 2 A."},
  {q:"I = 3 A and R = 10 Ω. Find voltage.",a:["3.3 V","30 V","13 V"],c:1,w:"V = I × R = 3 × 10 = 30 V."},
  {q:"V = 120 V and I = 2 A. Find resistance.",a:["60 Ω","240 Ω","122 Ω"],c:0,w:"R = V ÷ I = 120 ÷ 2 = 60 Ω."},
  {q:"A 500 W load operates at 250 V. Find current.",a:["2 A","0.5 A","125 A"],c:0,w:"I = P ÷ V = 500 ÷ 250 = 2 A."},
  {q:"A 2 kW load runs for 3 hours. Energy used?",a:["6 kWh","5 kWh","1.5 kWh"],c:0,w:"Energy = 2 kW × 3 h = 6 kWh."}
 ];
 let solo;
 window.startOhmSprint=()=>{solo={list:ohm.slice().sort(()=>Math.random()-.5),i:0,score:0,lock:false};drawSolo();};
 function drawSolo(){const q=solo.list[solo.i],opts=q.a.map((v,i)=>({v,i})).sort(()=>Math.random()-.5);solo.opts=opts;shell("OHM'S LAW SPRINT","Question "+(solo.i+1)+" of "+solo.list.length,'<div class="extra-stats">SCORE '+solo.score+'</div><div class="mini-question">'+esc(q.q)+'</div><div class="mini-answers">'+opts.map((o,i)=>'<button class="mini-answer" onclick="ohmPick('+i+')">'+esc(o.v)+'</button>').join("")+'</div><p id="ohmMsg" class="mini-feedback">Choose your answer.</p>');}
 window.ohmPick=i=>{if(solo.lock)return;solo.lock=true;const q=solo.list[solo.i],ok=solo.opts[i].i===q.c;if(ok)solo.score++;document.querySelectorAll("#miniGame .mini-answer").forEach((b,n)=>{b.disabled=true;if(solo.opts[n].i===q.c)b.classList.add("is-correct");else if(n===i)b.classList.add("is-wrong");});document.getElementById("ohmMsg").textContent=(ok?"CORRECT! ":"NOT QUITE. ")+q.w;const b=document.createElement("button");b.className="primary mini-next";b.textContent=solo.i===solo.list.length-1?"SEE RESULT":"NEXT";b.onclick=()=>{solo.i++;solo.lock=false;if(solo.i<solo.list.length)drawSolo();else shell("SPRINT COMPLETE","Your individual result",'<div class="mini-result-score">'+solo.score+' / '+solo.list.length+'</div><button class="primary mini-next" onclick="startOhmSprint()">PLAY AGAIN</button>');};root().insertBefore(b,root().querySelector(".mini-back"));};
 const general=[
  {q:"A lamp does not turn on. The bulb is good. What should you inspect?",a:["Open or loose connection","Room temperature","Paint color"],c:0,w:"A loose or open connection interrupts current flow."},
  {q:"Which instrument measures current?",a:["Voltmeter","Ammeter","Megger"],c:1,w:"An ammeter measures electrical current."},
  {q:"Which symbol commonly represents a capacitor?",a:["| |","(M)","o/ o"],c:0,w:"Two parallel plates represent a capacitor."},
  {q:"A breaker trips repeatedly. What should you do?",a:["Keep resetting it","Investigate the fault","Tape it ON"],c:1,w:"Repeated tripping signals a fault. Never defeat protection."},
  {q:"Which device changes AC voltage level?",a:["Transformer","Fuse","Receptacle"],c:0,w:"A transformer changes AC voltage by electromagnetic induction."},
  {q:"What is the unit of electrical power?",a:["Ampere","Watt","Ohm"],c:1,w:"Electrical power is measured in watts."}
 ];
 const safety=[
  {q:"You see a damaged power cord. What should you do?",a:["Keep using it","Stop using and report it","Cover with paper"],c:1,w:"Damaged cords can cause shock or fire. Remove from service."},
  {q:"Before electrical work, what is a safe first step?",a:["Isolate and verify de-energized","Touch the wire","Ask someone to hold switch"],c:0,w:"Follow proper isolation and test-before-touch procedures."},
  {q:"A breaker trips repeatedly. What is the safe response?",a:["Keep resetting it","Investigate the fault","Tape it ON"],c:1,w:"Repeated tripping indicates a fault. Never defeat protective devices."},
  {q:"Which is suitable PPE when required for electrical work?",a:["Properly rated insulating gloves","Wet gloves","Metal jewelry"],c:0,w:"Use task-appropriate and properly rated PPE."},
  {q:"Someone contacts a live source. What should you do?",a:["Pull them with bare hands","Disconnect power if safe and call for help","Touch the source"],c:1,w:"Never touch an energized casualty. Disconnect power safely and call for help."},
  {q:"What should you do before opening an electrical panel?",a:["Assume it is safe","Follow isolation procedures and verify absence of voltage","Use any metal tool"],c:1,w:"Use approved safe-work procedures and verify de-energization."}
 ];
 let team;
 window.startCoopGame=kind=>{team={kind,players:3,turn:1,score:0,qs:(kind==="safety"?safety:general).slice().sort(()=>Math.random()-.5),locked:false};teamSetup();};
 function teamSetup(){shell(team.kind==="safety"?"TEAM SAFETY RELAY":"TEAM POWER RELAY","Cooperative game: one group, one shared score. No competing teams.",'<div class="extra-rules"><b>HOW TO PLAY</b><p>Each member answers one question in turn.</p><p>Correct answers add to the group shared score.</p><p>Pass the touchscreen to the next member.</p></div><div class="extra-count"><button onclick="coopSize(-1)">−</button><strong id="coopCount">'+team.players+' PLAYERS</strong><button onclick="coopSize(1)">+</button></div><button class="primary mini-next" onclick="coopStart()">START TEAM GAME</button>');}
 window.coopSize=d=>{team.players=Math.max(2,Math.min(8,team.players+d));document.getElementById("coopCount").textContent=team.players+" PLAYERS";};
 window.coopStart=()=>{team.turn=1;team.score=0;teamQuestion();};
 function teamQuestion(){const q=team.qs[(team.turn-1)%team.qs.length],opts=q.a.map((v,i)=>({v,i})).sort(()=>Math.random()-.5);team.opts=opts;team.locked=false;shell(team.kind==="safety"?"TEAM SAFETY RELAY":"TEAM POWER RELAY","PLAYER "+team.turn+" OF "+team.players+' • SHARED SCORE: '+team.score,'<div class="mini-question">'+esc(q.q)+'</div><div class="mini-answers">'+opts.map((o,i)=>'<button class="mini-answer" onclick="coopPick('+i+')">'+esc(o.v)+'</button>').join("")+'</div><p id="coopMsg" class="mini-feedback">Your turn. Choose an answer.</p>');}
 window.coopPick=i=>{if(team.locked)return;team.locked=true;const q=team.qs[(team.turn-1)%team.qs.length],ok=team.opts[i].i===q.c;if(ok)team.score++;document.querySelectorAll("#miniGame .mini-answer").forEach((b,n)=>{b.disabled=true;if(team.opts[n].i===q.c)b.classList.add("is-correct");else if(n===i)b.classList.add("is-wrong");});document.getElementById("coopMsg").textContent=(ok?"CORRECT! ":"NOT QUITE. ")+q.w;const b=document.createElement("button");b.className="primary mini-next";b.textContent=team.turn===team.players?"SEE GROUP RESULT":"PASS TO NEXT PLAYER";b.onclick=()=>{if(team.turn===team.players)shell("TEAM COMPLETE","Everyone contributed to the shared score.",'<div class="mini-result-score">'+team.score+' / '+team.players+'</div><p>Great teamwork!</p><button class="primary mini-next" onclick="startCoopGame(\''+team.kind+'\')">PLAY ANOTHER GROUP</button>');else{team.turn++;teamQuestion();}};root().insertBefore(b,root().querySelector(".mini-back"));};
})();
