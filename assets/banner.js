document.addEventListener("DOMContentLoaded", function () {
  const firstSvg = document.querySelector(".one");
  const svgs = document.querySelectorAll(".banner-section .nav-icons");
  const navigationContainer = document.querySelector(".container");
  const mobileElements = document.querySelectorAll(".mobile-elements");

  console.log(firstSvg);

  svgs.forEach((icon) => {
    icon.addEventListener("click", function () {
      // Toggle visibility
      svgs.forEach((ele) => {
        ele.classList.toggle("show-class");
      });

      if (firstSvg.classList.contains("show-class")) {
        navigationContainer.style.height = "65px";
        mobileElements.forEach((mobElement) => {
          mobElement.classList.remove("show-class");
        });
      } else {
        navigationContainer.style.height = "189px";
        mobileElements.forEach((mobElement) => {
          mobElement.classList.add("show-class");
        });
      }
    });
  });
});
