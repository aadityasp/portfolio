// add class navbarDark on navbar scroll
const header = document.querySelector('.navbar');
console.log(header)
window.onscroll = function() {
    const top = window.scrollY;
    if(top >=100) {
        header.classList.add('navbarDark');
    }
    else {
        header.classList.remove('navbarDark');
    }
}
// collapse navbar after click on small devices
const navLinks = document.querySelectorAll('.nav-item')
const menuToggle = document.getElementById('navbarSupportedContent')

navLinks.forEach((l) => {
    l.addEventListener('click', () => { new bootstrap.Collapse(menuToggle).toggle() })
})

//Adding ripple effect on mouse move.
document.addEventListener('mousemove', function (event) {
    // Create a ripple element
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
  
    // Set ripple element's position
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
  
    // Add the ripple element to the DOM
    document.body.appendChild(ripple);
  
    // Remove the ripple element after the animation ends
    setTimeout(() => {
      ripple.remove();
    }, 2000);
  });
  
  
