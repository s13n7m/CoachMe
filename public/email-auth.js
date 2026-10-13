// Email + password sign-in, added to the auth gate under the Google button.
// One "Continue with email" flow: sign in, and if the account doesn't exist yet, create it.
// On success the session is persisted by supabase-js, so we reload and each trainer's
// requireAuth() picks it up via getSession().
(function(){
  const googleBtn=document.getElementById("googleSignInBtn");
  if(!googleBtn||!window.supabase||!window.__SUPABASE_URL__)return;
  const client=window.supabase.createClient(window.__SUPABASE_URL__,window.__SUPABASE_ANON_KEY__);

  const input="width:100%;box-sizing:border-box;padding:9px 12px;margin-bottom:8px;border:1px solid #d4dfec;border-radius:8px;font-size:14px;color:#0b2b52;background:#fff;";
  const form=document.createElement("form");
  form.id="emailAuthForm";
  form.style.cssText="margin-top:16px;padding-top:16px;border-top:1px solid #d4dfec;text-align:left;";
  form.innerHTML=
    '<div style="text-align:center;margin-bottom:10px;color:#54708e;font-size:12.5px;">or use an email address</div>'+
    '<input id="emailAuthEmail" type="email" placeholder="you@example.com" autocomplete="username" required style="'+input+'">'+
    '<input id="emailAuthPassword" type="password" placeholder="Password (6+ characters)" autocomplete="current-password" minlength="6" required style="'+input+'">'+
    '<button id="emailAuthSubmit" type="submit" style="width:100%;background:#003087;color:#fff;border:none;border-radius:99px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer;touch-action:manipulation;">Continue with email</button>'+
    '<div id="emailAuthMsg" role="alert" style="min-height:18px;margin-top:8px;font-size:12.5px;color:#c43d2c;text-align:center;"></div>';
  googleBtn.insertAdjacentElement("afterend",form);

  const msg=document.getElementById("emailAuthMsg");
  const submit=document.getElementById("emailAuthSubmit");

  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const email=document.getElementById("emailAuthEmail").value.trim();
    const password=document.getElementById("emailAuthPassword").value;
    msg.textContent="";
    submit.disabled=true;
    try{
      let res=await client.auth.signInWithPassword({email,password});
      if(res.error&&/invalid login credentials/i.test(res.error.message)){
        const up=await client.auth.signUp({email,password});
        if(up.error){
          msg.textContent=/already registered/i.test(up.error.message)?"Wrong password for this email.":up.error.message;
          return;
        }
        if(!up.data.session){
          // Supabase "Confirm email" is still on, so no session is issued until the emailed link is clicked.
          msg.style.color="#54708e";
          msg.textContent="Account created. Check your inbox to confirm it, then sign in.";
          return;
        }
        res=up;
      }else if(res.error){
        msg.textContent=res.error.message;
        return;
      }
      window.location.reload();
    }catch(err){
      msg.textContent="Something went wrong. Please try again.";
    }finally{
      submit.disabled=false;
    }
  });
})();
