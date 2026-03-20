const KEYS = {
  SESSION:'mdp_session', CAIXA:'mdp_caixa', CONGREGACOES:'mdp_congregacoes',
  MULHERES:'mdp_mulheres', UNIFORME_FEST:'mdp_uniforme_fest',
  UNIFORME_PAN:'mdp_uniforme_pan', VENDAS:'mdp_vendas',
  THEME:'mdp_theme', ADMINS:'mdp_admins', LOGS:'mdp_logs',
};

const THEME = {
  get() { return localStorage.getItem(KEYS.THEME) || 'light'; },
  set(t) { localStorage.setItem(KEYS.THEME, t); document.documentElement.setAttribute('data-theme', t); },
  toggle() { this.set(this.get()==='dark'?'light':'dark'); this._sync(); },
  init() { this.set(this.get()); },
  _sync() {
    const dark = this.get()==='dark';
    document.querySelectorAll('.toggle-switch').forEach(el=>el.classList.toggle('on',dark));
    document.querySelectorAll('[data-icon="theme"]').forEach(el=>{ el.innerHTML=dark?ico('moon',14):ico('sun',14); });
    document.querySelectorAll('.theme-txt').forEach(el=>{ el.textContent=dark?'Modo Escuro':'Modo Claro'; });
  }
};

const AUTH = {
  check() {
    const s = localStorage.getItem(KEYS.SESSION);
    if (!s) return false;
    if (s === 'ok') { localStorage.removeItem(KEYS.SESSION); return false; } // clear old session
    return true;
  },
  getCurrentUser() {
    try {
      const s = localStorage.getItem(KEYS.SESSION);
      if (!s || s === 'ok') return null;
      return JSON.parse(s);
    } catch(e) { return null; }
  },
  login(username, pass) {
    const admins = DB.get(KEYS.ADMINS);
    const found = admins.find(a=>a.username===username && a.password===pass && a.ativo!==false);
    if (found) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify({id:found.id,nome:found.nome,username:found.username,role:found.role||'admin',mustChangePass:!!found.mustChangePass}));
      LOG.add('login','Sessão iniciada','Sistema',found.nome);
      return true;
    }
    return false;
  },
  logout() {
    const u = this.getCurrentUser();
    if (u) LOG.add('logout','Sessão encerrada','Sistema',u.nome);
    localStorage.removeItem(KEYS.SESSION);
    window.location.href='index.html';
  },
  require() { if(!this.check()) window.location.href='index.html'; },
  isSuperAdmin() { const u=this.getCurrentUser(); return u&&u.username==='rayssa'; }
};

