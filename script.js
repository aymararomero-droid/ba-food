const cards = [...document.querySelectorAll(".restaurant-card")];
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const searchInput = document.getElementById("searchInput");
const resultsLine = document.getElementById("resultsLine");
const emptyState = document.getElementById("emptyState");
const favoritesText = document.getElementById("favoritesText");
let activeFilter = "todos";
let favoritesOnly = false;

// Filtra las tarjetas por categoría y por el texto escrito en el buscador.
function updateRestaurants() {
  const search = searchInput.value.toLowerCase().trim();
  let visible = 0;

  cards.forEach(card => {
    const categoryMatches = activeFilter === "todos" || card.dataset.category === activeFilter;
    const textMatches = card.dataset.search.includes(search);
    const favoriteMatches = !favoritesOnly || card.querySelector(".favorite").getAttribute("aria-pressed") === "true";
    const show = categoryMatches && textMatches && favoriteMatches;
    card.hidden = !show;
    if (show) visible++;
  });

  resultsLine.textContent = `Mostrando ${visible} ${visible === 1 ? "lugar" : "lugares"}`;
  emptyState.hidden = visible !== 0;
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    favoritesOnly = false;
    document.getElementById("showFavorites").textContent = "Ver favoritos";
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    updateRestaurants();
  });
});
searchInput.addEventListener("input", updateRestaurants);

// Guarda o quita restaurantes de favoritos y actualiza el contador.
function updateFavoritesText() {
  const total = cards.filter(card => card.querySelector(".favorite").getAttribute("aria-pressed") === "true").length;
  favoritesText.textContent = total === 0
    ? "Todavía no guardaste ningún lugar."
    : `Tenés ${total} ${total === 1 ? "lugar guardado" : "lugares guardados"}.`;
}
document.querySelectorAll(".favorite").forEach(button => {
  button.addEventListener("click", () => {
    const saved = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!saved));
    button.textContent = saved ? "♡" : "♥";
    updateFavoritesText();
    if (favoritesOnly) updateRestaurants();
  });
});

document.getElementById("showFavorites").addEventListener("click", event => {
  favoritesOnly = !favoritesOnly;
  event.currentTarget.textContent = favoritesOnly ? "Ver todos" : "Ver favoritos";
  updateRestaurants();
});

document.querySelectorAll("[data-jump-filter]").forEach(tile => {
  tile.addEventListener("click", () => {
    const category = tile.dataset.jumpFilter;
    activeFilter = category;
    favoritesOnly = false;
    searchInput.value = "";
    filterButtons.forEach(button => button.classList.toggle("active", button.dataset.filter === category));
    document.getElementById("showFavorites").textContent = "Ver favoritos";
    updateRestaurants();
    document.getElementById("lugares").scrollIntoView({ behavior: "smooth" });
  });
});

// Cambia entre modo claro y oscuro.
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkMode = document.body.classList.contains("dark");
  document.getElementById("themeToggle").textContent = darkMode ? "☀" : "☾";
});

// Menú desplegable para pantallas pequeñas.
document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("mainNav");
  const isOpen = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
  });
});

// Validación del formulario: muestra un mensaje en pantalla (no envía emails).
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const feedback = document.getElementById("formFeedback");

  if (!name || !email || !message) {
    feedback.textContent = "Completá todos los campos antes de enviar.";
    feedback.style.color = "#c9552b";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.textContent = "Ingresá un email válido.";
    feedback.style.color = "#c9552b";
    return;
  }
  feedback.textContent = `¡Gracias, ${name}! Tu recomendación quedó registrada en esta demostración.`;
  feedback.style.color = "";
  event.target.reset();
});

updateRestaurants();
updateFavoritesText();
