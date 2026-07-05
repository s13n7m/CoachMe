const QUIZ_QUESTIONS = [{"id": 0, "topic": "DataFrame basics & inspection", "diff": "easy", "ordered": false, "ask": "Before we dig in, confirm how many rows and columns the products table actually has.", "solution": "result = products.shape"}, {"id": 1, "topic": "Selecting, filtering, and boolean indexing", "diff": "medium", "ordered": false, "ask": "Support needs the ID and name of every customer in Germany who joined through a referral.", "solution": "result = customers.loc[(customers['country']=='Germany') & (customers['acquisition_channel']=='Referral'), ['customer_id','first_name']]"}, {"id": 2, "topic": "Sorting and top-N selection", "diff": "medium", "ordered": true, "ask": "For a leaderboard, pull the five customers who signed up most recently, newest first.", "solution": "result = customers.sort_values(['signup_date','customer_id'], ascending=[False,False])[['customer_id','first_name','signup_date']].head(5)"}, {"id": 3, "topic": "GroupBy aggregation", "diff": "medium", "ordered": false, "ask": "How many unique customers have actually made a completed purchase?", "solution": "result = int(transactions.loc[transactions['status']=='completed','customer_id'].nunique())"}, {"id": 4, "topic": "Multi-column grouping & custom aggregations (.agg)", "diff": "medium", "ordered": false, "ask": "Give finance the completed transaction count and total revenue for each product.", "solution": "c = transactions[transactions['status']=='completed']\nresult = c.groupby('product_id').agg(txn_count=('transaction_id','count'), revenue=('amount','sum'))\nresult['revenue'] = result['revenue'].round(2)"}, {"id": 5, "topic": "Merging and joining DataFrames", "diff": "medium", "ordered": false, "ask": "For every completed transaction, we need the customer's name next to the product they bought.", "solution": "m = transactions[transactions['status']=='completed'].merge(customers[['customer_id','first_name']], on='customer_id').merge(products[['product_id','product_name']], on='product_id')\nresult = m[['first_name','product_name']]"}, {"id": 6, "topic": "Handling missing and duplicate data", "diff": "medium", "ordered": false, "ask": "Which customers are missing a signup date in our records?", "solution": "result = customers.loc[customers['signup_date'].isna(), ['customer_id','first_name']]"}, {"id": 7, "topic": "String manipulation and regex extraction", "diff": "medium", "ordered": false, "ask": "For an export, combine each customer's name and their acquisition channel into one readable string like 'Ugo via Referral'.", "solution": "result = customers.assign(label=customers['first_name']+' via '+customers['acquisition_channel'])[['customer_id','label']]"}, {"id": 8, "topic": "Date and time manipulation", "diff": "medium", "ordered": true, "ask": "Chart total revenue by calendar month, oldest month first.", "solution": "t = transactions.assign(mth=pd.to_datetime(transactions['txn_date']).dt.strftime('%Y-%m'))\nresult = t.groupby('mth')['amount'].sum().round(2).sort_index()"}, {"id": 9, "topic": "Apply, map, and vectorized operations (np.where/np.select)", "diff": "medium", "ordered": false, "ask": "For every customer, label them 'enterprise' if they're in that segment, or 'other' otherwise.", "solution": "result = customers.assign(tier=np.where(customers['segment']=='Enterprise','enterprise','other'))[['customer_id','tier']]"}, {"id": 10, "topic": "Pivot tables and cross-tabulation", "diff": "hard", "ordered": false, "ask": "Show me total revenue as a matrix: one row per product, one column per transaction status.", "solution": "result = pd.pivot_table(transactions, values='amount', index='product_id', columns='status', aggfunc='sum').round(2)"}, {"id": 11, "topic": "Window functions: rolling, cumulative sum, shift/diff", "diff": "hard", "ordered": false, "ask": "For every transaction, show what fraction of the grand total revenue that single transaction represents.", "solution": "total = transactions['amount'].sum()\nresult = transactions.assign(pct_of_total=(transactions['amount']/total*100).round(2))[['transaction_id','pct_of_total']]"}, {"id": 12, "topic": "Ranking and deduplication (latest-record-per-group patterns)", "diff": "hard", "ordered": false, "ask": "For each customer, we only want their single most recent transaction, nothing older.", "solution": "t = transactions.sort_values(['customer_id','txn_date','transaction_id'], ascending=[True,False,False])\nresult = t.drop_duplicates(subset='customer_id', keep='first')[['customer_id','transaction_id','txn_date','amount']]"}, {"id": 13, "topic": "Reshaping data: melt, stack/unstack, wide vs long", "diff": "hard", "ordered": false, "ask": "Build the product-by-status revenue matrix, then reshape it back into a tidy long table.", "solution": "p = pd.pivot_table(transactions, values='amount', index='product_id', columns='status', aggfunc='sum').round(2).reset_index()\nresult = p.melt(id_vars='product_id', var_name='status', value_name='revenue')"}, {"id": 14, "topic": "Cohort and retention analysis in pandas", "diff": "hard", "ordered": true, "ask": "Group customers by the month they signed up, and for each group tell me what fraction were still transacting the following month.", "solution": "c = customers.copy()\nc['signup_dt'] = pd.to_datetime(c['signup_date'])\nc['cohort_month'] = c['signup_dt'].dt.strftime('%Y-%m')\nc['next_month'] = (c['signup_dt'] + pd.offsets.MonthBegin(1)).dt.strftime('%Y-%m')\nt = transactions.copy()\nt['txn_month'] = pd.to_datetime(t['txn_date']).dt.strftime('%Y-%m')\nactive_pairs = set(zip(t['customer_id'], t['txn_month']))\nc['retained'] = c.apply(lambda r: (r['customer_id'], r['next_month']) in active_pairs, axis=1)\ng = c.groupby('cohort_month').agg(cohort_size=('customer_id','size'), retained_m1=('retained','sum')).reset_index()\ng['retention_m1'] = (g['retained_m1']/g['cohort_size']).round(2)\nresult = g.sort_values('cohort_month')"}, {"id": 15, "topic": "Funnel conversion and rate math in pandas", "diff": "hard", "ordered": false, "ask": "Out of everyone who signed up, what fraction ever made a first payment? Guard against dividing by zero.", "solution": "signups = events.loc[events['event_type']=='signup','customer_id'].nunique()\npaid = events.loc[events['event_type']=='first_payment','customer_id'].nunique()\nresult = round(paid/signups, 3) if signups else None"}, {"id": 16, "topic": "A/B testing & hypothesis testing (t-test, chi-square, confidence intervals)", "diff": "hard", "ordered": false, "ask": "The causal team needs to know if average transaction size actually differs between treatment and control. Run the appropriate test.", "solution": "from scipy import stats\nm = transactions.merge(campaign, on='customer_id')\na = m.loc[m['exp_group']=='treatment','amount']\nb = m.loc[m['exp_group']=='control','amount']\nt_stat, p_value = stats.ttest_ind(a, b, equal_var=False)\nresult = {'t_stat': round(t_stat,4), 'p_value': round(p_value,4)}"}, {"id": 17, "topic": "Simulation & probability", "diff": "hard", "ordered": false, "ask": "Using a seed of 42, simulate 1000 fair coin flips and tell me the observed proportion of heads.", "solution": "np.random.seed(42)\nflips = np.random.randint(0,2,size=1000)\nresult = round(float(flips.mean()), 3)"}, {"id": 18, "topic": "Core Python: lists, dicts, sets & comprehensions", "diff": "medium", "ordered": false, "ask": "Given this list of statuses, tell me how many of each type appear, without using pandas.", "solution": "from collections import Counter\nstatuses = ['completed','failed','completed','completed','refunded','failed']\nresult = dict(Counter(statuses))"}, {"id": 19, "topic": "Core Python: functions, control flow & writing reusable logic", "diff": "medium", "ordered": false, "ask": "Write a small reusable function that safely computes a rate without ever crashing on a zero denominator, then use it on 10 over 0 and 10 over 4.", "solution": "def safe_rate(n, d):\n    return None if d == 0 else round(n/d, 3)\nresult = [safe_rate(10,0), safe_rate(10,4)]"}];

