// Account icon dropdown in the header (markup in app/header-markup.js).
// Handles open/close and keyboard navigation only. Each trainer's showAccountMenu()
// reveals the icon once signed in and wires the Sign Out item to Supabase.
(function(){
  const wrap=document.getElementById("accountMenu");
  const btn=document.getElementById("accountBtn");
  const menu=document.getElementById("accountDropdown");
  if(!wrap||!btn||!menu)return;
  const items=()=>Array.from(menu.querySelectorAll('[role="menuitem"]'));

  function isOpen(){return !menu.hidden;}
  function open(focusIndex){
    menu.hidden=false;
    // The menu hangs off the icon's right edge. On narrow screens the header actions
    // wrap to the left side, so flip it to hang off the left edge when it would overflow.
    menu.classList.remove("align-left");
    if(menu.getBoundingClientRect().left<8)menu.classList.add("align-left");
    btn.setAttribute("aria-expanded","true");
    wrap.classList.add("open");
    if(focusIndex!==undefined){
      const list=items();
      const i=focusIndex<0?list.length-1:focusIndex;
      if(list[i])list[i].focus();
    }
  }
  function close(returnFocus){
    if(!isOpen())return;
    menu.hidden=true;
    btn.setAttribute("aria-expanded","false");
    wrap.classList.remove("open");
    if(returnFocus)btn.focus();
  }

  btn.addEventListener("click",()=>{isOpen()?close(false):open(0);});
  btn.addEventListener("keydown",e=>{
    if(e.key==="ArrowDown"){e.preventDefault();open(0);}
    else if(e.key==="ArrowUp"){e.preventDefault();open(-1);}
  });

  menu.addEventListener("keydown",e=>{
    const list=items();
    const i=list.indexOf(document.activeElement);
    let next=null;
    if(e.key==="ArrowDown")next=(i+1)%list.length;
    else if(e.key==="ArrowUp")next=(i-1+list.length)%list.length;
    else if(e.key==="Home")next=0;
    else if(e.key==="End")next=list.length-1;
    else if(e.key==="Escape"){e.preventDefault();close(true);return;}
    else if(e.key==="Tab"){close(false);return;}
    if(next!==null){e.preventDefault();list[next].focus();}
  });

  // Any item closes the menu. Sign Out's own handler (from the trainer) still runs;
  // the other items are placeholders until their screens are built.
  menu.addEventListener("click",e=>{
    if(e.target.closest('[role="menuitem"]'))close(false);
  });

  document.addEventListener("pointerdown",e=>{
    if(isOpen()&&!wrap.contains(e.target))close(false);
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&isOpen())close(true);
  });
  // The header actions are hidden once the page scrolls (body.scrolled), so don't leave
  // the menu open behind them. Checked on the next frame, after the trainer's own
  // scroll handler has updated the class.
  window.addEventListener("scroll",()=>{
    if(!isOpen())return;
    requestAnimationFrame(()=>{
      if(document.body.classList.contains("scrolled"))close(false);
    });
  },{passive:true});
})();
