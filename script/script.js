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

// //Adding ripple effect on mouse move.
// document.addEventListener('mousemove', function (event) {
//     // Create a ripple element
//     const ripple = document.createElement('div');
//     ripple.classList.add('ripple');
  
//     // Set ripple element's position
//     ripple.style.left = `${event.clientX}px`;
//     ripple.style.top = `${event.clientY}px`;
  
//     // Add the ripple element to the DOM
//     document.body.appendChild(ripple);
  
//     // Remove the ripple element after the animation ends
//     setTimeout(() => {
//       ripple.remove();
//     }, 2000);
//   });

//MAtrix code effect
// const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
// const matrixLength = matrixChars.length;

// function randomMatrixChar() {
//   return matrixChars[Math.floor(Math.random() * matrixLength)];
// }

// document.addEventListener('mousemove', function (event) {
//   const matrixCode = document.createElement('span');
//   matrixCode.classList.add('matrix-code');
//   matrixCode.innerText = randomMatrixChar();
//   matrixCode.style.left = `${event.clientX}px`;
//   matrixCode.style.top = `${event.clientY}px`;

//   document.body.appendChild(matrixCode);

//   setTimeout(() => {
//     matrixCode.remove();
//   }, 800);
// });
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
    }, 2000);
  
    // Create a code line element
    const codeLine = document.createElement('span');
    codeLine.classList.add('matrix-code');
    codeLine.innerText = randomCodeLine();
    codeLine.style.left = `${event.clientX}px`;
    codeLine.style.top = `${event.clientY}px`;
    document.body.appendChild(codeLine);
    setTimeout(() => {
      codeLine.remove();
    }, 800);
  });
  
  
