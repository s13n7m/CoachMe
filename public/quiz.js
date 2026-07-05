const QUIZ_QUESTIONS = [{"id": 0, "topic": "SELECT and DISTINCT", "diff": "easy", "ordered": false, "ask": "Marketing wants a quick list of every country we have customers in, with no duplicates.", "solution": "SELECT DISTINCT country FROM customers;"}, {"id": 1, "topic": "Filtering with WHERE", "diff": "medium", "ordered": false, "ask": "Support needs the ID and name of every customer in Germany who joined through a referral.", "solution": "SELECT customer_id, first_name FROM customers WHERE country='Germany' AND acquisition_channel='Referral';"}, {"id": 2, "topic": "Sorting and limiting", "diff": "medium", "ordered": true, "ask": "For a leaderboard slide, pull the five customers who signed up most recently, newest first.", "solution": "SELECT customer_id, first_name, signup_date FROM customers ORDER BY signup_date DESC, customer_id DESC LIMIT 5;"}, {"id": 3, "topic": "Aggregation and COUNT DISTINCT", "diff": "medium", "ordered": false, "ask": "How many unique customers have actually made a completed purchase, as a single number?", "solution": "SELECT COUNT(DISTINCT customer_id) AS active_customers FROM transactions WHERE status='completed';"}, {"id": 4, "topic": "GROUP BY", "diff": "medium", "ordered": false, "ask": "Give finance the total completed revenue for each product.", "solution": "SELECT product_id, ROUND(SUM(amount),2) AS revenue FROM transactions WHERE status='completed' GROUP BY product_id;"}, {"id": 5, "topic": "HAVING", "diff": "medium", "ordered": false, "ask": "Which customers have spent more than 1000 in total, across all their transactions?", "solution": "SELECT customer_id, ROUND(SUM(amount),2) AS total_amount FROM transactions GROUP BY customer_id HAVING SUM(amount) > 1000;"}, {"id": 6, "topic": "CASE expressions", "diff": "medium", "ordered": false, "ask": "For every customer, label them 'enterprise' if they're in that segment, or 'smb_or_consumer' otherwise.", "solution": "SELECT customer_id, CASE WHEN segment='Enterprise' THEN 'enterprise' ELSE 'smb_or_consumer' END AS tier FROM customers;"}, {"id": 7, "topic": "Joins", "diff": "medium", "ordered": false, "ask": "For every completed transaction, we need the customer's name next to the product they bought.", "solution": "SELECT c.first_name, p.product_name FROM transactions t JOIN customers c ON t.customer_id=c.customer_id JOIN products p ON t.product_id=p.product_id WHERE t.status='completed';"}, {"id": 8, "topic": "Subqueries", "diff": "medium", "ordered": false, "ask": "Which customers have never made a single transaction?", "solution": "SELECT customer_id, first_name FROM customers WHERE customer_id NOT IN (SELECT customer_id FROM transactions);"}, {"id": 9, "topic": "CTEs", "diff": "medium", "ordered": false, "ask": "Build each customer's total spend as a named step, then show only the customers who spent over 500.", "solution": "WITH spend AS (SELECT customer_id, SUM(amount) AS total FROM transactions GROUP BY customer_id) SELECT customer_id, ROUND(total,2) AS total_amount FROM spend WHERE total > 500;"}, {"id": 10, "topic": "Window basics", "diff": "hard", "ordered": false, "ask": "For every transaction, show what fraction of the grand total revenue that single transaction represents.", "solution": "SELECT transaction_id, amount, ROUND(amount*100.0/SUM(amount) OVER (),2) AS pct_of_total FROM transactions;"}, {"id": 11, "topic": "Ranking and deduplication", "diff": "hard", "ordered": false, "ask": "For each customer, we only want their single most recent transaction, nothing older.", "solution": "WITH r AS (SELECT customer_id, transaction_id, txn_date, amount, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date DESC, transaction_id DESC) AS rn FROM transactions) SELECT customer_id, transaction_id, txn_date, amount FROM r WHERE rn=1;"}, {"id": 12, "topic": "LAG LEAD and period change", "diff": "hard", "ordered": true, "ask": "Show monthly revenue side by side with how much it grew or shrank versus the prior month, as a percentage.", "solution": "WITH m AS (SELECT strftime('%Y-%m', txn_date) AS mth, SUM(amount) AS rev FROM transactions GROUP BY 1) SELECT mth, ROUND((rev - LAG(rev) OVER (ORDER BY mth)) * 100.0 / NULLIF(LAG(rev) OVER (ORDER BY mth),0),2) AS mom_growth_pct FROM m ORDER BY mth;"}, {"id": 13, "topic": "NTILE and quantile segmentation", "diff": "hard", "ordered": false, "ask": "Split our customers into four equal-sized spend tiers, and tell me which tier each customer landed in.", "solution": "WITH s AS (SELECT customer_id, SUM(amount) AS total FROM transactions GROUP BY customer_id) SELECT customer_id, ROUND(total,2) AS total, NTILE(4) OVER (ORDER BY total DESC, customer_id) AS quartile FROM s;"}, {"id": 14, "topic": "Date and time logic", "diff": "medium", "ordered": true, "ask": "Chart total revenue by calendar month, oldest month first.", "solution": "SELECT strftime('%Y-%m', txn_date) AS mth, ROUND(SUM(amount),2) AS revenue FROM transactions GROUP BY 1 ORDER BY 1;"}, {"id": 15, "topic": "Cohort retention", "diff": "hard", "ordered": true, "ask": "Group customers by the month they signed up, and for each group tell me what fraction were still transacting the following month.", "solution": "WITH cohort AS (SELECT customer_id, strftime('%Y-%m', signup_date) AS cm, strftime('%Y-%m', date(signup_date,'start of month','+1 month')) AS next_m FROM customers), act AS (SELECT DISTINCT customer_id, strftime('%Y-%m', txn_date) AS tm FROM transactions) SELECT c.cm AS cohort_month, ROUND(COUNT(DISTINCT a.customer_id)*1.0/COUNT(DISTINCT c.customer_id),2) AS retention_m1 FROM cohort c LEFT JOIN act a ON a.customer_id=c.customer_id AND a.tm=c.next_m GROUP BY c.cm ORDER BY c.cm;"}, {"id": 16, "topic": "Funnel conversion and rate math", "diff": "hard", "ordered": false, "ask": "Out of everyone who signed up, what fraction ever made a first payment? Guard against dividing by zero.", "solution": "SELECT ROUND(COUNT(DISTINCT CASE WHEN event_type='first_payment' THEN customer_id END) * 1.0 / NULLIF(COUNT(DISTINCT CASE WHEN event_type='signup' THEN customer_id END),0),3) AS signup_to_payment_rate FROM events;"}, {"id": 17, "topic": "Cross-product attachment", "diff": "medium", "ordered": false, "ask": "Which customers have transacted in three or more different products?", "solution": "SELECT customer_id, COUNT(DISTINCT product_id) AS product_count FROM transactions GROUP BY customer_id HAVING COUNT(DISTINCT product_id) >= 3;"}, {"id": 18, "topic": "Subtotals with ROLLUP", "diff": "hard", "ordered": false, "ask": "Show revenue by customer segment, and add one extra row underneath with the company-wide grand total.", "solution": "SELECT c.segment AS segment, ROUND(SUM(t.amount),2) AS revenue FROM transactions t JOIN customers c ON t.customer_id=c.customer_id GROUP BY c.segment UNION ALL SELECT 'ALL', ROUND(SUM(amount),2) FROM transactions;"}, {"id": 19, "topic": "Causal setup treatment and control", "diff": "hard", "ordered": false, "ask": "The causal team needs the average transaction size for each experiment group, split into before and after April 1st 2024.", "solution": "SELECT g.exp_group, CASE WHEN t.txn_date < '2024-04-01' THEN 'pre' ELSE 'post' END AS period, ROUND(AVG(t.amount),2) AS avg_amount FROM transactions t JOIN campaign g ON t.customer_id=g.customer_id GROUP BY g.exp_group, period;"}];

