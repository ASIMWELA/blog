import { TweenMax, Power3 } from "gsap";
//import { ScrollTrigger } from "gsap/ScrollTrigger";
//Animate text
export const animateTop = (elem) => {
  TweenMax.to(elem, 0.8, {
    y: -5,
    opacity: 1,
    ease: Power3.easeIn,
  });
};

export const animateLeft = (elem) => {
  TweenMax.to(elem, 1.2, {
    x: -15,
    opacity: 1,
    ease: Power3.easeInOut,
  });
};

export const animateRight = (elem) => {
  TweenMax.to(elem, 2, {
    x: 20,
    opacity: 1,
    ease: Power3.easeOut,
  });
};

export const careerIntro = (elem) => {
  TweenMax.to(elem, 1.2, {
    y: -30,
    opacity: 1,
    ease: Power3.easeOut,
  });
};
