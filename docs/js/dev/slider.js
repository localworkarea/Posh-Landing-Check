import { S as Swiper, N as Navigation, A as Autoplay, E as EffectCoverflow, f as freeMode } from "./swiper.min.js";
function initSliders() {
  if (document.querySelector(".cost-guarantee__slider")) {
    let enableSlider = function() {
      if (costGuaranteeSlider) return;
      costGuaranteeSlider = new Swiper(".cost-guarantee__slider", {
        modules: [Navigation, Autoplay],
        // observer: true,
        // observeParents: true,
        slidesPerView: 1,
        spaceBetween: 12,
        speed: 500,
        autoplay: {
          delay: 3e3,
          disableOnInteraction: true,
          pauseOnMouseEnter: false
        },
        navigation: {
          prevEl: ".cost-guarantee__slider .swiper-button-prev",
          nextEl: ".cost-guarantee__slider .swiper-button-next",
          addIcons: false
        },
        on: {
          init(swiper) {
            const progressLine = swiper.el.querySelector(".slider-progress span");
            if (progressLine) {
              progressLine.style.width = "0%";
            }
          },
          autoplayTimeLeft(swiper, timeLeft, progress) {
            updateHeroGalleryAutoplayProgress(swiper, progress);
          },
          slideChangeTransitionStart(swiper) {
            const progressLine = swiper.el.querySelector(".slider-progress span");
            if (progressLine) {
              progressLine.style.width = "0%";
            }
          }
        }
      });
    }, disableSlider = function() {
      if (!costGuaranteeSlider) return;
      costGuaranteeSlider.destroy(true, true);
      costGuaranteeSlider = null;
    }, checkSlider = function() {
      if (mediaQuery.matches) {
        enableSlider();
      } else {
        disableSlider();
      }
    };
    let costGuaranteeSlider = null;
    const mediaQuery = window.matchMedia("(max-width: 30.061em)");
    checkSlider();
    mediaQuery.addEventListener("change", checkSlider);
  }
  if (document.querySelector(".reviews__slider")) {
    new Swiper(".reviews__slider", {
      // modules: [],
      // observer: true,
      // observeParents: true,
      spaceBetween: 0,
      //autoHeight: true,
      speed: 500,
      //touchRatio: 0,
      //simulateTouch: false,
      //loop: true,
      //preloadImages: false,
      //lazy: true,
      breakpoints: {
        320: {
          slidesPerView: 1.1,
          spaceBetween: 12
        },
        768: {
          slidesPerView: 1.2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 1.52,
          spaceBetween: 45
        }
      },
      // Події
      on: {}
    });
  }
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function updateHeroGalleryImages(swiper) {
    swiper.slides.forEach((slide) => {
      const img = slide.querySelector(".hero-gallery__image img");
      if (!img) return;
      const progress = clamp(slide.progress, -1, 1);
      const absProgress = Math.abs(progress);
      const translateX = progress * 30;
      const scale = 1 + absProgress * 0.6;
      img.style.transform = `translateX(${translateX}%) scale(${scale})`;
      const rawProgress = Math.abs(slide.progress);
      let opacity = 1;
      if (rawProgress > 1) {
        opacity = 1 - clamp(rawProgress - 1, 0, 1);
      }
      slide.style.opacity = opacity;
    });
  }
  function setHeroGalleryImagesTransition(swiper, duration) {
    swiper.slides.forEach((slide) => {
      const img = slide.querySelector(".hero-gallery__image img");
      if (!img) return;
      img.style.transitionDuration = `${duration}ms`;
      slide.style.transitionDuration = `${duration}ms`;
    });
  }
  function updateHeroGalleryAutoplayProgress(swiper, progress) {
    const progressLine = swiper.el.querySelector(".slider-progress span");
    if (!progressLine) return;
    const percent = (1 - progress) * 100;
    progressLine.style.width = `${percent}%`;
  }
  if (document.querySelector(".hero-gallery__slider")) {
    new Swiper(".hero-gallery__slider", {
      modules: [Navigation, Autoplay, EffectCoverflow],
      observer: true,
      observeParents: true,
      speed: 1200,
      slidesPerView: 1,
      spaceBetween: 0,
      watchSlidesProgress: true,
      grabCursor: true,
      autoplay: {
        delay: 3e3,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },
      effect: "coverflow",
      navigation: {
        prevEl: ".hero-gallery__slider .swiper-button-prev",
        nextEl: ".hero-gallery__slider .swiper-button-next",
        addIcons: false
      },
      breakpoints: {
        320: {
          // spaceBetween: 16,
          coverflowEffect: {
            depth: 0,
            modifier: 1,
            scale: 1,
            rotate: 0,
            slideShadows: false,
            stretch: 0
          }
        },
        768: {
          coverflowEffect: {
            depth: 100,
            modifier: 1,
            // scale: 1.2,
            scale: 0.95,
            rotate: 0,
            slideShadows: false,
            // stretch: -140,
            stretch: -70
            // stretch: '-25%',
          }
        }
      },
      on: {
        init(swiper) {
          updateHeroGalleryImages(swiper);
          const progressLine = swiper.el.querySelector(".slider-progress span");
          if (progressLine) {
            progressLine.style.width = "0%";
          }
        },
        progress(swiper) {
          updateHeroGalleryImages(swiper);
        },
        setTransition(swiper, duration) {
          setHeroGalleryImagesTransition(swiper, duration);
        },
        resize(swiper) {
          updateHeroGalleryImages(swiper);
        },
        autoplayTimeLeft(swiper, timeLeft, progress) {
          updateHeroGalleryAutoplayProgress(swiper, progress);
        },
        slideChangeTransitionStart(swiper) {
          const progressLine = swiper.el.querySelector(".slider-progress span");
          if (progressLine) {
            progressLine.style.width = "0%";
          }
        }
      }
    });
  }
  if (document.querySelector(".solutions__slider")) {
    new Swiper(".solutions__slider", {
      modules: [Navigation, Autoplay],
      // observer: true,
      // observeParents: true,
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 16,
      watchSlidesProgress: true,
      grabCursor: true,
      autoplay: {
        delay: 3e3,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },
      navigation: {
        prevEl: ".solutions__slider .swiper-button-prev",
        nextEl: ".solutions__slider .swiper-button-next",
        addIcons: false
      },
      on: {
        init(swiper) {
          const progressLine = swiper.el.querySelector(".slider-progress span");
          if (progressLine) {
            progressLine.style.width = "0%";
          }
        },
        autoplayTimeLeft(swiper, timeLeft, progress) {
          updateHeroGalleryAutoplayProgress(swiper, progress);
        },
        slideChangeTransitionStart(swiper) {
          const progressLine = swiper.el.querySelector(".slider-progress span");
          if (progressLine) {
            progressLine.style.width = "0%";
          }
        }
      }
    });
  }
  if (document.querySelector(".brief-refs__slider")) {
    new Swiper(".brief-refs__slider", {
      modules: [freeMode, Navigation],
      observer: true,
      observeParents: true,
      spaceBetween: 0,
      //autoHeight: true,
      speed: 500,
      freeMode: {
        enabled: true,
        momentumBounceRatio: 1,
        momentumRatio: 0.5,
        momentumVelocityRatio: 1.5
      },
      navigation: {
        prevEl: ".brief-refs__slider .swiper-button-prev",
        nextEl: ".brief-refs__slider .swiper-button-next"
      },
      breakpoints: {
        320: {
          slidesPerView: 1.3,
          spaceBetween: 8
          // initialSlide: 0,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 10
          // initialSlide: 0,
        },
        1024: {
          slidesPerView: 3.3,
          spaceBetween: 10
          // initialSlide: 1,
        },
        1300: {
          slidesPerView: 5.4,
          spaceBetween: 10
          // initialSlide: 1,
        }
      },
      // Події
      on: {}
    });
  }
  if (document.querySelector(".brief-type__slider")) {
    new Swiper(".brief-type__slider", {
      modules: [freeMode, Navigation],
      observer: true,
      observeParents: true,
      spaceBetween: 10,
      slidesPerView: "auto",
      freeMode: {
        enabled: true,
        momentumBounceRatio: 1,
        momentumRatio: 0.5,
        momentumVelocityRatio: 1.5
      },
      navigation: {
        prevEl: ".brief-type__slider .swiper-button-prev",
        nextEl: ".brief-type__slider .swiper-button-next"
      },
      breakpoints: {
        320: {
          // slidesPerView: 1.6,
          spaceBetween: 16
        },
        768: {
          // slidesPerView: 2.5,
          spaceBetween: 33
        }
        // 1024: {
        // slidesPerView: 3.3,
        // spaceBetween: 10,
        // },
      },
      // Події
      on: {}
    });
  }
}
function initSliderFilters() {
  const filterBlocks = document.querySelectorAll("[data-brief-filters]");
  filterBlocks.forEach((filterBlock) => {
    const sliderEl = filterBlock.querySelector("[data-fls-slider]");
    if (!sliderEl) return;
    const swiper = sliderEl.swiper;
    const slides = [...sliderEl.querySelectorAll(".swiper-slide")];
    const filterAll = filterBlock.querySelector('input[value="all"]');
    const filterInputs = [...filterBlock.querySelectorAll("input[data-filter]")].filter((i) => i.value !== "all");
    function applyFilters() {
      const selectedFilters = [...filterBlock.querySelectorAll("input[data-filter]:checked")].map((i) => i.value);
      if (selectedFilters.includes("all")) {
        slides.forEach((slide) => slide.style.display = "");
        swiper.updateSlides();
        swiper.update();
        return;
      }
      slides.forEach((slide) => {
        const tags = slide.dataset.refTags.split(",").map((t) => t.trim());
        const match = selectedFilters.some((f) => tags.includes(f));
        slide.style.display = match ? "" : "none";
      });
      swiper.updateSlides();
      swiper.update();
    }
    filterBlock.addEventListener("change", (e) => {
      const target = e.target;
      if (target.value === "all") {
        filterInputs.forEach((i) => i.checked = false);
        filterAll.checked = true;
        applyFilters();
        return;
      }
      if (target.value !== "all") {
        filterAll.checked = false;
        const anyChecked = filterInputs.some((i) => i.checked);
        if (!anyChecked) {
          filterAll.checked = true;
        }
        applyFilters();
        return;
      }
    });
  });
}
export {
  initSliderFilters,
  initSliders
};
