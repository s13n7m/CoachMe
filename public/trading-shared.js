function getEffectiveTheme(){
  const saved=localStorage.getItem("theme");
  if(saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyThemeIcon(){
  const btn=document.getElementById("themeToggle");
  if(!btn) return;
  btn.innerHTML = getEffectiveTheme()==="dark" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}
function initThemeToggle(){
  applyThemeIcon();
  const btn=document.getElementById("themeToggle");
  if(!btn) return;
  btn.addEventListener("click",()=>{
    const next = getEffectiveTheme()==="dark" ? "light" : "dark";
    localStorage.setItem("theme",next);
    document.documentElement.setAttribute("data-theme",next);
    applyThemeIcon();
  });
}

function initTrainerSelect(){
  const sel=document.getElementById("trainerSelect");
  if(!sel) return;
  sel.addEventListener("change",()=>{window.location.href=sel.value;});
}

function syncHeaderHeight(){
  const h=document.querySelector("header");
  if(!h)return;
  document.documentElement.style.setProperty("--header-h",h.offsetHeight+"px");
}

const QUESTION_TIME_BUDGET={easy:180,medium:420,hard:720,recall:600};
function estimateLabel(diff){return "~"+Math.round((QUESTION_TIME_BUDGET[diff]||420)/60)+" min";}
let questionTimerInterval=null,questionTimerSeconds=0,qtimerObserver=null;
function startQuestionTimer(diff){
  clearInterval(questionTimerInterval);
  questionTimerSeconds=0;
  renderQuestionTimer(diff);
  questionTimerInterval=setInterval(()=>{questionTimerSeconds++;renderQuestionTimer(diff);},1000);
  observeTimerVisibility();
}
function observeTimerVisibility(){
  if(qtimerObserver) qtimerObserver.disconnect();
  const el=document.getElementById("qtimerMain");
  if(!el||!("IntersectionObserver" in window)) return;
  qtimerObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      document.body.classList.toggle("timer-offscreen",!entry.isIntersecting);
    });
  },{threshold:0});
  qtimerObserver.observe(el);
}
function renderQuestionTimer(diff){
  const budget=QUESTION_TIME_BUDGET[diff]||420;
  const m=Math.floor(questionTimerSeconds/60),s=questionTimerSeconds%60;
  const text=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  let cls="qtimer";
  if(questionTimerSeconds>budget*2)cls+=" over";
  else if(questionTimerSeconds>budget)cls+=" warn";
  ["qtimerMain","qtimerScrolled"].forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.textContent=text;
    el.className=cls+(id==="qtimerScrolled"?" qtimer-scrolled":"");
  });
}

async function fetchFlaggedIds(track,mode){
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session) return [];
  const {data,error}=await supabaseClient.from("question_flags").select("question_id").eq("track",track).eq("mode",mode);
  if(error||!data) return [];
  return data.map(r=>r.question_id);
}
async function setQuestionFlag(track,mode,questionId,on){
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session) return;
  if(on){
    await supabaseClient.from("question_flags").upsert(
      {user_id:session.user.id,track,mode,question_id:questionId},
      {onConflict:"user_id,track,mode,question_id"}
    );
  }else{
    await supabaseClient.from("question_flags").delete()
      .eq("track",track).eq("mode",mode).eq("question_id",questionId);
  }
}

async function requestExplanation(payload){
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session) throw new Error("Sign in to use explanations.");
  const res=await fetch("/api/explain",{
    method:"POST",
    headers:{"content-type":"application/json","authorization":"Bearer "+session.access_token},
    body:JSON.stringify(payload)
  });
  const j=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(j.error||"Explanation failed - try again.");
  return j;
}
function getExplainModel(){
  return localStorage.getItem("explainModel")||"sonnet";
}
function initExplainModelSelect(){
  const sel=document.getElementById("explainModel");
  if(!sel) return;
  sel.value=getExplainModel();
  sel.addEventListener("change",()=>localStorage.setItem("explainModel",sel.value));
}
function setExplainWrongVisible(show){
  const btn=document.getElementById("explainWrongBtn");
  if(btn) btn.style.display=show?"":"none";
}