let current=0;
const solved=new Set();
const savedQueries={};
let startIndex=0;

function buildSidebar(){
  let html="";
  QUIZ_QUESTIONS.forEach((q,i)=>{
    html+='<button class="qbtn'+(solved.has(q.id)?" done":"")+'" data-i="'+i+'"><span class="dot">'+(solved.has(q.id)?"\u2713":"")+'</span><span class="lbl">'+(i+1)+'. '+q.topic+'</span></button>';
  });
  return html;
}
function buildMain(){
  return '<main>'
    +'<div class="qhead" id="qhead"></div>'
    +'<div class="ask" id="ask"><span class="albl">Question</span><span class="atext" id="askText"></span></div>'
    +'<div class="editor-wrap"><div class="editor-bar"><span id="editorLabel">answer.py</span><button class="schema-toggle" id="schemaBtn">view tables</button></div><textarea id="sql" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div>'
    +'<div class="actions"><button class="act run" id="runBtn">Run and check</button><button class="act" id="solBtn">Show solution</button><button class="act" id="explainBtn">Explain solution</button><button class="act" id="explainWrongBtn" style="display:none">Explain my error</button><select id="explainModel" class="explain-model"><option value="sonnet">Sonnet 5</option><option value="haiku">Haiku 4.5</option></select><button class="act" id="resetBtn">Clear</button><button class="act" id="prevBtn">&larr; Previous</button><button class="act" id="nextBtn">Next &rarr;</button><span class="kbd">Cmd / Ctrl + Enter &middot; Shift + &larr;/&rarr;</span></div>'
    +'<div class="verdict" id="verdict"><span class="ic" id="vic"></span><span id="vmsg"></span></div>'
    +'<div class="stdoutbox" id="stdoutBox" style="display:none"><div class="lbl">Console output</div><pre id="stdoutText"></pre></div>'
    +'<div class="stdoutbox" id="varsBox" style="display:none"><div class="lbl">Your variables</div><div id="varsText"></div></div>'
    +'<div class="results" id="resultsBox" style="display:none"><h3>Your result</h3><div class="tablescroll" id="tableScroll"></div><div class="rowcount" id="rowCount"></div></div>'
    +'<div class="solution" id="solution"><div class="lbl">One correct solution (there are often several)</div><pre id="solText"></pre></div>'
    +'<div class="explainbox" id="explainBox" style="display:none"><div class="lbl">Claude explains</div><div id="explainText"></div></div>'
    +'<div class="schema" id="schema"></div></main>';
}

