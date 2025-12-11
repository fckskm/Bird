/* ====== Галерея на главной (простой слайдер) ====== */
(function(){
  const slider = document.getElementById('homeSlider');
  if(!slider) return;

  const track = slider.querySelector('.slider__track');
  const slides = [...track.children];
  let i = 0;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion){
    track.style.transition = 'transform .35s ease';
  }

  function render(){
    track.style.transform = `translateX(-${i * 100}%)`;
  }

  slider.addEventListener('click', (e)=>{
    const btn = e.target.closest('.slider__btn');
    if(!btn) return;
    const dir = btn.dataset.dir;
    if(dir === 'next') i = (i + 1) % slides.length;
    if(dir === 'prev') i = (i - 1 + slides.length) % slides.length;
    render();
  });

  render();
})();

/* ====== Подписка на рассылку ====== */
(function(){
  const form = document.getElementById('subscribeForm');
  if(!form) return;
  const email = document.getElementById('subscribeEmail');
  const msg = document.getElementById('subscribeMsg');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const value = (email.value || '').trim();
    if(!value.includes('@')){
      msg.textContent = 'Пожалуйста, введите корректный email.';
      msg.style.color = '#ffd1d1';
      return;
    }
    msg.textContent = 'Спасибо! Мы добавили вас в список рассылки.';
    msg.style.color = '#fff';
    email.value = '';
  });
})();

/* ====== Отправка отзывов ====== */
(function(){
  const form = document.getElementById('reviewForm');
  if(!form) return;

  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const textInput = form.querySelector('textarea[name="message"]');
  const msg = document.getElementById('reviewMsg');

  function setMessage(text, isError){
    if(!msg) return;
    msg.textContent = text;
    msg.classList.toggle('is-error', !!isError);
    msg.classList.toggle('is-success', !isError);
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const rating = form.querySelector('input[name="rating"]:checked');
    const name = (nameInput?.value || '').trim();
    const email = (emailInput?.value || '').trim();
    const text = (textInput?.value || '').trim();

    let error = '';
    if(!name) error = 'Пожалуйста, укажите имя.';
    else if(!email) error = 'Пожалуйста, укажите email.';
    else if(!rating) error = 'Пожалуйста, поставьте оценку.';
    else if(!text) error = 'Пожалуйста, напишите отзыв.';

    if(error){
      setMessage(error, true);
      return;
    }

    setMessage('Спасибо! Ваш отзыв отправлен.', false);
    form.reset();
  });
})();