function mdEscape(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function mdInline(s){
  const codeSpans=[];
  s=s.replace(/`([^`]+)`/g,(m,p1)=>{codeSpans.push(p1);return "@@CODESPAN"+(codeSpans.length-1)+"@@";});
  s=s.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
  s=s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g,"$1<em>$2</em>");
  s=s.replace(/(^|[^_])_([^_\n]+)_(?!_)/g,"$1<em>$2</em>");
  s=s.replace(/@@CODESPAN(\d+)@@/g,(m,idx)=>"<code>"+codeSpans[+idx]+"</code>");
  return s;
}
function renderMarkdown(raw){
  const lines=mdEscape(raw||"").split("\n");
  let html="",inCode=false,codeBuf=[],listType=null,listBuf=[],paraBuf=[];
  function flushPara(){if(paraBuf.length){html+="<p>"+mdInline(paraBuf.join(" "))+"</p>";paraBuf=[];}}
  function flushList(){
    if(listType&&listBuf.length) html+="<"+listType+">"+listBuf.map(li=>"<li>"+mdInline(li)+"</li>").join("")+"</"+listType+">";
    listType=null;listBuf=[];
  }
  lines.forEach(line=>{
    if(/^```/.test(line)){
      if(inCode){html+="<pre><code>"+codeBuf.join("\n")+"</code></pre>";codeBuf=[];inCode=false;}
      else{flushPara();flushList();inCode=true;}
      return;
    }
    if(inCode){codeBuf.push(line);return;}
    if(!line.trim()){flushPara();return;}
    const h=line.match(/^(#{1,4})\s+(.*)/);
    if(h){flushPara();flushList();const lvl=Math.min(h[1].length+3,6);html+="<h"+lvl+">"+mdInline(h[2])+"</h"+lvl+">";return;}
    const ol=line.match(/^\s*\d+[.)]\s+(.*)/);
    if(ol){flushPara();if(listType!=="ol"){flushList();listType="ol";}listBuf.push(ol[1]);return;}
    const ul=line.match(/^\s*[-*]\s+(.*)/);
    if(ul){flushPara();if(listType!=="ul"){flushList();listType="ul";}listBuf.push(ul[1]);return;}
    flushList();
    paraBuf.push(line.trim());
  });
  flushPara();flushList();
  if(inCode&&codeBuf.length) html+="<pre><code>"+codeBuf.join("\n")+"</code></pre>";
  return html||"<p></p>";
}