function updateProgress(){
  document.getElementById("doneCount").textContent=solved.size;
  document.getElementById("progBar").style.width=Math.round(solved.size/QUIZ_QUESTIONS.length*100)+"%";
}

function loadQuestion(i){
  current=i;const q=QUIZ_QUESTIONS[i];
  document.getElementById("qhead").innerHTML='<span class="pill '+q.diff+'">'+q.diff+'</span><span class="pill">'+q.topic+'</span><span class="pill est" id="estBadge">'+estimateLabel(q.diff)+'</span><span class="qtimer" id="qtimerMain">00:00</span><span class="cleared '+(solved.has(q.id)?"show":"")+'" id="clearedStamp">cleared</span>';
  startQuestionTimer(q.diff);
  document.getElementById("askText").textContent=q.ask;
  document.getElementById("sql").value=savedQueries[q.id]||"";
  document.getElementById("verdict").className="verdict";
  document.getElementById("stdoutBox").style.display="none";
  document.getElementById("varsBox").style.display="none";
  document.getElementById("resultsBox").style.display="none";
  document.getElementById("solution").className="solution";
  document.getElementById("explainBox").style.display="none";
  setExplainWrongVisible(false);
  document.getElementById("solText").textContent=q.solution;
  document.querySelectorAll(".qbtn").forEach(b=>b.classList.toggle("active",+b.dataset.i===i));
  document.getElementById("prevBtn").disabled=(i===0);
  document.getElementById("nextBtn").disabled=(i===QUIZ_QUESTIONS.length-1);
  document.querySelector("main").scrollIntoView({behavior:"smooth",block:"start"});
  document.getElementById("sql").focus({preventScroll:true});
}
function goToQuestion(delta){
  const next=current+delta;
  if(next>=0 && next<QUIZ_QUESTIONS.length) loadQuestion(next);
}
function markSolved(i){
  const id=QUIZ_QUESTIONS[i].id;
  if(!solved.has(id)){
    solved.add(id);
    const btn=document.querySelector('.qbtn[data-i="'+i+'"]');
    if(btn){btn.classList.add("done");btn.querySelector(".dot").textContent="\u2713";}
    const st=document.getElementById("clearedStamp");if(st)st.classList.add("show");
    updateProgress();
  }
}
async function doRun(){
  const q=QUIZ_QUESTIONS[current];const code=document.getElementById("sql").value;
  const verdict=document.getElementById("verdict"),vic=document.getElementById("vic"),vmsg=document.getElementById("vmsg"),resultsBox=document.getElementById("resultsBox");
  if(!code.trim())return;
  const runBtn=document.getElementById("runBtn");
  runBtn.disabled=true;runBtn.textContent="Running...";
  let g;
  try{
    g=await runAndGrade(code, q.solution, q.ordered);
  }finally{
    runBtn.disabled=false;runBtn.textContent="Run and check";
  }
  const stdoutBox=document.getElementById("stdoutBox");
  if(g.stdout && g.stdout.trim()){
    stdoutBox.style.display="block";
    document.getElementById("stdoutText").textContent=g.stdout;
  }else{
    stdoutBox.style.display="none";
  }
  const varsBox=document.getElementById("varsBox");
  varsBox.style.display="none";
  if(g.error){
    verdict.className="verdict no";vic.textContent="!";vmsg.textContent="Python error: "+g.error;
    resultsBox.style.display="none";
    setExplainWrongVisible(true);
    return;
  }
  if(g.no_result){
    verdict.className="verdict no";vic.textContent="?";vmsg.textContent=g.msg;
    resultsBox.style.display="none";
    setExplainWrongVisible(true);
    if(g.vars && g.vars.length){
      varsBox.style.display="block";
      document.getElementById("varsText").innerHTML=g.vars.map(v=>
        '<div style="margin-bottom:6px"><b>'+v.name+'</b> <span style="color:var(--muted)">('+v.type+')</span><br>'+v.preview+'</div>'
      ).join("");
    }
    return;
  }
  resultsBox.style.display="block";
  document.getElementById("tableScroll").innerHTML=renderPyTable(g);
  const n=g.rowcount;
  document.getElementById("rowCount").textContent=n+" row"+(n===1?"":"s")+" returned"+(n>200?" (showing first 200)":"")+(g.source==="last_expression"?" (read from the last line of your code)":"");
  if(g.ok){verdict.className="verdict ok";vic.textContent="\u2713";vmsg.textContent=g.msg;markSolved(current);savedQueries[q.id]=code;}
  else{verdict.className="verdict no";vic.textContent="\u2717";vmsg.textContent=g.msg;}
  logAttempt(q.id,code,g.ok);
  setExplainWrongVisible(!g.ok);
}

