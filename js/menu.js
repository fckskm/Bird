/* ====== Фильтры ====== */
(function(){
  const filters = document.querySelectorAll('.filter');
  const grid = document.getElementById('menuGrid');
  if(!grid) return;

  function apply(category){
    [...grid.children].forEach(card=>{
      const hit = category === 'all' || card.dataset.category === category;
      card.style.display = hit ? '' : 'none';
    });
  }

  filters.forEach(btn=>{
    btn.setAttribute('aria-selected', btn.classList.contains('is-active'));
    btn.addEventListener('click', ()=>{
      filters.forEach(b=>{
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      apply(btn.dataset.filter);
    });
  });

  /* Добавление в корзину */
  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('.add');
    if(!btn) return;
    const card = btn.closest('.card');
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price) || 0,
      qty: 1
    };
    addToCart(product);
    btn.textContent = 'В корзине ✓';
    setTimeout(()=> btn.textContent = 'Добавить в корзину', 1200);
  });
})();
