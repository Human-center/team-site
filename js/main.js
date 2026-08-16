(function () {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  }, { passive: true });

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  const teamGrid = document.getElementById("teamGrid");
  (window.TEAM_MEMBERS || []).forEach((member) => {
    const card = document.createElement("article");
    card.className = "member-card reveal";
    const initials = member.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    card.innerHTML =
      '<div class="member-avatar" style="background:' + member.color + '">' + initials + "</div>" +
      "<h3>" + member.name + "</h3>" +
      '<p class="member-role">' + member.role + "</p>" +
      '<p class="member-bio">' + member.bio + "</p>" +
      (member.linkedin
        ? '<a class="member-link" href="' + member.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>'
        : "");
    teamGrid.appendChild(card);
  });

  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const body =
      "Name: " + data.get("name") +
      "\nEmail: " + data.get("email") +
      "\n\n" + data.get("message");
    const mail = "mailto:hello@hcsrel.com?subject=" +
      encodeURIComponent("Human Center workshop inquiry") +
      "&body=" + encodeURIComponent(body);
    window.location.href = mail;
    note.textContent = "Opening your mail app — we'll get back to you!";
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