let supabaseClient=null, currentUser=null;

function initSupabase(){
  supabaseClient=window.supabase.createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__);
}

function showSignOutBtn(){
  const btn=document.getElementById("signOutBtn");
  btn.classList.add("visible");
  btn.addEventListener("click",()=>{
    supabaseClient.auth.signOut().then(()=>window.location.reload());
  });
}

function requireAuth(){
  return supabaseClient.auth.getSession().then(({data:{session}})=>{
    if(session){currentUser=session.user;showSignOutBtn();return;}
    const gate=document.getElementById("authGate");
    gate.style.display="flex";
    return new Promise(resolve=>{
      document.getElementById("googleSignInBtn").addEventListener("click",()=>{
        supabaseClient.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/python-quiz"}});
      });
      supabaseClient.auth.onAuthStateChange((event,session)=>{
        if(session && !currentUser){
          currentUser=session.user;
          gate.style.display="none";
          showSignOutBtn();
          resolve();
        }
      });
    });
  });
}

function checkUnlocked(){
  return supabaseClient.from("attempts").select("question_id").eq("mode","trainer").eq("track","python").eq("passed",true).lt("question_id",60)
    .then(({data,error})=>{
      if(error||!data) return false;
      const distinct=new Set(data.map(r=>r.question_id));
      return distinct.size>=60;
    });
}

function hydrateProgress(){
  return supabaseClient.from("attempts").select("question_id,passed,query_text,created_at").eq("mode","quiz").eq("track","python").order("created_at",{ascending:true})
    .then(({data,error})=>{
      if(error||!data) return;
      data.forEach(r=>{
        if(r.passed){solved.add(r.question_id);savedQueries[r.question_id]=r.query_text;}
      });
      if(data.length) startIndex=data[data.length-1].question_id;
    });
}

async function runExplain(kind){
  const q=QUIZ_QUESTIONS[current];
  const btn=document.getElementById(kind==="solution"?"explainBtn":"explainWrongBtn");
  const box=document.getElementById("explainBox");
  const txt=document.getElementById("explainText");
  const orig=btn.textContent;
  btn.disabled=true;btn.textContent="Thinking...";
  try{
    const payload={track:"python",mode:"quiz",questionId:q.id,kind,ask:q.ask,prompt:q.prompt||"",solution:q.solution,model:getExplainModel()};
    if(kind==="attempt")payload.userCode=document.getElementById("sql").value;
    const r=await requestExplanation(payload);
    box.style.display="block";
    txt.innerHTML=renderMarkdown(r.content);
    box.scrollIntoView({behavior:"smooth",block:"nearest"});
  }catch(e){
    box.style.display="block";
    txt.textContent=e.message;
  }finally{
    btn.disabled=false;btn.textContent=orig;
  }
}

