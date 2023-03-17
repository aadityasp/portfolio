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
  
    // Set ripple element's size and position
    const diameter = 50; // You can change this value to adjust the ripple size
    ripple.style.width = `${diameter}px`;
    ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - diameter / 2}px`;
    ripple.style.top = `${event.clientY - diameter / 2}px`;
  
    // Add the ripple element to the DOM
    document.body.appendChild(ripple);
  
    // Remove the ripple element after the animation ends
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  });
  
