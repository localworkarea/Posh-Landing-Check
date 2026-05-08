import { S as Swiper, N as Navigation, A as Autoplay, E as EffectCoverflow, f as freeMode } from "./swiper.min.js";
function initSliders() {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function updateSliderAutoplayProgress(swiper, progress) {
    const progressLine = swiper.el.querySelector(".slider-progress span");
    if (!progressLine) return;
    const percent = (1 - progress) * 100;
    progressLine.style.width = `${percent}%`;
  }
  function resetSliderAutoplayProgress(swiper) {
    const progressLine = swiper.el.querySelector(".slider-progress span");
    if (!progressLine) return;
    progressLine.style.width = "0%";
  }
  function updateHeroGallerySlideVisuals(swiper) {
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
  function setHeroGallerySlideTransition(swiper, duration) {
    swiper.slides.forEach((slide) => {
      const img = slide.querySelector(".hero-gallery__image img");
      if (!img) return;
      img.style.transitionDuration = `${duration}ms`;
      slide.style.transitionDuration = `${duration}ms`;
    });
  }
  if (document.querySelector(".hero-gallery__slider")) {
    let setHeroGalleryLoadingState = function(state) {
      sliderEl.classList.toggle("--loading", state);
      if (loadMoreBtn) {
        loadMoreBtn.disabled = state;
        loadMoreBtn.classList.toggle("--loading", state);
        loadMoreBtn.setAttribute("aria-busy", state ? "true" : "false");
      }
    }, escapeHtml = function(str = "") {
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }, getDesktopImageUrl = function(post) {
      return post.desktop_image_url || post?.acf?.desktop_image_url || post?.better_featured_image?.source_url || "";
    }, getMobileImageUrl = function(post, desktopUrl = "") {
      return post.mobile_image_url || post?.acf?.mobile_image_url || desktopUrl;
    }, getCaseUniqueKey = function(post) {
      const link = post?.link || "";
      if (link) {
        try {
          const url = new URL(link);
          const parts = url.pathname.split("/").filter(Boolean);
          const caseIndex = parts.indexOf("case");
          if (caseIndex !== -1 && parts[caseIndex + 1]) {
            return parts[caseIndex + 1];
          }
        } catch (e) {
        }
      }
      const desktopUrl = getDesktopImageUrl(post);
      if (desktopUrl) {
        return desktopUrl;
      }
      return String(post?.id || "");
    }, createHeroGallerySlide = function(post) {
      if (!post?.id) return null;
      const postId = String(post.id);
      const caseKey = getCaseUniqueKey(post);
      const desktopUrl = getDesktopImageUrl(post);
      if (!desktopUrl) return null;
      const mobileUrl = getMobileImageUrl(post, desktopUrl);
      const altText = post?.title?.rendered ? post.title.rendered.replace(/<[^>]*>/g, "").trim() : "Case image";
      post?.link || "#";
      const slide = document.createElement("div");
      slide.className = "hero-gallery__slide swiper-slide";
      slide.setAttribute("data-post-id", postId);
      slide.setAttribute("data-case-key", caseKey);
      slide.innerHTML = `
				<div class="hero-gallery__image">
					<picture>
						${mobileUrl ? `<source media="(max-width: 600px)" srcset="${escapeHtml(mobileUrl)}">` : ""}
						<img
							class="ibg"
							alt="${escapeHtml(altText)}"
							src="${escapeHtml(desktopUrl)}"
						>
					</picture>
				</div>
			`;
      return slide;
    }, removePlaceholderSlide = function() {
      if (placeholderSlide && placeholderSlide.parentNode) {
        placeholderSlide.remove();
      }
    }, hideLoadMoreSlide = function() {
      if (!moreSlideEl) return;
      moreSlideEl.hidden = true;
    }, showLoadMoreSlide = function() {
      if (!moreSlideEl) return;
      moreSlideEl.hidden = false;
    }, updateLoadMoreVisibility = function() {
      if (currentPage >= totalPages) {
        hideLoadMoreSlide();
      } else {
        showLoadMoreSlide();
      }
    }, appendSlidesToHeroGallery = function(posts) {
      const fragment = document.createDocumentFragment();
      let addedSlidesCount = 0;
      posts.forEach((post) => {
        if (!post?.id) return;
        const caseKey = String(getCaseUniqueKey(post));
        if (!caseKey) return;
        if (loadedCaseKeys.has(caseKey)) return;
        const existsInDom = wrapperEl.querySelector(
          `.hero-gallery__slide[data-case-key="${caseKey}"]`
        );
        if (existsInDom) {
          loadedCaseKeys.add(caseKey);
          return;
        }
        const slide = createHeroGallerySlide(post);
        if (!slide) return;
        loadedCaseKeys.add(caseKey);
        fragment.appendChild(slide);
        addedSlidesCount++;
      });
      if (!addedSlidesCount) return 0;
      wrapperEl.insertBefore(fragment, moreSlideEl);
      return addedSlidesCount;
    }, updateSwiperAfterDomChange = function() {
      heroGallerySwiper.updateSlides();
      heroGallerySwiper.updateSize();
      heroGallerySwiper.updateProgress();
      heroGallerySwiper.updateSlidesClasses();
      heroGallerySwiper.update();
    };
    const HERO_GALLERY_API_URL = "https://posh.pro/wp-json/wp/v2/case";
    const HERO_GALLERY_PER_PAGE = 10;
    const PAGE_LANG = (() => {
      const htmlLang = document.documentElement.lang?.trim().toLowerCase() || "en";
      if (htmlLang.startsWith("ru")) return "ru";
      if (htmlLang.startsWith("uk") || htmlLang.startsWith("ua")) return "uk";
      return "en";
    })();
    console.log("Hero gallery language:", PAGE_LANG);
    const sliderEl = document.querySelector(".hero-gallery__slider");
    if (!sliderEl) return;
    if (sliderEl.dataset.heroGalleryInited === "true") {
      return;
    }
    sliderEl.dataset.heroGalleryInited = "true";
    const wrapperEl = sliderEl.querySelector("[data-fls-slider-wrapper]") || sliderEl.querySelector(".swiper-wrapper");
    if (!wrapperEl) {
      console.error("Hero gallery: wrapper not found");
      return;
    }
    const moreSlideEl = wrapperEl.querySelector("[data-fls-slider-more]");
    if (!moreSlideEl) {
      console.error("Hero gallery: [data-fls-slider-more] slide not found");
      return;
    }
    const loadMoreBtn = sliderEl.querySelector("[data-fls-slider-more-btn]") || sliderEl.querySelector(".hero-gallery__more-btn");
    const placeholderSlide = wrapperEl.querySelector(".hero-gallery__slide:not([data-fls-slider-more])");
    let heroGallerySwiper = null;
    let currentPage = 0;
    let totalPages = 1;
    let isLoading = false;
    let isInitialLoaded = false;
    const loadedCaseKeys = /* @__PURE__ */ new Set();
    wrapperEl.querySelectorAll(".hero-gallery__slide[data-case-key]").forEach((slide) => {
      const key = slide.getAttribute("data-case-key");
      if (key) loadedCaseKeys.add(String(key));
    });
    async function fetchPosts(page = 1, neededCount = HERO_GALLERY_PER_PAGE) {
      let apiPage = page;
      let collectedPosts = [];
      let apiTotalPages = 1;
      while (collectedPosts.length < neededCount) {
        const url = new URL(HERO_GALLERY_API_URL);
        url.searchParams.set("per_page", HERO_GALLERY_PER_PAGE);
        url.searchParams.set("page", apiPage);
        url.searchParams.set("_embed", "1");
        url.searchParams.set("lang", PAGE_LANG);
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to load posts. Status: ${response.status}`);
        }
        const posts = await response.json();
        apiTotalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1", 10);
        if (!posts.length) {
          break;
        }
        for (const post of posts) {
          const desktopUrl = getDesktopImageUrl(post);
          if (!desktopUrl) continue;
          const caseKey = String(getCaseUniqueKey(post));
          if (!caseKey) continue;
          if (loadedCaseKeys.has(caseKey)) continue;
          if (collectedPosts.some((item) => String(getCaseUniqueKey(item)) === caseKey)) continue;
          collectedPosts.push(post);
          if (collectedPosts.length >= neededCount) {
            break;
          }
        }
        if (apiPage >= apiTotalPages) {
          break;
        }
        apiPage++;
      }
      return {
        posts: collectedPosts,
        totalPages: apiTotalPages,
        lastFetchedPage: apiPage
      };
    }
    async function loadHeroGalleryPosts({ initial = false } = {}) {
      if (isLoading) return;
      isLoading = true;
      setHeroGalleryLoadingState(true);
      if (heroGallerySwiper?.autoplay?.running) {
        heroGallerySwiper.autoplay.stop();
      }
      try {
        const nextPage = initial ? 1 : currentPage + 1;
        const prevRealSlidesCount = wrapperEl.querySelectorAll(".hero-gallery__slide:not([data-fls-slider-more])").length;
        const {
          posts,
          totalPages: fetchedTotalPages,
          lastFetchedPage
        } = await fetchPosts(nextPage, HERO_GALLERY_PER_PAGE);
        totalPages = fetchedTotalPages;
        if (initial) {
          removePlaceholderSlide();
        }
        const addedSlidesCount = appendSlidesToHeroGallery(posts);
        currentPage = lastFetchedPage;
        updateLoadMoreVisibility();
        if (!addedSlidesCount) {
          if (initial) {
            isInitialLoaded = true;
          }
          return;
        }
        updateSwiperAfterDomChange();
        if (initial) {
          heroGallerySwiper.slideTo(0, 0, false);
          if (heroGallerySwiper.params.autoplay) {
            heroGallerySwiper.autoplay.start();
          }
          isInitialLoaded = true;
        } else {
          const firstNewSlideIndex = prevRealSlidesCount;
          heroGallerySwiper.slideTo(firstNewSlideIndex, 0, false);
          heroGallerySwiper.updateProgress();
          heroGallerySwiper.updateSlidesClasses();
          updateHeroGallerySlideVisuals(heroGallerySwiper);
          if (heroGallerySwiper.params.autoplay) {
            heroGallerySwiper.autoplay.start();
          }
        }
      } catch (error) {
        console.error("Hero gallery load error:", error);
      } finally {
        isLoading = false;
        setHeroGalleryLoadingState(false);
      }
    }
    heroGallerySwiper = new Swiper(".hero-gallery__slider", {
      modules: [Navigation, Autoplay, EffectCoverflow],
      // modules: [Navigation,  EffectCoverflow],
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
            scale: 0.95,
            rotate: 0,
            slideShadows: false,
            stretch: -70
          }
        }
      },
      on: {
        init(swiper) {
          updateHeroGallerySlideVisuals(swiper);
          resetSliderAutoplayProgress(swiper);
          if (swiper.autoplay?.running) {
            swiper.autoplay.stop();
          }
          loadHeroGalleryPosts({ initial: true });
        },
        progress(swiper) {
          updateHeroGallerySlideVisuals(swiper);
        },
        setTransition(swiper, duration) {
          setHeroGallerySlideTransition(swiper, duration);
        },
        resize(swiper) {
          updateHeroGallerySlideVisuals(swiper);
        },
        autoplayTimeLeft(swiper, timeLeft, progress) {
          updateSliderAutoplayProgress(swiper, progress);
        },
        slideChangeTransitionStart(swiper) {
          resetSliderAutoplayProgress(swiper);
        }
      }
    });
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (isLoading) return;
        if (!isInitialLoaded) return;
        if (currentPage >= totalPages) return;
        await loadHeroGalleryPosts({ initial: false });
      });
    }
  }
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
            resetSliderAutoplayProgress(swiper);
          },
          autoplayTimeLeft(swiper, timeLeft, progress) {
            updateSliderAutoplayProgress(swiper, progress);
          },
          slideChangeTransitionStart(swiper) {
            resetSliderAutoplayProgress(swiper);
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
          resetSliderAutoplayProgress(swiper);
        },
        autoplayTimeLeft(swiper, timeLeft, progress) {
          updateSliderAutoplayProgress(swiper, progress);
        },
        slideChangeTransitionStart(swiper) {
          resetSliderAutoplayProgress(swiper);
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
