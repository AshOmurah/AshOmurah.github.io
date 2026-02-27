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

function render(){
  const it = data[idx];
  el("pos").textContent = `${idx+1} / ${data.length}  (No: ${it.id ?? ""})`;
  el("q").textContent = it.question;
  el("a").textContent = it.a;
  el("b").textContent = it.b;
  el("c").textContent = it.c;
  el("d").textContent = it.d;

  el("result").textContent = "";
  el("detail").style.display = "none";
  el("explain").textContent = "";
  el("topic").textContent = "";
  clearSelected();
}

async function main(){
  data = await (await fetch("data.json")).json();
  if(!Array.isArray(data) || data.length === 0){
    alert("data.json が空、または壊れています");
    return;
  }

  // correct を念のため小文字に統一
  data.forEach(x => x.correct = String(x.correct || "").trim().toLowerCase());

  render();

  el("btnNext").onclick = () => {
    idx = (idx + 1) % data.length;
    render();
  };

  el("btnCheck").onclick = () => {
    const it = data[idx];
    const ans = selected();
    if(!ans){
      alert("選択肢を選んでください");
      return;
    }

    if(ans === it.correct){
      el("result").innerHTML = `<span class="ok">正解</span>`;
      el("detail").style.display = "block";
      el("explain").textContent = it.explain || "";
      el("topic").textContent = it.topic || "";
    } else {
      // 不正解は何もしない（表示を変えない）
    }
  };
}

main();