const DB = {
  get(k) { try{return JSON.parse(localStorage.getItem(k))||[];}catch{return[];} },
  set(k,d) { localStorage.setItem(k,JSON.stringify(d)); },
  genId() { return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
};

const LOG = {
  add(action, msg, module, userName) {
    const u = AUTH.getCurrentUser();
    const entry = {
      id: DB.genId(), action, msg,
      module: module||'Sistema',
      userName: userName||(u?u.nome:'Sistema'),
      userLogin: u?u.username:'—',
      ts: new Date().toISOString(),
    };
    const logs = DB.get(KEYS.LOGS);
    logs.unshift(entry);
    if(logs.length>500) logs.splice(500);
    DB.set(KEYS.LOGS, logs);
  }
};

function formatMoney(v) {
  v=parseFloat(v)||0;
  return 'R$ '+v.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}
function formatDate(d) { if(!d)return'-'; const p=d.split('-'); return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:d; }
function formatDateTime(iso) {
  if(!iso)return'-';
  const d=new Date(iso);
  return d.toLocaleDateString('pt-BR')+' '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}
function today() { return new Date().toISOString().split('T')[0]; }
function getStatus(total,pago) {
  total=parseFloat(total)||0; pago=parseFloat(pago)||0;
  if(pago<=0)return'nao_pago'; if(pago>=total)return'pago'; return'parcial';
}
function statusBadge(s) {
  const m={
    pago:`<span class="badge badge-success">${ico('check',9)} Pago</span>`,
    parcial:`<span class="badge badge-warning">${ico('clock',9)} Parcial</span>`,
    nao_pago:`<span class="badge badge-danger">${ico('x',9)} Pendente</span>`,
  };
  return m[s]||m.nao_pago;
}
function openModal(id){document.getElementById(id)?.classList.add('open');}
function closeModal(id){document.getElementById(id)?.classList.remove('open');}
function confirm2(msg){return window.confirm(msg);}
function setActiveNav(){
  const page=window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
}
function seedIfEmpty(){
  if(DB.get(KEYS.CONGREGACOES).length===0){
    DB.set(KEYS.CONGREGACOES,[
      {id:DB.genId(),nome:'Sede',cidade:'Goiânia',ativa:true},
      {id:DB.genId(),nome:'Bela Vista',cidade:'Goiânia',ativa:true},
      {id:DB.genId(),nome:'Jardim América',cidade:'Aparecida de Goiânia',ativa:true},
    ]);
  }
  if(DB.get(KEYS.ADMINS).length===0){
    DB.set(KEYS.ADMINS,[{
      id:DB.genId(),nome:'Rayssa',username:'rayssa',password:'123456',
      role:'superadmin',ativo:true,criadoEm:new Date().toISOString()
    }]);
  }
}

// ── ICONS ──
const ICONS = {
  'layout-dashboard':'<polyline points="3 9 12 2 21 9"/><rect x="3" y="9" width="7" height="13"/><rect x="14" y="9" width="7" height="13"/>',
  'wallet':'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="16" cy="15" r="1"/>',
  'shirt':'<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>',
  'music':'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  'shopping-cart':'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  'church':'<path d="M12 2L3 9v13h6v-5h6v5h6V9z"/><path d="M12 2v5"/><path d="M9.5 4.5h5"/>',
  'users':'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'bar-chart':'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  'log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  'sun':'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  'moon':'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  'check':'<polyline points="20 6 9 17 4 12"/>',
  'check-circle':'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'x':'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'x-circle':'<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  'clock':'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'alert-triangle':'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'save':'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  'plus':'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  'edit':'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  'trash':'<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>',
  'printer':'<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  'eye':'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off':'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
  'user':'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'user-plus':'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
  'lock':'<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  'trending-up':'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  'trending-down':'<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
  'credit-card':'<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  'dollar-sign':'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  'award':'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
  'file-text':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  'refresh':'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  'activity':'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  'shield':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'settings':'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  'key':'<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
  'slash':'<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>',
};

function ico(name,size=16){
  const d=ICONS[name]||'<circle cx="12" cy="12" r="10"/>';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

function renderSidebar(){
  const dark=THEME.get()==='dark';
  const u=AUTH.getCurrentUser()||{nome:'Admin',username:'admin'};
  const isSA=AUTH.isSuperAdmin();
  const initials=u.nome.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  // Inject mobile overlay + btn into body (outside app-layout)
  if(!document.getElementById('sidebar-overlay')){
    const overlay=document.createElement('div');
    overlay.className='sidebar-overlay'; overlay.id='sidebar-overlay';
    overlay.onclick=closeMobileMenu;
    document.body.appendChild(overlay);
    const btn=document.createElement('button');
    btn.className='mobile-menu-btn'; btn.setAttribute('aria-label','Menu');
    btn.onclick=toggleMobileMenu;
    btn.innerHTML='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    document.body.appendChild(btn);
  }
  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <img src="img/logo.png" alt="Logo Mensageiros da Paz" class="sidebar-logo-img">
      <div class="sidebar-logo-text">
        <h1>Mensageiros da Paz</h1>
        <span>Tesouraria — MDP</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Principal</div>
      <a class="nav-item" data-page="dashboard.html" href="dashboard.html">${ico('layout-dashboard',16)} <span>Dashboard</span></a>
      <a class="nav-item" data-page="caixa.html" href="caixa.html">${ico('wallet',16)} <span>Caixa</span></a>
      <div class="nav-section-label">Uniformes</div>
      <a class="nav-item" data-page="uniforme-festividade.html" href="uniforme-festividade.html">${ico('shirt',16)} <span>Festividade</span></a>
      <a class="nav-item" data-page="uniforme-pandeiro.html" href="uniforme-pandeiro.html">${ico('music',16)} <span>Pandeiro</span></a>
      <div class="nav-section-label">Gestão</div>
      <a class="nav-item" data-page="vendas.html" href="vendas.html">${ico('shopping-cart',16)} <span>Vendas</span></a>
      <a class="nav-item" data-page="congregacoes.html" href="congregacoes.html">${ico('church',16)} <span>Congregações</span></a>
      <a class="nav-item" data-page="jovens.html" href="jovens.html">${ico('users',16)} <span>Jovens</span></a>
      <div class="nav-section-label">Análise</div>
      <a class="nav-item" data-page="relatorios.html" href="relatorios.html">${ico('bar-chart',16)} <span>Relatórios</span></a>
      <a class="nav-item" data-page="logs.html" href="logs.html">${ico('activity',16)} <span>Logs do Sistema</span></a>
      ${isSA?`<div class="nav-section-label">Administração</div>
      <a class="nav-item" data-page="administradores.html" href="administradores.html">${ico('shield',16)} <span>Administradores</span></a>`:''}
    </nav>
    <div class="sidebar-footer">
      <div class="theme-toggle" onclick="THEME.toggle()">
        <div class="theme-label">
          <span data-icon="theme">${dark?ico('moon',14):ico('sun',14)}</span>
          <span class="theme-txt">${dark?'Modo Escuro':'Modo Claro'}</span>
        </div>
        <div class="toggle-switch ${dark?'on':''}"></div>
      </div>
      <div class="user-pill">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <div class="user-name">${u.nome}</div>
          <div class="user-role">${u.role==='superadmin'?'Super Admin':'Administrador'}</div>
        </div>
        <button class="btn-logout" onclick="AUTH.logout()" title="Sair">${ico('log-out',15)}</button>
      </div>
    </div>
  </aside>
  <div id="toast-container"></div>`;
}

function toast(msg,type='success'){
  const c=document.getElementById('toast-container')||(()=>{const e=document.createElement('div');e.id='toast-container';document.body.appendChild(e);return e;})();
  const icons={success:'check-circle',error:'x-circle',warning:'alert-triangle'};
  const t=document.createElement('div'); t.className=`toast ${type}`;
  t.innerHTML=`${ico(icons[type]||'check-circle')}<span>${msg}</span>`;
  c.appendChild(t); setTimeout(()=>t.remove(),3500);
}

function toggleMobileMenu(){
  const sb=document.getElementById('sidebar');
  const ov=document.getElementById('sidebar-overlay');
  if(!sb)return;
  const open=sb.classList.toggle('open');
  if(ov)ov.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
function closeMobileMenu(){
  const sb=document.getElementById('sidebar');
  const ov=document.getElementById('sidebar-overlay');
  if(sb)sb.classList.remove('open');
  if(ov)ov.classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('click',e=>{
  const item=e.target.closest('.nav-item');
  if(item)closeMobileMenu();
});

const _t=THEME.toggle.bind(THEME);
THEME.toggle=function(){
  _t();
  document.querySelectorAll('[data-icon="theme"]').forEach(el=>{
    el.innerHTML=this.get()==='dark'?ico('moon',14):ico('sun',14);
  });
  document.querySelectorAll('.theme-txt').forEach(el=>{
    el.textContent=this.get()==='dark'?'Modo Escuro':'Modo Claro';
  });
  document.querySelectorAll('.toggle-switch').forEach(el=>el.classList.toggle('on',this.get()==='dark'));
};
