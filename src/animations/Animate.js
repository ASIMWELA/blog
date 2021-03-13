import { TweenMax, Power3 } from "gsap";
//import { ScrollTrigger } from "gsap/ScrollTrigger";
//Animate text
export const textIntro = (elem) => {
  TweenMax.to(elem, 0.8, {
    y: -5,
    opacity: 1,
    ease: Power3.easeInOut,
  });
};

export const headerTextIntro = (elem) => {
  TweenMax.to(elem, 1.5, {
    x: 20,
    opacity: 1,
    ease: Power3.easeInOut,
  });
};

export const careerIntro = (elem) => {
  TweenMax.to(elem, 1.2, {
    y: -30,
    opacity: 1,
    ease: Power3.easeOut,
  });
};
