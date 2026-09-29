(() => {
  const revealEls = document.querySelectorAll(".reveal");

  const reveal = (el) => el.classList.add("visible");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(reveal);
  }

  // Mobile menu works on both pages.
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.textContent = open ? "×" : "";
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.textContent = "";
      });
    });
  }

  // Catalog filters with smooth show/hide.
  const buttons = document.querySelectorAll(".filters button");
  const products = document.querySelectorAll(".product");
  const sectionTitles = document.querySelectorAll(".catalog-section-title");

  function applyFilter(cat) {
    buttons.forEach(btn => btn.classList.toggle("active", btn.dataset.cat === cat));
    products.forEach(card => {
      const show = cat === "all" || card.dataset.cat === cat;
      card.classList.toggle("is-hidden", !show);
      if (show) requestAnimationFrame(() => card.classList.add("visible"));
    });
    sectionTitles.forEach(title => {
      const section = title.dataset.section;
      const show = cat === "all" || (cat === "masculino" ? section === "masculino" : section === "feminino");
      title.classList.toggle("is-hidden", !show);
    });
  }

  if (buttons.length) {
    buttons.forEach(btn => btn.addEventListener("click", () => applyFilter(btn.dataset.cat)));

    const hash = window.location.hash.replace("#", "");
    const valid = ["intimas", "joias", "pijamas", "fitness", "masculino"];
    if (valid.includes(hash)) {
      applyFilter(hash);
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } else {
      applyFilter("all");
    }
  }

  // Desktop custom cursor only; disabled automatically on touch devices.
  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  if (cursor && ring && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    }, { passive: true });

    document.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("pointerenter", () => ring.classList.add("hover"));
      el.addEventListener("pointerleave", () => ring.classList.remove("hover"));
    });
  }
})();