function buildSidebarFilterBar(){
  return '<div class="sidebar-filters" id="sidebarFilters">'
    +'<div class="filter-row">'
      +'<input type="search" id="sidebarSearch" class="sidebar-search" placeholder="Search topics or questions...">'
    +'</div>'
    +'<div class="filter-row topic-toolbar">'
      +'<button class="fa-btn" id="expandAllBtn">Expand all</button>'
      +'<button class="fa-btn" id="collapseAllBtn">Collapse all</button>'
    +'</div>'
    +'<div class="filter-row"><span class="filter-lbl">Difficulty</span>'
      +'<button class="fchip" data-group="diff" data-value="easy">Easy</button>'
      +'<button class="fchip" data-group="diff" data-value="medium">Medium</button>'
      +'<button class="fchip" data-group="diff" data-value="hard">Hard</button>'
      +'<button class="fchip" data-group="diff" data-value="recall">Recall</button>'
    +'</div>'
    +'<div class="filter-row"><span class="filter-lbl">Time</span>'
      +'<button class="fchip" data-group="time" data-value="quick">&lt;5 min</button>'
      +'<button class="fchip" data-group="time" data-value="medium">5-10 min</button>'
      +'<button class="fchip" data-group="time" data-value="long">10+ min</button>'
    +'</div>'
    +'<div class="filter-row">'
      +'<button class="fchip fchip-star" data-group="star" data-value="starred">&#9733; Starred only</button>'
      +'<button class="filter-clear" id="filterClearBtn" style="display:none">Clear filters</button>'
    +'</div>'
  +'</div>';
}
const __sidebarFilterState={diff:new Set(),time:new Set(),star:false,search:""};
function __questionTimeBucket(diff){
  const secs=(typeof QUESTION_TIME_BUDGET!=="undefined" && QUESTION_TIME_BUDGET[diff])||420;
  if(secs<300) return "quick";
  if(secs<600) return "medium";
  return "long";
}
function __questionMatchesFilters(q){
  if(__sidebarFilterState.diff.size && !__sidebarFilterState.diff.has(q.diff)) return false;
  if(__sidebarFilterState.time.size && !__sidebarFilterState.time.has(__questionTimeBucket(q.diff))) return false;
  if(__sidebarFilterState.star && !flagged.has(q.id)) return false;
  if(__sidebarFilterState.search){
    const hay=(q.topic+" "+(q.ask||"")+" "+(q.prompt||"")).toLowerCase();
    if(!hay.includes(__sidebarFilterState.search)) return false;
  }
  return true;
}
function applySidebarFilters(){
  const sidebar=document.getElementById("sidebar");
  if(!sidebar) return;
  sidebar.querySelectorAll(".qbtn").forEach(btn=>{
    const q=QUESTIONS[+btn.dataset.i];
    btn.style.display=__questionMatchesFilters(q)?"":"none";
  });
  sidebar.querySelectorAll(".topic").forEach(topicEl=>{
    const anyVisible=Array.from(topicEl.querySelectorAll(".qbtn")).some(b=>b.style.display!=="none");
    topicEl.style.display=anyVisible?"":"none";
  });
  const anyActive=__sidebarFilterState.diff.size||__sidebarFilterState.time.size||__sidebarFilterState.star||__sidebarFilterState.search;
  const clearBtn=document.getElementById("filterClearBtn");
  if(clearBtn) clearBtn.style.display=anyActive?"":"none";
}
function initSidebarFilters(){
  const bar=document.getElementById("sidebarFilters");
  if(!bar) return;
  const searchInput=document.getElementById("sidebarSearch");
  if(searchInput){
    searchInput.addEventListener("input",()=>{
      __sidebarFilterState.search=searchInput.value.trim().toLowerCase();
      applySidebarFilters();
    });
  }
  bar.addEventListener("click",e=>{
    const clearBtn=e.target.closest("#filterClearBtn");
    if(clearBtn){
      __sidebarFilterState.diff.clear();__sidebarFilterState.time.clear();__sidebarFilterState.star=false;__sidebarFilterState.search="";
      bar.querySelectorAll(".fchip").forEach(c=>c.classList.remove("active"));
      if(searchInput) searchInput.value="";
      applySidebarFilters();
      return;
    }
    const chip=e.target.closest(".fchip");
    if(!chip) return;
    const group=chip.dataset.group,value=chip.dataset.value;
    if(group==="star"){
      __sidebarFilterState.star=!__sidebarFilterState.star;
      chip.classList.toggle("active",__sidebarFilterState.star);
    }else{
      const set=__sidebarFilterState[group];
      if(set.has(value)){set.delete(value);chip.classList.remove("active");}
      else{set.add(value);chip.classList.add("active");}
    }
    applySidebarFilters();
  });
  applySidebarFilters();
}

function initTopicCollapse(storageKey){
  const sidebar=document.getElementById("sidebar");
  if(!sidebar) return;
  let collapsedSet;
  try{ collapsedSet=new Set(JSON.parse(localStorage.getItem(storageKey)||"[]")); }
  catch(e){ collapsedSet=new Set(); }
  function apply(){
    sidebar.querySelectorAll(".topic").forEach(el=>{
      const ti=el.dataset.topic;
      const isCollapsed=collapsedSet.has(ti);
      el.classList.toggle("collapsed",isCollapsed);
      const chev=el.querySelector(".topic-chev");
      if(chev) chev.textContent=isCollapsed?"show":"hide";
    });
  }
  sidebar.addEventListener("click",e=>{
    if(e.target.closest("#expandAllBtn")){
      collapsedSet.clear();
      localStorage.setItem(storageKey,JSON.stringify([...collapsedSet]));
      apply();
      return;
    }
    if(e.target.closest("#collapseAllBtn")){
      sidebar.querySelectorAll(".topic").forEach(el=>collapsedSet.add(el.dataset.topic));
      localStorage.setItem(storageKey,JSON.stringify([...collapsedSet]));
      apply();
      return;
    }
    const head=e.target.closest(".topic-head");
    if(!head) return;
    const topicEl=head.closest(".topic");
    const ti=topicEl.dataset.topic;
    if(collapsedSet.has(ti)) collapsedSet.delete(ti); else collapsedSet.add(ti);
    localStorage.setItem(storageKey,JSON.stringify([...collapsedSet]));
    apply();
  });
  apply();
}

