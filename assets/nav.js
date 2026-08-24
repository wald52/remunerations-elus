// nav hamburger + dark mode
(function(){
  // hamburger
  document.addEventListener('DOMContentLoaded', ()=>{
    const header = document.querySelector('header .nav');
    if(header && !document.getElementById('navToggle')){
      const brand = header.querySelector('.brand');
      const nav = header.querySelector('.navlinks');
      const btn = document.createElement('button');
      btn.id='navToggle'; btn.className='navToggle'; btn.setAttribute('aria-label','Menu'); btn.innerHTML='☰';
      brand.after(btn);
      btn.addEventListener('click', ()=> nav.classList.toggle('open'));
      // dark toggle
      const darkBtn = document.createElement('button');
      darkBtn.id='darkToggle'; darkBtn.className='darkToggle'; darkBtn.title='Mode sombre';
      const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      applyTheme(saved);
      darkBtn.textContent = saved==='dark' ? '☀️' : '🌙';
      darkBtn.addEventListener('click', ()=>{
        const cur = document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
        applyTheme(cur); localStorage.setItem('theme', cur);
        darkBtn.textContent = cur==='dark' ? '☀️' : '🌙';
      });
      // place dark toggle next to hamburger or in nav
      header.appendChild(darkBtn);
      // on mobile, move dark toggle inside nav when open? keep simple
    }
    function applyTheme(t){
      if(t==='dark') document.documentElement.setAttribute('data-theme','dark');
      else document.documentElement.removeAttribute('data-theme');
    }
    // signal error button handler (delegated)
    document.addEventListener('click', (e)=>{
      const a = e.target.closest('[data-issue]');
      if(a){
        const title = encodeURIComponent(a.dataset.issue || 'Signalement');
        const body = encodeURIComponent(`URL: ${location.href}\n\nDescription:\n`);
        window.open(`https://github.com/wald52/remunerations-elus/issues/new?title=${title}&body=${body}`, '_blank');
      }
    });
  });
})();
