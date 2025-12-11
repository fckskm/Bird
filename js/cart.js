function renderCart(){
  const list = document.getElementById('cartList');
  if(!list) return;
  const items = readCart();

  if(items.length === 0){
    list.innerHTML = '<p class="muted">Корзина пока пуста. Добавьте напитки из <a href="menu.html">меню</a>.</p>';
    document.getElementById('cartTotal').textContent = '0';
    return;
  }

  list.innerHTML = items.map(i => `
    <div class="item" data-id="${i.id}">
      <h3>${i.name}</h3>
      <div class="price">${i.price} ₽</div>
      <div class="qty">
        <button type="button" class="dec" aria-label="Уменьшить количество">−</button>
        <span class="q">${i.qty}</span>
        <button type="button" class="inc" aria-label="Увеличить количество">+</button>
      </div>
      <div class="sum">${i.price * i.qty} ₽</div>
      <button type="button" class="remove" title="Удалить позицию">×</button>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = String(cartTotal());
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCart();

  const list = document.getElementById('cartList');
  if(list){
    list.addEventListener('click', (e)=>{
      const row = e.target.closest('.item'); if(!row) return;
      const id = row.dataset.id;

      if(e.target.classList.contains('inc')) changeQty(id, +1);
      if(e.target.classList.contains('dec')) changeQty(id, -1);
      if(e.target.classList.contains('remove')) removeFromCart(id);

      renderCart();
    });
  }

  const form = document.getElementById('orderForm');
  const msg = document.getElementById('orderMsg');
  if(!form || !msg) return;

  const requiredFields = Array.from(form.querySelectorAll('input[type="text"], input[type="tel"], textarea'));

  const showMessage = (text, type = 'error')=>{
    msg.textContent = text;
    msg.classList.remove('is-error', 'is-success');
    msg.classList.add(type === 'success' ? 'is-success' : 'is-error');
  };

  requiredFields.forEach(field=>{
    field.addEventListener('input', ()=>{
      if(field.value.trim()){
        field.classList.remove('is-invalid');
      }
    });
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    let firstInvalid = null;
    requiredFields.forEach(field=>{
      if(!field.value.trim()){
        field.classList.add('is-invalid');
        if(!firstInvalid) firstInvalid = field;
      } else {
        field.classList.remove('is-invalid');
      }
    });

    if(firstInvalid){
      showMessage('Пожалуйста, заполните все обязательные поля.', 'error');
      firstInvalid.focus();
      return;
    }

    const items = readCart();
    if(items.length === 0){
      showMessage('Добавьте товары в корзину перед оформлением заказа.', 'error');
      return;
    }

    alert('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    renderCart();
    requiredFields.forEach(field=> field.classList.remove('is-invalid'));
    showMessage('Заказ отправлен, ожидайте звонка менеджера.', 'success');
    form.reset();
  });
});