let current=0;
const solved=new Set();
const savedQueries={};
let startIndex=0;

function buildSidebar(){
  let html="";
  QUIZ_QUESTIONS.forEach((q,i)=>{
    html+='<button class="qbtn'+(solved.has(q.id)?" done":"")+'" data-i="'+i+'"><span class="dot">'+(solved.has(q.id)?"✓":"")+'</span><span class="lbl">'+(i+1)+'. '+q.topic+'</span></button>';
  });
  return html;
}
function buildMain(){
  return '<main>'
    +'<div class="qhead" id="qhead"></div>'
    +'<div class="ask" id="ask"><span class="albl">Question</span><span class="atext" id="askText"></span></div>'
    +'<div class="editor-wrap"><div class="editor-bar"><span id="editorLabel">query.sql</span><button class="schema-toggle" id="schemaBtn">view schema</button></div><textarea id="sql" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div>'
    +'<div class="actions"><button class="act run" id="runBtn">Run and check</button><button class="act" id="solBtn">Show solution</button><button class="act" id="explainBtn">Explain solution</button><button class="act" id="explainWrongBtn" style="display:none">Explain my error</button><select id="explainModel" class="explain-model"><option value="sonnet">Sonnet 5</option><option value="haiku">Haiku 4.5</option></select><button class="act" id="resetBtn">Clear</button><button class="act" id="prevBtn">&larr; Previous</button><button class="act" id="nextBtn">Next &rarr;</button><span class="kbd">Cmd / Ctrl + Enter &middot; Shift + &larr;/&rarr;</span></div>'
    +'<div class="verdict" id="verdict"><span class="ic" id="vic"></span><span id="vmsg"></span></div>'
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
    if(btn){btn.classList.add("done");btn.querySelector(".dot").textContent="✓";}
    const st=document.getElementById("clearedStamp");if(st)st.classList.add("show");
    updateProgress();
  }
}
function doRun(){
  const q=QUIZ_QUESTIONS[current];const sql=document.getElementById("sql").value.trim();
  const verdict=document.getElementById("verdict"),vic=document.getElementById("vic"),vmsg=document.getElementById("vmsg"),resultsBox=document.getElementById("resultsBox");
  if(!sql)return;
  let userRes;
  try{userRes=runSQL(sql);}catch(err){verdict.className="verdict no";vic.textContent="!";vmsg.textContent="SQL error: "+err.message;resultsBox.style.display="none";setExplainWrongVisible(true);return;}
  resultsBox.style.display="block";
  document.getElementById("tableScroll").innerHTML=renderTable(userRes);
  const n=userRes.values.length;
  document.getElementById("rowCount").textContent=n+" row"+(n===1?"":"s")+" returned"+(n>200?" (showing first 200)":"");
  let solRes;try{solRes=runSQL(q.solution);}catch(e){solRes={columns:[],values:[]};}
  const g=grade(userRes,solRes,q.ordered);
  if(g.ok){verdict.className="verdict ok";vic.textContent="✓";vmsg.textContent=g.msg;markSolved(current);savedQueries[q.id]=sql;}
  else{verdict.className="verdict no";vic.textContent="✗";vmsg.textContent=g.msg;}
  logAttempt(q.id,sql,g.ok);
  setExplainWrongVisible(!g.ok);
}
function renderTable(res){
  if(!res.columns.length) return '<div style="padding:14px;color:var(--muted);font-family:var(--mono);font-size:12.5px">No columns returned.</div>';
  let h='<table><thead><tr>';res.columns.forEach(c=>h+='<th>'+c+'</th>');h+='</tr></thead><tbody>';
  res.values.slice(0,200).forEach(row=>{h+='<tr>';row.forEach(v=>{h+=(v===null||v===undefined)?'<td class="null">NULL</td>':'<td>'+String(v)+'</td>';});h+='</tr>';});
  return h+'</tbody></table>';
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
        supabaseClient.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/quiz"}});
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

const REQUIRED_QUESTION_IDS=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,140,141,142,143,144,145];

