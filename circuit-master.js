/* IIEE CIRCUIT MASTER - team relay edition */
(() => {
  const $ = id => document.getElementById(id);
  const parts = [
    {id:"FUSE",label:"FUSE",symbol:"━[ ]━",hint:"Overcurrent protection"},
    {id:"SWITCH",label:"SWITCH",symbol:"─o/ o─",hint:"Opens and closes the circuit"},
    {id:"LAMP",label:"LAMP",symbol:"─(✦)─",hint:"Converts electrical energy to light"},
    {id:"RESISTOR",label:"RESISTOR",symbol:"─[Ω]─",hint:"Limits current"},
    {id:"CAPACITOR",label:"CAPACITOR",symbol:"─| |─",hint:"Stores electric charge"},
    {id:"MOTOR",label:"MOTOR",symbol:"─(M)─",hint:"Converts electrical energy to motion"},
    {id:"BUZZER",label:"BUZZER",symbol:"─(♫)─",hint:"Converts electrical energy to sound"}
  ];
  const challenges = [
    {load:"LAMP",name:"LIGHTING CIRCUIT",description:"Build a protected circuit that turns on a lamp.",why:"The fuse protects against excessive current, the switch controls the circuit, and the lamp produces light."},
    {load:"MOTOR",name:"MOTOR CONTROL CIRCUIT",description:"Build a protected circuit that operates a motor.",why:"The fuse provides overcurrent protection, the switch controls the motor, and the motor converts electrical energy into motion."},
    {load:"BUZZER",name:"SIGNAL CIRCUIT",description:"Build a protected circuit that activates a buzzer.",why:"The fuse provides overcurrent protection, the switch controls the circuit, and the buzzer produces an audible signal."}
  ];
  let placed = ["","",""], selected = "", attempts = 0, locked = false;
  let teamSize = 2, player = 1, score = 0, challenge = challenges[0], previousLoad = "";

  window.openModeSelect = () => {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    $("modeSelect").classList.add("active");
  };
  window.startMultipleChoice = () => {
    $("modeSelect").classList.remove("active");
    startGame();
  };
  window.startCircuitGame = () => {
    placed = ["","",""]; selected = ""; attempts = 0; locked = false;
    player = 1; score = 0; previousLoad = "";
    $("circuitResult").classList.add("hidden");
    $("circuitPlay").classList.remove("hidden");
    $("circuitPlay").innerHTML = `
      <section class="circuit-setup">
        <div class="eyebrow">CIRCUIT MASTER • TEAM RELAY</div>
        <h2>LET EVERYONE PLAY</h2>
        <p class="sub">Each participant gets a different circuit challenge. Take turns on the touchscreen and build your team's score.</p>
        <div class="team-instruction"><strong>HOW TO PLAY</strong><span>1. Choose how many players are in your group.</span><span>2. Pass the touchscreen to each player for their turn.</span><span>3. Each player builds one circuit. The team earns points for every correct circuit.</span></div>
        <div class="eyebrow">NUMBER OF PLAYERS</div>
        <div class="team-count">
          <button class="team-count-btn" onclick="changeCircuitTeamSize(-1)" aria-label="Fewer players">−</button>
          <strong id="teamSizeValue">2 PLAYERS</strong>
          <button class="team-count-btn" onclick="changeCircuitTeamSize(1)" aria-label="More players">+</button>
        </div>
        <button class="primary" onclick="beginCircuitTeam()">START TEAM GAME</button>
        <button class="secondary" onclick="backToModeSelect()">MAIN MENU</button>
      </section>`;
    $("circuitGame").classList.add("active");
    document.querySelectorAll(".screen").forEach(s => { if (s.id !== "circuitGame") s.classList.remove("active"); });
  };
  window.changeCircuitTeamSize = delta => {
    teamSize = Math.max(2, Math.min(8, teamSize + delta));
    const el = $("teamSizeValue");
    if (el) el.textContent = teamSize + (teamSize === 1 ? " PLAYER" : " PLAYERS");
  };
  window.beginCircuitTeam = () => startPlayerRound();
  window.backToModeSelect = () => {
    $("circuitGame").classList.remove("active");
    $("modeSelect").classList.add("active");
  };
  function chooseChallenge() {
    const choices = challenges.filter(item => item.load !== previousLoad);
    challenge = choices[Math.floor(Math.random() * choices.length)];
    previousLoad = challenge.load;
  }
  function startPlayerRound() {
    placed = ["","",""]; selected = ""; attempts = 0; locked = false;
    chooseChallenge();
    $("circuitResult").classList.add("hidden");
    $("circuitPlay").classList.remove("hidden");
    $("circuitPlay").innerHTML = `
      <div class="circuit-heading">
        <div class="eyebrow">TEAM RELAY • PLAYER ${player} OF ${teamSize}</div>
        <h2>${challenge.name}</h2>
        <p>${challenge.description}</p>
      </div>
      <div class="team-progress"><span>TEAM SCORE: ${score} / ${(player-1)*100} PTS</span><span>PLAYER ${player}</span></div>
      <div class="hudbox"><div class="hudlabel">CIRCUIT PATH</div><div class="hudvalue" style="font-size:clamp(13px,3vw,18px)">POWER SOURCE → COMPONENTS → RETURN</div></div>
      <div id="circuitSlots" class="circuit-path"></div>
      <div class="qmeta"><span>COMPONENT TRAY</span><span id="attemptCount">ATTEMPTS: 0 / 2</span></div>
      <div id="componentTray" class="component-tray"></div>
      <div id="circuitFeedback" class="circuit-feedback">Player ${player}: choose a component, then tap a position.</div>
      <div class="circuit-actions">
        <button class="secondary" id="resetCircuitBtn" onclick="resetCircuitBoard()">CLEAR BOARD</button>
        <button class="primary" id="checkCircuitBtn" onclick="checkCircuit()">CHECK CIRCUIT</button>
      </div>
      <button class="secondary" onclick="backToModeSelect()">END TEAM GAME</button>`;
    renderBoard();
  }
  function renderBoard() {
    $("circuitSlots").innerHTML = "";
    placed.forEach((id,index) => {
      const slot = document.createElement("button");
      slot.className = "circuit-slot" + (id ? " filled" : "") + (selected ? " can-place" : "");
      slot.innerHTML = id
        ? '<span class="slot-number">POSITION '+(index+1)+'</span><strong>'+id+'</strong><small>Tap to change</small>'
        : '<span class="slot-number">POSITION '+(index+1)+'</span><strong>＋</strong><small>Tap to place component</small>';
      slot.onclick = () => {
        if (locked) return;
        if (selected) {
          placed[index] = selected; selected = "";
          $("circuitFeedback").textContent = "Component placed. Complete all three positions.";
          $("circuitFeedback").className = "circuit-feedback";
          renderBoard();
        } else if (placed[index]) {
          selected = placed[index]; placed[index] = "";
          $("circuitFeedback").textContent = "Choose another component, then tap a position.";
          renderBoard();
        }
      };
      $("circuitSlots").appendChild(slot);
    });
    $("componentTray").innerHTML = "";
    parts.slice().sort(() => Math.random() - .5).forEach(part => {
      const b = document.createElement("button");
      b.className = "component-card" + (selected === part.id ? " selected" : "") + (placed.includes(part.id) ? " used" : "");
      b.disabled = locked || placed.includes(part.id);
      b.innerHTML = '<span class="component-symbol">'+part.symbol+'</span><strong>'+part.label+'</strong><small>'+part.hint+'</small>';
      b.onclick = () => {
        if (locked || placed.includes(part.id)) return;
        selected = selected === part.id ? "" : part.id;
        $("circuitFeedback").textContent = selected ? "Now tap one of the three positions." : "Choose a component to place.";
        renderBoard();
      };
      $("componentTray").appendChild(b);
    });
    $("attemptCount").textContent = "ATTEMPTS: " + attempts + " / 2";
  }
  window.checkCircuit = () => {
    if (locked) return;
    if (placed.some(x => !x)) {
      $("circuitFeedback").textContent = "Fill all three positions first.";
      $("circuitFeedback").className = "circuit-feedback warn";
      return;
    }
    if (selected) {
      $("circuitFeedback").textContent = "Place your selected component first.";
      return;
    }
    attempts++;
    const firstTwo = placed.slice(0,2);
    const correct = firstTwo.includes("FUSE") && firstTwo.includes("SWITCH") && placed[2] === challenge.load;
    if (correct) {
      locked = true; score += 100;
      showPlayerResult(true);
    } else if (attempts >= 2) {
      locked = true;
      showPlayerResult(false);
    } else {
      $("circuitFeedback").textContent = "Not quite. Check the protection, control, and load components. One more attempt!";
      $("circuitFeedback").className = "circuit-feedback warn";
      $("attemptCount").textContent = "ATTEMPTS: " + attempts + " / 2";
    }
  };
  function showPlayerResult(won) {
    $("circuitPlay").classList.add("hidden");
    $("circuitResult").classList.remove("hidden");
    const finished = player >= teamSize;
    const correctAnswer = "FUSE + SWITCH + " + challenge.load;
    $("circuitResult").innerHTML = `
      <div class="circuit-win-icon">${won ? "✓" : "↻"}</div>
      <div class="eyebrow">PLAYER ${player} RESULT</div>
      <h2>${won ? "CIRCUIT COMPLETE!" : "ROUND COMPLETE"}</h2>
      <p class="sub">${won ? "Great job! Your team earned 100 points." : "Good try! The next player gets a fresh challenge."}</p>
      <div class="circuit-explain"><strong>Challenge: ${challenge.name}</strong><br>Correct components: ${correctAnswer}<br>${challenge.why}</div>
      <div class="team-score-final">TEAM SCORE: ${score} / ${teamSize*100} PTS</div>
      <button class="primary" onclick="${finished ? "showCircuitTeamResults()" : "nextCircuitPlayer()"}">${finished ? "VIEW TEAM RESULTS" : "NEXT PLAYER →"}</button>
      <button class="secondary" onclick="backToModeSelect()">MAIN MENU</button>`;
  }
  window.nextCircuitPlayer = () => { player++; startPlayerRound(); };
  window.showCircuitTeamResults = () => {
    $("circuitPlay").classList.add("hidden");
    $("circuitResult").classList.remove("hidden");
    const perfect = score === teamSize * 100;
    $("circuitResult").innerHTML = `
      <div class="circuit-win-icon">${perfect ? "🏆" : "⚡"}</div>
      <div class="eyebrow">TEAM RELAY FINISHED</div>
      <h2>${perfect ? "PERFECT TEAM!" : "WELL PLAYED!"}</h2>
      <div class="team-score-total">${score}<small> / ${teamSize*100} POINTS</small></div>
      <p class="sub">${score/100} out of ${teamSize} players completed their circuit correctly.</p>
      <button class="primary" onclick="startCircuitGame()">PLAY WITH ANOTHER GROUP</button>
      <button class="secondary" onclick="backToModeSelect()">MAIN MENU</button>`;
  };
  window.resetCircuitBoard = () => {
    if (locked) return;
    placed = ["","",""]; selected = "";
    $("circuitFeedback").textContent = "Board cleared. Build the circuit again.";
    $("circuitFeedback").className = "circuit-feedback";
    renderBoard();
  };
})();