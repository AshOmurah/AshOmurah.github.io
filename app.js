let data = [];
let idx = 0;

const el = (id) => document.getElementById(id);

function selected() {
  const r = document.querySelector('input[name="ans"]:checked');
  return r ? r.value : "";
}
function clearSelected() {
  const r = document.querySelector('input[name="ans"]:checked');
  if (r) r.checked = false;
}

function mp3Url(item){
  // H列セル番地 + .mp3 を再生（例：H2.mp3）
  return `audio/${item.hCell}.mp3`;
}

function render(){
  const it = data[idx];
  el("pos").textContent = `${idx+1} / ${data.length}  (ID: ${it.id ?? ""})`;
  el("q").textContent = it.question;
  el("a").textContent = it.a;
  el("b").textContent = it.b;
  el("c").textContent = it.c;
  el("d").textContent = it.d;

  el("result").textContent = "";
  el("exCard").style.display = "none";
  el("btnPlay").style.display = "none";
  el("audio").style.display = "none";
  el("audio").src = "";
  clearSelected();
}

async function tryPlay(){
  try { await el("audio").play(); } catch(e) {}
}

async function main(){
  data = await (await fetch("data.json")).json();
  if(!Array.isArray(data) || data.length === 0){ alert("data.json が空です"); return; }
  render();

  el("btnNext").onclick = () => { idx = (idx+1) % data.length; render(); };

  el("btnCheck").onclick = async () => {
    const it = data[idx];
    const ans = selected();
    if(!ans){ alert("選択肢を選んでください"); return; }

    const ok = (ans === it.correct);
    el("result").innerHTML = ok ? `<span class="ok">正解</span>` : `<span class="ng">不正解</span>`;

    if(ok){
      el("exCard").style.display = "block";
      el("ex").textContent = it.example || "";
      el("ja").textContent = it.translation || "";

      el("audio").src = mp3Url(it);
      el("btnPlay").style.display = "inline-block";
      el("audio").style.display = "block";

      // 端末によっては「解答ボタン操作の流れ」で自動再生できる場合あり
      await tryPlay();
    } else {
      el("exCard").style.display = "none";
      el("audio").src = "";
    }
  };

  el("btnPlay").onclick = async () => { await tryPlay(); };
}

main();