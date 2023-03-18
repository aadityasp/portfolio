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

//emailjs
// Replace 'your_user_id' with your EmailJS User ID
emailjs.init('ghT20476Zcl43zo1U');
// code to handle form submission
document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Replace these values with your Service ID and Template ID
  const serviceID = 'service_yvg59sy';
  const templateID = 'template_9boqmz2';

  // Get form data
  const fromName = document.querySelector('input[name="name"]').value;
  const fromEmail = document.querySelector('input[name="email"]').value;
  const subject = document.querySelector('input[name="subject"]').value;
  const message = document.querySelector('textarea[name="message"]').value;

  // Send the email using EmailJS
  emailjs.send(serviceID, templateID, {
    from_name: fromName,
    from_email: fromEmail,
    subject: subject,
    message: message,
  })
  .then(function(response) {
    alert('Your message has been sent!');
  }, function(error) {
    alert('Failed to send the message. ' + error);
  });
});

  

const codeSamples = [
    "int main() {",
    "  std::cout << 'Hello, World!' << std::endl;",
    "  return 0;",
    "}",
    "def hello():",
    "  print('Hello, World!')",
    "hello()",
    "class MyClass:",
    "  def __init__(self):",
    "    self.data = 42",
    "  def display(self):",
    "    print(self.data)"
  ];
  
  function randomCodeLine() {
    return codeSamples[Math.floor(Math.random() * codeSamples.length)];
  }
  
  document.addEventListener('mousemove', function (event) {
    // Create a ripple element
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 500);
  
    // Create a code line element
    const codeLine = document.createElement('span');
    codeLine.classList.add('matrix-code');
    codeLine.innerText = randomCodeLine();
    codeLine.style.left = `${event.clientX}px`;
    codeLine.style.top = `${event.clientY}px`;
    document.body.appendChild(codeLine);
    setTimeout(() => {
      codeLine.remove();
    }, 200);
  });
  
  
