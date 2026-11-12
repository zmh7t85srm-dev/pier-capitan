/* Pier Capitan Resto Bar & Grill — homepage interactions */
(function () {
  "use strict";

  const BOOKING_EMAIL = "inquiry@piercapitan.com";

  /* ---------- Year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header shadow + mobile nav ---------- */
  const header = document.querySelector(".header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setNav = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

  /* ---------- Active nav link on scroll ---------- */
  const links = [...document.querySelectorAll(".nav__list a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Accessible tabs ---------- */
  function initTabs(list) {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        let n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") n = tabs[0];
        if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    return { selectById: (id) => { const t = document.getElementById(id); if (t) select(t); } };
  }
  const tabSets = {};
  document.querySelectorAll("[data-tabs]").forEach((el) => { tabSets[el.dataset.tabs] = initTabs(el); });

  // Links that should open a specific package tab (e.g. promo → Beer packages)
  document.querySelectorAll("[data-open-tab]").forEach((a) => {
    a.addEventListener("click", () => tabSets.packages && tabSets.packages.selectById("tab-" + a.dataset.openTab));
  });

  /* ---------- Mobile Bar: price by number of guests ---------- */
  const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
  const paxSelect = document.getElementById("f-pax");
  document.querySelectorAll('input[name="pax"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const pax = radio.value;
      document.querySelectorAll(".pkg[data-prices]").forEach((card) => {
        const prices = JSON.parse(card.dataset.prices);
        const amount = card.querySelector(".pkg__amount");
        amount.textContent = peso.format(prices[pax]);
        card.querySelector(".pkg__pax").textContent = pax;
        amount.classList.remove("is-updating");
        void amount.offsetWidth; // restart animation
        amount.classList.add("is-updating");
      });
      if (paxSelect) paxSelect.value = pax + " pax";
    });
  });

  /* ---------- "Book this" buttons prefill the form ---------- */
  const pkgSelect = document.getElementById("f-package");
  document.querySelectorAll("[data-package]").forEach((btn) => {
    btn.addEventListener("click", () => { if (pkgSelect) pkgSelect.value = btn.dataset.package; });
  });

  /* ---------- Forms → pre-filled email ---------- */
  const today = new Date().toISOString().slice(0, 10);

  function bindMailForm(form, missingMsg, build) {
    if (!form) return;
    const msg = form.querySelector(".form-msg");
    form.querySelectorAll('input[type="date"]').forEach((el) => { el.min = today; });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstBad = null;
      form.querySelectorAll("[required]").forEach((el) => {
        const bad = !el.value.trim();
        el.setAttribute("aria-invalid", String(bad));
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) {
        msg.classList.remove("is-ok");
        msg.textContent = missingMsg;
        firstBad.focus();
        return;
      }
      const { subject, lines } = build(Object.fromEntries(new FormData(form).entries()));
      const body = ["Hi Pier Capitan!", "", ...lines.filter((l) => l !== null), "", "Thank you!"].join("\n");
      window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      msg.classList.add("is-ok");
      msg.textContent = "Opening your email app… If nothing happens, call us at +63 916 425 9830.";
    });
  }

  bindMailForm(
    document.getElementById("reserve-form"),
    "Please fill in your name, mobile number, date and time.",
    (d) => ({
      subject: `Table reservation request – ${d.date} ${d.time} (${d.guests} guests)`,
      lines: [
        "I'd like to reserve a table.",
        "",
        `Name: ${d.name}`,
        `Mobile: ${d.phone}`,
        `Date: ${d.date}`,
        `Time: ${d.time}`,
        `Guests: ${d.guests}`,
        d.occasion ? `Occasion: ${d.occasion}` : null,
        d.notes ? `Requests: ${d.notes}` : null
      ]
    })
  );

  bindMailForm(
    document.getElementById("book-form"),
    "Please fill in your name, mobile number, event date and venue.",
    (d) => ({
      subject: `Mobile Bar booking inquiry – ${d.date} (${d.pax})`,
      lines: [
        "I'd like to inquire about booking the Mobile Bar.",
        "",
        `Name: ${d.name}`,
        `Mobile: ${d.phone}`,
        `Event date: ${d.date}`,
        `Guests: ${d.pax}`,
        `Package: ${d.package}`,
        `Venue: ${d.venue}`,
        d.notes ? `Notes: ${d.notes}` : null
      ]
    })
  );

  /* ---------- Gallery lightbox ---------- */
  const box = document.getElementById("lightbox");
  const items = [...document.querySelectorAll(".g-item")];
  if (box && typeof box.showModal === "function" && items.length) {
    const img = box.querySelector("img");
    const cap = box.querySelector("figcaption");
    let idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const thumb = items[idx].querySelector("img");
      img.src = items[idx].dataset.full;
      img.alt = thumb.alt;
      cap.textContent = thumb.alt;
    };
    items.forEach((btn, i) => btn.addEventListener("click", () => { show(i); box.showModal(); }));
    box.querySelector(".lightbox__close").addEventListener("click", () => box.close());
    box.querySelector(".lightbox__prev").addEventListener("click", () => show(idx - 1));
    box.querySelector(".lightbox__next").addEventListener("click", () => show(idx + 1));
    box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
    box.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
    box.addEventListener("close", () => items[idx].focus());
  }
})();
