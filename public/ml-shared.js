const PYTHON_SETUP_CODE = "import pandas as pd\nimport numpy as np\n\n# Predictions from a repeat-payment propensity model, already scored on a\n# held-out set of 200 customers (not seen during training). repeat_payment is\n# the actual outcome (1 = made a repeat payment within 30 days, 0 = did not);\n# pred_score is the model's predicted probability of that outcome.\npredictions = pd.DataFrame(\n    [(1, 1, 0.3892), (2, 1, 0.3571), (3, 1, 0.6225), (4, 1, 0.8016), (5, 0, 0.3522), (6, 0, 0.4818), (7, 1, 0.71), (8, 1, 0.6333), (9, 0, 0.3637), (10, 1, 0.657), (11, 0, 0.436), (12, 1, 0.2354), (13, 1, 0.3374), (14, 0, 0.194), (15, 0, 0.1533), (16, 0, 0.2523), (17, 0, 0.4044), (18, 1, 0.5553), (19, 0, 0.385), (20, 0, 0.1782), (21, 1, 0.9126), (22, 0, 0.6229), (23, 1, 0.4484), (24, 0, 0.2518), (25, 0, 0.4081), (26, 1, 0.6559), (27, 0, 0.1439), (28, 0, 0.6385), (29, 0, 0.4449), (30, 1, 0.2106), (31, 0, 0.207), (32, 1, 0.6643), (33, 0, 0.426), (34, 0, 0.2997), (35, 1, 0.8059), (36, 0, 0.2085), (37, 0, 0.7054), (38, 0, 0.0573), (39, 0, 0.0887), (40, 1, 0.5048), (41, 1, 0.6858), (42, 1, 0.5013), (43, 1, 0.2143), (44, 1, 0.3786), (45, 0, 0.0927), (46, 0, 0.3693), (47, 0, 0.3948), (48, 1, 0.6076), (49, 1, 0.4842), (50, 0, 0.08), (51, 0, 0.5356), (52, 1, 0.4856), (53, 1, 0.2109), (54, 1, 0.6712), (55, 1, 0.6493), (56, 1, 0.595), (57, 0, 0.2606), (58, 0, 0.2735), (59, 1, 0.4761), (60, 1, 0.5564), (61, 0, 0.5874), (62, 0, 0.4212), (63, 0, 0.1671), (64, 0, 0.2246), (65, 1, 0.6471), (66, 1, 0.7495), (67, 1, 0.5213), (68, 1, 0.7742), (69, 1, 0.4866), (70, 0, 0.2529), (71, 1, 0.5185), (72, 1, 0.559), (73, 1, 0.2802), (74, 1, 0.8907), (75, 0, 0.1249), (76, 1, 0.6335), (77, 1, 0.5561), (78, 0, 0.4272), (79, 1, 0.8148), (80, 0, 0.1711), (81, 0, 0.3933), (82, 1, 0.4327), (83, 1, 0.6282), (84, 0, 0.362), (85, 1, 0.2081), (86, 0, 0.2038), (87, 1, 0.6088), (88, 1, 0.4105), (89, 0, 0.5409), (90, 1, 0.6908), (91, 0, 0.4858), (92, 1, 0.8262), (93, 0, 0.3072), (94, 1, 0.2873), (95, 0, 0.5546), (96, 0, 0.2068), (97, 1, 0.4079), (98, 1, 0.504), (99, 1, 0.3583), (100, 1, 0.2543), (101, 0, 0.2493), (102, 0, 0.5949), (103, 1, 0.2329), (104, 0, 0.3383), (105, 0, 0.346), (106, 1, 0.5026), (107, 1, 0.8085), (108, 0, 0.3995), (109, 1, 0.5329), (110, 0, 0.3453), (111, 0, 0.1264), (112, 1, 0.4498), (113, 1, 0.4479), (114, 1, 0.8652), (115, 1, 0.3473), (116, 1, 0.6293), (117, 1, 0.5164), (118, 0, 0.1409), (119, 1, 0.7393), (120, 1, 0.7266), (121, 1, 0.4517), (122, 0, 0.3127), (123, 1, 0.7153), (124, 0, 0.2198), (125, 0, 0.5138), (126, 1, 0.7573), (127, 0, 0.1241), (128, 0, 0.3335), (129, 1, 0.5199), (130, 0, 0.2487), (131, 0, 0.2008), (132, 0, 0.2866), (133, 0, 0.2235), (134, 1, 0.43), (135, 0, 0.1986), (136, 1, 0.8059), (137, 0, 0.2037), (138, 0, 0.3398), (139, 1, 0.7625), (140, 0, 0.1585), (141, 0, 0.6214), (142, 1, 0.6439), (143, 0, 0.1835), (144, 0, 0.6804), (145, 0, 0.2449), (146, 1, 0.5581), (147, 0, 0.25), (148, 0, 0.1719), (149, 1, 0.6359), (150, 1, 0.4613), (151, 1, 0.5359), (152, 1, 0.5296), (153, 0, 0.4388), (154, 1, 0.5522), (155, 1, 0.5773), (156, 0, 0.2553), (157, 1, 0.8134), (158, 1, 0.5269), (159, 0, 0.2416), (160, 1, 0.5735), (161, 0, 0.2729), (162, 1, 0.8422), (163, 1, 0.8091), (164, 0, 0.2435), (165, 1, 0.8044), (166, 1, 0.5147), (167, 1, 0.4141), (168, 1, 0.776), (169, 0, 0.209), (170, 0, 0.2536), (171, 0, 0.263), (172, 0, 0.4681), (173, 1, 0.4841), (174, 1, 0.5204), (175, 1, 0.6321), (176, 1, 0.3945), (177, 1, 0.4952), (178, 1, 0.8441), (179, 1, 0.2398), (180, 1, 0.9586), (181, 1, 0.6559), (182, 0, 0.2289), (183, 0, 0.2881), (184, 1, 0.8127), (185, 0, 0.4298), (186, 1, 0.6655), (187, 1, 0.5234), (188, 1, 0.3435), (189, 0, 0.3586), (190, 0, 0.1098), (191, 0, 0.3634), (192, 1, 0.6148), (193, 0, 0.5753), (194, 0, 0.2264), (195, 1, 0.6323), (196, 1, 0.4951), (197, 0, 0.2371), (198, 1, 0.3809), (199, 0, 0.4222), (200, 0, 0.2489)],\n    columns=['customer_id', 'repeat_payment', 'pred_score']\n)\n";

