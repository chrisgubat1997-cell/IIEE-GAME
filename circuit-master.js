/* IIEE CIRCUIT MASTER - touch-first component placement game */
(() => {
  const $ = id => document.getElementById(id);
  const parts = [
    {id:"FUSE",label:"FUSE",symbol:"━[ ]━",hint:"Overcurrent protection"},
    {id:"SWITCH",label:"SWITCH",symbol:"─o/ o─",hint:"Opens and closes the circuit"},
    {id:"LAMP",label:"LAMP",symbol:"─(✦)─",hint:"Converts electrical energy to light"},
    {id:"RESISTOR",label:"RESISTOR",symbol:"─[Ω]─",hint:"Limits current"},
    {id:"CAPACITOR",label:"CAPACITOR",symbol:"─| |─",hint:"Stores electric charge"},
    {id:"MOTOR",label:"MOTOR",symbol:"─(M)─",hint:"Converts electrical energy to motion"}
  ];
  const solution = ["FUSE","SWITCH","LAMP"];
  let placed = ["","",""], selected = "", attempts = 0, locked = false, resetTimer = null;

  window.openModeSelect = () => {
    if (typeof resetToIntro === "function") {
      const screens = document.querySelectorAll(".screen");
      screens.forEach(s => s.classList.remove("active"));
    }
    $("modeSelect").classList.add("active");
  };
  window.startMultipleChoice = () => {
    $("modeSelect").classList.remove("active");
    startGame();
  };
  window.startCircuitGame = () => {
    clearTimeout(resetTimer);
    placed = ["","",""]; selected = ""; attempts = 0; locked = false;
    renderBoard();
    $("circuitResult").classList.add("hidden");
    $("circuitPlay").classList.remove("hidden");
    $("circuitGame").classList.add("active");
    document.querySelectorAll(".screen").forEach(s => {
      if (s.id !== "circuitGame") s.classList.remove("active");
    });
  };
  window.backToModeSelect = () => {
    clearTimeout(resetTimer);
    $("circuitGame").classList.remove("active");
    $("modeSelect").classList.add("active");
  };
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
          placed[index] = selected;
          selected = "";
          $("circuitFeedback").textContent = "Component placed. Complete all three positions.";
          $("circuitFeedback").className = "circuit-feedback";
          renderBoard();
        } else if (placed[index]) {
          selected = placed[index];
          placed[index] = "";
          $("circuitFeedback").textContent = "Choose another component, then tap a position.";
          renderBoard();
        }
      };
      $("circuitSlots").appendChild(slot);
    });
    $("componentTray").innerHTML = "";
    const shuffled = parts.slice().sort(() => Math.random() - .5);
    shuffled.forEach(part => {
      const b = document.createElement("button");
      b.className = "component-card" + (selected === part.id ? " selected" : "") + (placed.includes(part.id) ? " used" : "");
      b.disabled = locked || placed.includes(part.id);
      b.innerHTML = '<span class="component-symbol">'+part.symbol+'</span><strong>'+part.label+'</strong><small>'+part.hint+'</small>';
      b.onclick = () => {
        if (locked || placed.includes(part.id)) return;
        selected = selected === part.id ? "" : part.id;
        $("circuitFeedback").textContent = selected ? "Now tap one of the three empty positions." : "Choose a component to place.";
        renderBoard();
      };
      $("componentTray").appendChild(b);
    });
    $("attemptCount").textContent = "ATTEMPTS: " + attempts + " / 3";
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
    if (placed.every((x,i) => x === solution[i])) {
      locked = true;
      $("circuitPlay").classList.add("hidden");
      $("circuitResult").classList.remove("hidden");
      $("circuitResult").innerHTML = '<div class="circuit-win-icon">⚡</div><div class="eyebrow">CIRCUIT COMPLETE</div><h2>POWER RESTORED!</h2><p class="sub">Excellent work! You built a protected series circuit.</p><div class="circuit-explain"><strong>Why this order?</strong><br>Fuse protects the circuit from excessive current. The switch controls the current flow. The lamp uses electrical energy to produce light.</div><button class="primary" onclick="startCircuitGame()">PLAY AGAIN</button><button class="secondary" onclick="backToModeSelect()">MAIN MENU</button>';
    } else {
      $("circuitFeedback").textContent = attempts >= 3
        ? "Challenge over. The correct order is FUSE → SWITCH → LAMP."
        : "Not quite! Check the circuit path and try again. " + (3-attempts) + " attempt(s) left.";
      $("circuitFeedback").className = "circuit-feedback warn";
      if (attempts >= 3) {
        locked = true;
        $("checkCircuitBtn").classList.add("hidden");
        $("resetCircuitBtn").textContent = "TRY AGAIN";
      }
      $("attemptCount").textContent = "ATTEMPTS: " + attempts + " / 3";
    }
  };
  window.resetCircuitBoard = () => {
    if (attempts >= 3) { startCircuitGame(); return; }
    placed = ["","",""]; selected = "";
    $("circuitFeedback").textContent = "Board cleared. Build the circuit again.";
    $("circuitFeedback").className = "circuit-feedback";
    renderBoard();
  };
})();