function logAttempt(questionId,queryText,passed){
  if(!supabaseClient||!currentUser) return;
  supabaseClient.from("attempts").insert({question_id:questionId,query_text:queryText,passed,mode:"quiz",track:"python"}).then(()=>{});
}

function showLocked(){
  document.getElementById("app").className="";
  document.getElementById("app").innerHTML='<div class="loading" style="max-width:520px;margin:40px auto;text-align:center;">'
    +'<h2 style="color:var(--pp-navy);margin:0 0 10px;">Quiz locked</h2>'
    +'<p style="color:var(--muted);font-family:var(--sans);font-size:14px;">Clear all 60 trainer questions first to unlock the certification quiz.</p>'
    +'<a href="/python" style="display:inline-block;margin-top:14px;background:var(--pp-blue);color:#fff;border-radius:99px;padding:10px 20px;text-decoration:none;font-family:var(--sans);font-size:14px;font-weight:600;">Back to Trainer</a>'
    +'</div>';
}

initSupabase();
initThemeToggle();
initTrainerSelect();

window.addEventListener("scroll",()=>{
  document.body.classList.toggle("scrolled",window.scrollY>30);
  syncHeaderHeight();
  setTimeout(syncHeaderHeight,200);
},{passive:true});

if(window.visualViewport){
  window.visualViewport.addEventListener("resize",()=>{
    document.body.classList.toggle("scrolled",window.scrollY>30);
    syncHeaderHeight();
  });
}

window.addEventListener("resize",syncHeaderHeight);
syncHeaderHeight();
setTimeout(syncHeaderHeight,300);

Promise.all([
  initPyodideEnv(),
  requireAuth().then(checkUnlocked)
])
.then(([_pyodide,unlocked])=>{
  if(!unlocked){showLocked();return;}
  return hydrateProgress().then(()=>{
    const app=document.getElementById("app");app.className="";
    app.innerHTML='<div class="wrap"><aside id="sidebar">'+buildSidebar()+'</aside>'+buildMain()+'<div class="right-col" id="rightCol"></div></div>';
    document.getElementById("schema").innerHTML=buildPySchema();
    document.getElementById("totalCount").textContent=QUIZ_QUESTIONS.length;
    document.querySelectorAll(".qbtn").forEach(b=>b.addEventListener("click",()=>loadQuestion(+b.dataset.i)));
    document.getElementById("runBtn").addEventListener("click",doRun);
  document.getElementById("explainBtn").addEventListener("click",()=>runExplain("solution"));
  document.getElementById("explainWrongBtn").addEventListener("click",()=>runExplain("attempt"));
  initExplainModelSelect();
  initColumnLayout();
    document.getElementById("solBtn").addEventListener("click",()=>document.getElementById("solution").classList.toggle("show"));
    document.getElementById("resetBtn").addEventListener("click",()=>{document.getElementById("sql").value="";document.getElementById("sql").focus();});
    document.getElementById("schemaBtn").addEventListener("click",()=>document.getElementById("schema").scrollIntoView({behavior:"smooth"}));
    document.getElementById("prevBtn").addEventListener("click",()=>goToQuestion(-1));
    document.getElementById("nextBtn").addEventListener("click",()=>goToQuestion(1));
    const ta=document.getElementById("sql");
    ta.addEventListener("keydown",e=>{
      if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();doRun();}
      if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart,en=ta.selectionEnd;ta.value=ta.value.slice(0,s)+"    "+ta.value.slice(en);ta.selectionStart=ta.selectionEnd=s+4;}
    });
    document.addEventListener("keydown",e=>{
      if(!e.shiftKey || document.activeElement===ta) return;
      if(e.key==="ArrowLeft"){e.preventDefault();goToQuestion(-1);}
      if(e.key==="ArrowRight"){e.preventDefault();goToQuestion(1);}
    });
    updateProgress();loadQuestion(Math.min(startIndex,QUIZ_QUESTIONS.length-1));
  });
})
.catch(err=>{document.getElementById("app").innerHTML='<div class="loading">Could not load the Python engine. Check your connection and reload. ('+err.message+')</div>';});