const PY_HARNESS_CODE = "import pandas as pd\nimport numpy as np\nimport json\nimport io\nimport contextlib\nimport ast\n\n\ndef __to_table(obj):\n    if isinstance(obj, pd.DataFrame):\n        cols = [str(c) for c in obj.columns]\n        vals = obj.values.tolist()\n    elif isinstance(obj, pd.Series):\n        if isinstance(obj.index, pd.RangeIndex):\n            cols = [obj.name or \"value\"]\n            vals = [[v] for v in obj.values.tolist()]\n        else:\n            idx_name = obj.index.name or \"index\"\n            cols = [idx_name, obj.name or \"value\"]\n            vals = [[i, v] for i, v in zip(obj.index.tolist(), obj.values.tolist())]\n    elif isinstance(obj, dict):\n        cols = [\"key\", \"value\"]\n        vals = [[k, v] for k, v in obj.items()]\n    elif isinstance(obj, (list, tuple)):\n        cols = [\"value\"]\n        vals = [[v] for v in obj]\n    else:\n        cols = [\"value\"]\n        vals = [[obj]]\n    return cols, vals\n\n\ndef __json_safe(v):\n    if v is None:\n        return None\n    try:\n        if pd.isna(v):\n            return None\n    except (TypeError, ValueError):\n        pass\n    if isinstance(v, (np.integer,)):\n        return int(v)\n    if isinstance(v, (np.floating,)):\n        return float(v)\n    if isinstance(v, (np.bool_,)):\n        return bool(v)\n    if isinstance(v, (pd.Timestamp,)):\n        return str(v)\n    if isinstance(v, (float, int, str, bool)):\n        return v\n    return str(v)\n\n\ndef __norm_cell(v):\n    if v is None:\n        return \"\u2205NULL\"\n    try:\n        if pd.isna(v):\n            return \"\u2205NULL\"\n    except (TypeError, ValueError):\n        pass\n    if isinstance(v, (float, np.floating)):\n        return \"{:.2f}\".format(round(float(v), 2))\n    if isinstance(v, (int, np.integer)):\n        return str(int(v))\n    return str(v).strip()\n\n\ndef __rows_key(vals, ordered):\n    rows = [json.dumps([__norm_cell(c) for c in row]) for row in vals]\n    if not ordered:\n        rows = sorted(rows)\n    return rows\n\n\ndef __short_repr(v):\n    try:\n        if isinstance(v, pd.DataFrame):\n            return \"DataFrame: {} rows x {} cols {}\".format(v.shape[0], v.shape[1], list(v.columns)[:8])\n        if isinstance(v, pd.Series):\n            head = v.head(5).to_dict()\n            return \"Series ({} values), first 5: {}\".format(len(v), head)\n        s = repr(v)\n        return s if len(s) <= 300 else s[:300] + \"...\"\n    except Exception:\n        return \"<unrepresentable>\"\n\n\n__SENTINEL__ = object()\n\n\ndef __run_capture(code):\n    ns = {}\n    for k, v in __BASE_NS__.items():\n        if isinstance(v, (pd.DataFrame, pd.Series)):\n            ns[k] = v.copy()\n        else:\n            ns[k] = v\n    buf = io.StringIO()\n    try:\n        tree = ast.parse(code, mode=\"exec\")\n        last_expr_node = None\n        if tree.body and isinstance(tree.body[-1], ast.Expr):\n            last_expr_node = tree.body.pop()\n        exec_code = compile(tree, \"<user_code>\", \"exec\")\n        last_expr_value = __SENTINEL__\n        with contextlib.redirect_stdout(buf):\n            exec(exec_code, ns)\n            if last_expr_node is not None:\n                eval_code = compile(ast.Expression(last_expr_node.value), \"<user_code_last_expr>\", \"eval\")\n                last_expr_value = eval(eval_code, ns)\n    except Exception as e:\n        return {\"error\": \"{}: {}\".format(type(e).__name__, e), \"stdout\": buf.getvalue()}\n\n    if \"result\" in ns:\n        return {\"ok\": True, \"result\": ns[\"result\"], \"source\": \"result\", \"stdout\": buf.getvalue(), \"ns\": ns}\n    if last_expr_value is not __SENTINEL__ and last_expr_value is not None:\n        return {\"ok\": True, \"result\": last_expr_value, \"source\": \"last_expression\", \"stdout\": buf.getvalue(), \"ns\": ns}\n    return {\"ok\": False, \"no_result\": True, \"stdout\": buf.getvalue(), \"ns\": ns}\n\n\ndef __grade_python(user_code, solution_code, ordered):\n    user_run = __run_capture(user_code)\n    if \"error\" in user_run:\n        return json.dumps({\"error\": user_run[\"error\"], \"stdout\": user_run[\"stdout\"]})\n\n    if user_run.get(\"no_result\"):\n        ns = user_run[\"ns\"]\n        vars_preview = []\n        for k, v in ns.items():\n            if k in __BASE_NS__ or k.startswith(\"__\"):\n                continue\n            vars_preview.append({\"name\": k, \"type\": type(v).__name__, \"preview\": __short_repr(v)})\n        return json.dumps({\n            \"ok\": False,\n            \"no_result\": True,\n            \"msg\": \"No variable named `result` yet (and the last line wasn't a plain expression either), so nothing to check. Here's what your code produced:\",\n            \"stdout\": user_run[\"stdout\"],\n            \"vars\": vars_preview[:12],\n        })\n\n    user_result = user_run[\"result\"]\n\n    sol_run = __run_capture(solution_code)\n    sol_result = sol_run[\"result\"]\n\n    u_cols, u_vals = __to_table(user_result)\n    s_cols, s_vals = __to_table(sol_result)\n\n    ok = True\n    msg = \"Result matches the expected output.\"\n    if len(u_cols) != len(s_cols):\n        ok = False\n        msg = \"Expected {} column(s), your result has {}.\".format(len(s_cols), len(u_cols))\n    elif len(u_vals) != len(s_vals):\n        ok = False\n        msg = \"Expected {} row(s), your result has {}.\".format(len(s_vals), len(u_vals))\n    else:\n        a = __rows_key(u_vals, ordered)\n        b = __rows_key(s_vals, ordered)\n        for x, y in zip(a, b):\n            if x != y:\n                ok = False\n                msg = (\"Right count, but order or values differ. Check your sort order and values.\"\n                       if ordered else\n                       \"Right shape, but some values do not match. Compare against the solution.\")\n                break\n\n    display_vals = [[__json_safe(c) for c in row] for row in u_vals[:200]]\n    return json.dumps({\n        \"ok\": ok,\n        \"msg\": msg,\n        \"columns\": u_cols,\n        \"values\": display_vals,\n        \"rowcount\": len(u_vals),\n        \"stdout\": user_run[\"stdout\"],\n        \"source\": user_run.get(\"source\", \"result\"),\n    })\n"


