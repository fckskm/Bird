// Общий скрипт: работа с корзиной, счётчик, утилиты
const CART_KEY = 'bird_cart';
const THEME_KEY = 'bird_theme';

function readCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); updateCartCount(); }

function updateCartCount(){
  const count = readCart().reduce((s,i)=>s + (i.qty||0), 0);
  const el = document.getElementById('cartCount');
  if(el) el.textContent = String(count);
}

function addToCart(product){
  const items = readCart();
  const idx = items.findIndex(i => i.id === product.id);
  if(idx >= 0){ items[idx].qty += product.qty || 1; }
  else { items.push({ id: product.id, name: product.name, price: product.price, qty: product.qty || 1 }); }
  writeCart(items);
}

function removeFromCart(id){
  const items = readCart().filter(i => i.id !== id);
  writeCart(items);
}
function setQty(id, qty){
  const items = readCart().map(i => i.id === id ? {...i, qty: Math.max(1, qty)} : i);
  writeCart(items);
}
function changeQty(id, delta){
  const items = readCart().map(i => i.id === id ? {...i, qty: Math.max(1, (i.qty||1)+delta)} : i);
  writeCart(items);
}
function cartTotal(){
  return readCart().reduce((s,i)=> s + i.price * i.qty, 0);
}

function applyTheme(theme){
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if(btn){
    btn.setAttribute('aria-pressed', theme === 'dark');
    const title = theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';
    btn.title = title;
    btn.setAttribute('aria-label', title);
  }
}

function initThemeToggle(){
  const prefers = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const saved = localStorage.getItem(THEME_KEY);
  const initial = saved || (prefers && prefers.matches ? 'dark' : 'light');
  applyTheme(initial);

  const btn = document.getElementById('themeToggle');
  if(btn){
    btn.addEventListener('click', ()=>{
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  if(prefers){
    prefers.addEventListener('change', (event)=>{
      if(!localStorage.getItem(THEME_KEY)){
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }
}

function initScrollTop(){
  const btn = document.getElementById('scrollTopBtn');
  if(!btn) return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggleBtn = ()=>{
    if(window.scrollY > 280){ btn.classList.add('is-visible'); }
    else { btn.classList.remove('is-visible'); }
  };

  btn.addEventListener('click', ()=>{
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', toggleBtn, { passive: true });
  toggleBtn();
}
function initMobileMenu(){
  const burger = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');
  const overlay = document.getElementById('menuOverlay');
  if(!burger || !nav) return;

  const setMenu = (open)=>{
    document.documentElement.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть навигацию' : 'Открыть навигацию');
  };

  const toggleMenu = ()=> setMenu(!document.documentElement.classList.contains('menu-open'));
  const closeMenu = ()=> setMenu(false);

  burger.addEventListener('click', toggleMenu);
  if(overlay){ overlay.addEventListener('click', closeMenu); }
  nav.addEventListener('click', (event)=>{
    if(event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape') closeMenu();
  });
}

function registerServiceWorker(){
  if(!('serviceWorker' in navigator) || !window.isSecureContext) return;
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}


// Init common UI when DOM is ready
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  initThemeToggle();
  initScrollTop();
  initMobileMenu();
  registerServiceWorker();
});
