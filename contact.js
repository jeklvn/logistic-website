document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone){
    return /^\+?234\s?\d{6,14}$/.test(phone) || /^\d{7,15}$/.test(phone);
  }

  // IntersectionObserver for scroll-triggered animations
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('animate');
      }
    });
  },{threshold:0.12});

  document.querySelectorAll('.animate-on-scroll').forEach(el=>observer.observe(el));

  // subtle infinite icon bobbing with stagger (applied to card icons)
  const icons = document.querySelectorAll('.card-icon i');
  icons.forEach((icon, i)=>{
    icon.style.animation = `bounce 3s ${i*0.25}s infinite`;
  });

  // Form handling & validation
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      status.textContent = '';

      const name = document.getElementById('name');
      const contact = document.getElementById('contact');
      const message = document.getElementById('message');

      let valid = true;

      [name,contact,message].forEach(function(el){
        if(!el.value.trim()){
          el.setAttribute('aria-invalid','true');
          valid = false;
        } else {
          el.removeAttribute('aria-invalid');
        }
      });

      const c = contact.value.trim();
      if(c && !(validateEmail(c) || validatePhone(c))){
        contact.setAttribute('aria-invalid','true');
        status.textContent = 'Please enter a valid Nigerian phone (+234...) or email address.';
        valid = false;
      }

      if(!valid){
        if(!status.textContent) status.textContent = 'Please fill the required fields correctly.';
        return;
      }

      status.textContent = '✅ Message Sent Successfully! We will get back to you shortly.';
      status.style.color = '#155724';
      form.querySelectorAll('input,textarea,select,button').forEach(function(el){ el.disabled = true; });

      // Visual pulse on submit
      form.classList.add('submitted');

      setTimeout(function(){
        form.reset();
        form.querySelectorAll('input,textarea,select,button').forEach(function(el){ el.disabled = false; });
        status.textContent = '';
        form.classList.remove('submitted');
      },6000);
    });
  }
});

/* Keyframes used by JS (kept here for convenience) */
const style = document.createElement('style');
style.textContent = `@keyframes bounce { 0%,20%,50%,80%,100%{ transform: translateY(0);} 40%{transform: translateY(-6px);} 60%{transform: translateY(-3px);} }`;
document.head.appendChild(style);