let pyodideInstance = null;
let pyodideReadyPromise = null;

function initPyodideEnv(){
  if(pyodideReadyPromise) return pyodideReadyPromise;
  pyodideReadyPromise = loadPyodide()
    .then(py=>{
      pyodideInstance=py;
      return py.loadPackage(["pandas","numpy","scipy"]);
    })
    .then(()=>pyodideInstance.runPythonAsync(PYTHON_SETUP_CODE))
    .then(()=>pyodideInstance.runPythonAsync(
      "__BASE_NS__ = {k:v for k,v in dict(globals()).items() if k in ('predictions','pd','np')}\n"
    ))
    .then(()=>pyodideInstance.runPythonAsync(PY_HARNESS_CODE))
    .then(()=>pyodideInstance);
  return pyodideReadyPromise;
}

function runAndGrade(userCode, solutionCode, ordered){
  pyodideInstance.globals.set("__user_code__", userCode);
  pyodideInstance.globals.set("__solution_code__", solutionCode);
  pyodideInstance.globals.set("__ordered__", !!ordered);
  return pyodideInstance.runPythonAsync("__grade_python(__user_code__, __solution_code__, __ordered__)")
    .then(jsonStr=>JSON.parse(jsonStr));
}

function renderPyTable(res){
  if(!res.columns || !res.columns.length) return '<div style="padding:14px;color:var(--muted);font-family:var(--mono);font-size:12.5px">No columns returned.</div>';
  let h='<table><thead><tr>';res.columns.forEach(c=>h+='<th>'+c+'</th>');h+='</tr></thead><tbody>';
  res.values.slice(0,200).forEach(row=>{h+='<tr>';row.forEach(v=>{h+=(v===null||v===undefined)?'<td class="null">NULL</td>':'<td>'+String(v)+'</td>';});h+='</tr>';});
  return h+'</tbody></table>';
}

