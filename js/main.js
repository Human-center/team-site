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
  const modal = document.getElementById("teamModal");
  const modalAvatar = document.getElementById("modalAvatar");
  const modalName = document.getElementById("modalName");
  const modalRole = document.getElementById("modalRole");
  const modalBio = document.getElementById("modalBio");
  const modalLink = document.getElementById("modalLink");

  const initials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const openModal = (member) => {
    modalAvatar.innerHTML = member.photo
      ? '<img src="' + member.photo + '" alt="' + member.name + '" />'
      : "<span>" + initials(member.name) + "</span>";
    modalName.textContent = member.name;
    modalRole.textContent = member.role;
    modalBio.textContent = member.fullBio || member.bio;
    if (member.linkedin) {
      modalLink.href = member.linkedin;
      modalLink.style.display = "inline-block";
    } else {
      modalLink.style.display = "none";
    }
    modal.hidden = false;
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  (window.TEAM_MEMBERS || []).forEach((member) => {
    const card = document.createElement("article");
    card.className = "member-card reveal" + (member.fullBio ? " clickable" : "");
    const avatar = member.photo
      ? '<img src="' + member.photo + '" alt="' + member.name + '" />'
      : "<span>" + initials(member.name) + "</span>";
    card.innerHTML =
      '<div class="member-avatar" style="background:' + member.color + '">' + avatar + "</div>" +
      "<h3>" + member.name + "</h3>" +
      '<p class="member-role">' + member.role + "</p>" +
      '<p class="member-bio">' + member.bio + "</p>";
    if (member.fullBio) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("click", () => openModal(member));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(member);
        }
      });
    }
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