function initShellLayout(){
  const wrap=document.querySelector(".wrap");
  const aside=document.getElementById("sidebar");
  const main=document.querySelector("main");
  const right=document.getElementById("rightCol");
  const resizer=document.getElementById("colResizer");
  if(!wrap||!aside||!main||!right) return;

  const toggle=document.getElementById("sidebarToggle");
  if(!toggle) return;

  const mq=window.matchMedia("(min-width:861px)");
  const MIN_PCT=22,MAX_PCT=65,DEFAULT_PCT=40;

  function moveEditor(toRight){
    const ask=document.getElementById("ask");
    const promptBox=document.getElementById("promptBox");
    const editor=document.querySelector(".editor-wrap");
    const actions=document.querySelector(".actions");
    const explainBox=document.getElementById("explainBox");
    const verdict=document.getElementById("verdict");
    const schema=document.getElementById("schema");
    const order=[ask,promptBox,editor,actions];
    if(toRight){
      order.forEach(el=>{if(el)right.appendChild(el);});
      if(explainBox)right.appendChild(explainBox);
    }else{
      order.forEach(el=>{
        if(!el) return;
        if(verdict) main.insertBefore(el,verdict);
        else main.appendChild(el);
      });
      if(explainBox){
        if(schema) main.insertBefore(explainBox,schema);
        else main.appendChild(explainBox);
      }
    }
  }

  function applyColumnRatio(){
    if(!mq.matches){
      main.style.flex="";
      right.style.flex="";
      return;
    }
    const pct=Math.min(MAX_PCT,Math.max(MIN_PCT,parseFloat(localStorage.getItem("colSplitPct"))||DEFAULT_PCT));
    right.style.flex="0 0 "+pct+"%";
    main.style.flex="1 1 0%";
  }

  function initResizer(){
    if(!resizer) return;
    let startX=0,startPct=DEFAULT_PCT,containerWidth=0;
    function onMove(e){
      const x=e.touches?e.touches[0].clientX:e.clientX;
      const deltaPct=((startX-x)/containerWidth)*100;
      const pct=Math.min(MAX_PCT,Math.max(MIN_PCT,startPct+deltaPct));
      right.style.flex="0 0 "+pct+"%";
      main.style.flex="1 1 0%";
      localStorage.setItem("colSplitPct",String(pct));
    }
    function onUp(){
      document.body.classList.remove("col-resizing");
      resizer.classList.remove("dragging");
      document.removeEventListener("mousemove",onMove);
      document.removeEventListener("mouseup",onUp);
      document.removeEventListener("touchmove",onMove);
      document.removeEventListener("touchend",onUp);
      syncHeaderHeight();
    }
    function onDown(e){
      if(!mq.matches) return;
      const x=e.touches?e.touches[0].clientX:e.clientX;
      startX=x;
      containerWidth=main.getBoundingClientRect().width+right.getBoundingClientRect().width+resizer.getBoundingClientRect().width;
      startPct=Math.min(MAX_PCT,Math.max(MIN_PCT,parseFloat(localStorage.getItem("colSplitPct"))||DEFAULT_PCT));
      document.body.classList.add("col-resizing");
      resizer.classList.add("dragging");
      document.addEventListener("mousemove",onMove);
      document.addEventListener("mouseup",onUp);
      document.addEventListener("touchmove",onMove,{passive:false});
      document.addEventListener("touchend",onUp);
      e.preventDefault();
    }
    resizer.addEventListener("mousedown",onDown);
    resizer.addEventListener("touchstart",onDown,{passive:false});
  }

  function apply(){
    const collapsed=document.body.classList.contains("sidebar-collapsed");
    toggle.textContent=collapsed?"›":"‹";
    toggle.setAttribute("aria-label",collapsed?"Show topic list":"Hide topic list");
    moveEditor(mq.matches);
    applyColumnRatio();
    syncHeaderHeight();
  }

  function toggleSidebar(){
    const collapsed=!document.body.classList.contains("sidebar-collapsed");
    document.body.classList.toggle("sidebar-collapsed",collapsed);
    localStorage.setItem("sidebarCollapsed",collapsed?"1":"0");
    apply();
  }

  toggle.addEventListener("click",toggleSidebar);
  mq.addEventListener("change",apply);
  initResizer();

  document.body.classList.toggle("sidebar-collapsed",localStorage.getItem("sidebarCollapsed")==="1");
  apply();
}