const PY_SCHEMA_VIEW=[
 {name:"predictions",cols:[["customer_id","int64"],["repeat_payment","int64"],["pred_score","float64"]]},
];

function buildPySchema(){
  let html='<h3>Available DataFrame</h3><p class="note">Predictions from a repeat-payment propensity model, scored on a held-out set of 200 customers. repeat_payment is the actual outcome (1 = made a repeat payment within 30 days). pred_score is the model\'s predicted probability. Assign your answer to a variable named result.</p><div class="tables">';
  PY_SCHEMA_VIEW.forEach(t=>{html+='<div class="tbl"><div class="name">'+t.name+'</div><ul>';t.cols.forEach(c=>{html+='<li><b>'+c[0]+'</b><span class="ty">'+c[1]+'</span></li>';});html+='</ul></div>';});
  return html+'</div>';
}

function getEffectiveTheme(){
  const saved=localStorage.getItem("theme");
  if(saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyThemeIcon(){
  const btn=document.getElementById("themeToggle");
  if(!btn) return;
  btn.textContent = getEffectiveTheme()==="dark" ? "☀️" : "🌙";
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
const __sidebarFilterState={diff:new Set(),time:new Set(),star:false};
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
  const anyActive=__sidebarFilterState.diff.size||__sidebarFilterState.time.size||__sidebarFilterState.star;
  const clearBtn=document.getElementById("filterClearBtn");
  if(clearBtn) clearBtn.style.display=anyActive?"":"none";
}
function initSidebarFilters(){
  const bar=document.getElementById("sidebarFilters");
  if(!bar) return;
  bar.addEventListener("click",e=>{
    const clearBtn=e.target.closest("#filterClearBtn");
    if(clearBtn){
      __sidebarFilterState.diff.clear();__sidebarFilterState.time.clear();__sidebarFilterState.star=false;
      bar.querySelectorAll(".fchip").forEach(c=>c.classList.remove("active"));
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
