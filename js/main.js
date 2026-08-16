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

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const teamGrid = document.getElementById("teamGrid");
  const modal = document.getElementById("teamModal");
  const modalAvatar = document.getElementById("modalAvatar");
  const modalName = document.getElementById("modalName");
  const modalRole = document.getElementById("modalRole");
  const modalBio = document.getElementById("modalBio");
  const modalLink = document.getElementById("modalLink");

  function openModal(member) {
    if (!modal) return;
    modalAvatar.innerHTML = member.photo
      ? '<img src="' + esc(member.photo) + '" alt="' + esc(member.name) + '" />'
      : "<span>" + esc(member.name.split(" ").map((w) => w[0]).join("").slice(0, 2)) + "</span>";
    modalName.textContent = member.name;
    modalRole.textContent = member.role;
    modalBio.textContent = member.fullBio || member.bio;
    if (member.linkedin) {
      modalLink.href = member.linkedin;
      modalLink.hidden = false;
    } else {
      modalLink.hidden = true;
    }
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  if (modal) {
    modal.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  (window.TEAM_MEMBERS || []).forEach((member) => {
    const card = document.createElement("article");
    card.className = "member-card reveal";
    const initials = member.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const avatar = member.photo
      ? '<img class="member-avatar" src="' + esc(member.photo) + '" alt="' + esc(member.name) + '" />'
      : '<div class="member-avatar" style="background:' + esc(member.color) + '">' + esc(initials) + "</div>";

    const links = [];
    if (member.profile) {
      links.push('<a class="member-link" href="' + esc(member.profile) + '">Profile</a>');
    }
    if (member.linkedin) {
      links.push(
        '<a class="member-link" href="' + esc(member.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>'
      );
    }
    if (member.link) {
      links.push(
        '<a class="member-link" href="' + esc(member.link) + '" target="_blank" rel="noopener">' +
          esc(member.linkLabel || "Link") +
        "</a>"
      );
    }

    card.innerHTML =
      avatar +
      "<h3>" + esc(member.name) + "</h3>" +
      '<p class="member-role">' + esc(member.role) + "</p>" +
      '<p class="member-bio">' + esc(member.bio) + "</p>" +
      (links.length ? '<p class="member-links">' + links.join("") + "</p>" : "");

    if (member.profile) {
      card.classList.add("is-link");
      card.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        window.location.href = member.profile;
      });
    } else if (member.fullBio && modal) {
      card.classList.add("is-link");
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        openModal(member);
      });
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