function checkUnlocked(){
  return supabaseClient.from("attempts").select("question_id").eq("mode","trainer").eq("track","sql").eq("passed",true).in("question_id",REQUIRED_QUESTION_IDS)
    .then(({data,error})=>{
      if(error||!data) return false;
      const distinct=new Set(data.map(r=>r.question_id));
      return distinct.size>=REQUIRED_QUESTION_IDS.length;
    });
}

function hydrateProgress(){
  return supabaseClient.from("attempts").select("question_id,passed,query_text,created_at").eq("mode","quiz").eq("track","sql").order("created_at",{ascending:true})
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
    const payload={track:"sql",mode:"quiz",questionId:q.id,kind,ask:q.ask,prompt:q.prompt||"",solution:q.solution,model:getExplainModel()};
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
  supabaseClient.from("attempts").insert({question_id:questionId,query_text:queryText,passed,mode:"quiz",track:"sql"}).then(()=>{});
}

function showLocked(){
  document.getElementById("app").className="";
  document.getElementById("app").innerHTML='<div class="loading" style="max-width:520px;margin:40px auto;text-align:center;">'
    +'<h2 style="color:var(--pp-navy);margin:0 0 10px;">Quiz locked</h2>'
    +'<p style="color:var(--muted);font-family:var(--sans);font-size:14px;">Clear all '+REQUIRED_QUESTION_IDS.length+' trainer questions first to unlock the certification quiz.</p>'
    +'<a href="/" style="display:inline-block;margin-top:14px;background:var(--pp-blue);color:#fff;border-radius:99px;padding:10px 20px;text-decoration:none;font-family:var(--sans);font-size:14px;font-weight:600;">Back to Trainer</a>'
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
  initSqlJs({locateFile:f=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/"+f}),
  requireAuth().then(checkUnlocked)
])
.then(([SQL,unlocked])=>{
  db=new SQL.Database();db.run(SCHEMA_SQL);
  if(!unlocked){showLocked();return;}
  return hydrateProgress().then(()=>{
    const app=document.getElementById("app");app.className="";
    app.innerHTML='<div class="wrap"><aside id="sidebar">'+buildSidebar()+'</aside>'+buildMain()+'<div class="right-col" id="rightCol"></div></div>';
    document.getElementById("schema").innerHTML=buildSchema();
    document.getElementById("totalCount").textContent=QUIZ_QUESTIONS.length;
    document.querySelectorAll(".qbtn").forEach(b=>b.addEventListener("click",()=>loadQuestion(+b.dataset.i)));
    document.getElementById("runBtn").addEventListener("click",doRun);
  document.getElementById("explainBtn").addEventListener("click",()=>runExplain("solution"));
  document.getElementById("explainWrongBtn").addEventListener("click",()=>runExplain("attempt"));
  initExplainModelSelect();
  initShellLayout();
    document.getElementById("solBtn").addEventListener("click",()=>document.getElementById("solution").classList.toggle("show"));
    document.getElementById("resetBtn").addEventListener("click",()=>{document.getElementById("sql").value="";document.getElementById("sql").focus();});
    document.getElementById("schemaBtn").addEventListener("click",()=>document.getElementById("schema").scrollIntoView({behavior:"smooth"}));
    document.getElementById("prevBtn").addEventListener("click",()=>goToQuestion(-1));
    document.getElementById("nextBtn").addEventListener("click",()=>goToQuestion(1));
    const ta=document.getElementById("sql");
    ta.addEventListener("keydown",e=>{
      if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();doRun();}
      if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart,en=ta.selectionEnd;ta.value=ta.value.slice(0,s)+"  "+ta.value.slice(en);ta.selectionStart=ta.selectionEnd=s+2;}
    });
    document.addEventListener("keydown",e=>{
      if(!e.shiftKey || document.activeElement===ta) return;
      if(e.key==="ArrowLeft"){e.preventDefault();goToQuestion(-1);}
      if(e.key==="ArrowRight"){e.preventDefault();goToQuestion(1);}
    });
    updateProgress();loadQuestion(Math.min(startIndex,QUIZ_QUESTIONS.length-1));
  });
})
.catch(err=>{document.getElementById("app").innerHTML='<div class="loading">Could not load the SQL engine. Check your connection and reload. ('+err.message+')</div>';});
