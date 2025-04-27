// ========== Global Variables ==========
let allEpisodes = [];
let currentEpisodes = [];
let allShows = [];
const fetchedShows = new Map();

// ========== Utility Functions ==========
function formatEpisodeCode(season, number) {
  const seasonStr = season.toString().padStart(2, "0");
  const numberStr = number.toString().padStart(2, "0");
  return `S${seasonStr}E${numberStr}`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const title = document.createElement("h3");
    title.textContent = `${formatEpisodeCode(
      episode.season,
      episode.number
    )} - ${episode.name}`;

    const img = document.createElement("img");
    img.src = episode.image?.medium || "";
    img.alt = episode.name;

    const summary = document.createElement("div");
    summary.innerHTML = episode.summary || "";

    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.textContent = "More Info";

    card.append(title, img, summary, link);
    rootElem.appendChild(card);
  });
}

// ========== Event Handlers ==========
function onSearchInput(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filtered = currentEpisodes.filter((ep) => {
    return (
      ep.name.toLowerCase().includes(searchTerm) ||
      (ep.summary && ep.summary.toLowerCase().includes(searchTerm))
    );
  });
  makePageForEpisodes(filtered);
  document.getElementById(
    "show-count"
  ).textContent = `Displaying ${filtered.length} / ${currentEpisodes.length} episodes`;
  document.getElementById("dynamic-count-message").textContent = "";
}

function onEpisodeSelect(event) {
  const selectedValue = event.target.value;

  if (!selectedValue || selectedValue === "all") {
    makePageForEpisodes(currentEpisodes);
    document.getElementById(
      "show-count"
    ).textContent = `Displaying ${currentEpisodes.length} / ${currentEpisodes.length} episodes`;
    document.getElementById("dynamic-count-message").textContent = "";
    return;
  }

  const selectedEpisode = currentEpisodes.find(
    (ep) => formatEpisodeCode(ep.season, ep.number) === selectedValue
  );
  makePageForEpisodes([selectedEpisode]);
  document.getElementById(
    "show-count"
  ).textContent = `Displaying 1 / ${currentEpisodes.length} episodes`;
  document.getElementById("dynamic-count-message").textContent = "";
}

function onShowSelect(event) {
  const showId = event.target.value;
  if (!showId) return;

  if (fetchedShows.has(showId)) {
    currentEpisodes = fetchedShows.get(showId);
    updateUIWithEpisodes(currentEpisodes);
  } else {
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => response.json())
      .then((data) => {
        fetchedShows.set(showId, data); // cache it
        currentEpisodes = data;
        updateUIWithEpisodes(currentEpisodes);
      })
      .catch((error) => {
        console.error("Fetch error (episodes):", error);
        alert("Error loading episodes. Please try again later.");
      });
  }
}

function onShowAllClick() {
  document.getElementById("show-selector").value = "";
  renderAllShows();
}

// ========== UI Update Functions ==========
function updateUIWithEpisodes(episodes) {
  allEpisodes = episodes;
  makePageForEpisodes(episodes);
  populateEpisodeSelector(episodes);

  document.getElementById(
    "show-count"
  ).textContent = `Displaying ${episodes.length} / ${episodes.length} episodes`;
  document.getElementById("dynamic-count-message").textContent = "";

  document.getElementById("show-all-button").style.display = "block";
}

function populateEpisodeSelector(episodes) {
  const selector = document.getElementById("episode-selector");
  selector.innerHTML = `<option value="all">Show All Episodes</option>`;

  episodes.forEach((ep) => {
    const option = document.createElement("option");
    option.value = formatEpisodeCode(ep.season, ep.number);
    option.textContent = `${formatEpisodeCode(ep.season, ep.number)} - ${
      ep.name
    }`;
    selector.appendChild(option);
  });
}

// ========== Show Display ==========
function renderAllShows(shows = allShows) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const title = document.createElement("h2");
    title.textContent = show.name;
    title.style.cursor = "pointer";
    title.addEventListener("click", () => {
      document.getElementById("show-selector").value = show.id;
      onShowSelect({ target: { value: show.id } });
    });

    const img = document.createElement("img");
    img.src = show.image?.medium || "";
    img.alt = show.name;

    const summary = document.createElement("div");
    summary.innerHTML = show.summary || "";

    const extraDetails = document.createElement("p");
    extraDetails.innerHTML = `
      <strong>Genres:</strong> ${show.genres.join(", ")}<br/>
      <strong>Status:</strong> ${show.status}<br/>
      <strong>Rating:</strong> ${show.rating?.average || "N/A"}<br/>
      <strong>Runtime:</strong> ${show.runtime ? show.runtime + " min" : "N/A"}
    `;

    const link = document.createElement("a");
    link.href = show.url;
    link.target = "_blank";
    link.textContent = "More Info";

    card.append(title, img, summary, extraDetails, link);
    rootElem.appendChild(card);
  });

  document.getElementById("show-count").textContent = "";
  document.getElementById(
    "dynamic-count-message"
  ).textContent = `Showing ${shows.length} shows`;

  document.getElementById(
    "episode-selector"
  ).innerHTML = `<option value="">Select an episode</option>`;
  document.getElementById("show-all-button").style.display = "none";
}

// ========== Initial Load ==========
function setup() {
  document
    .getElementById("search-input")
    .addEventListener("input", onSearchInput);
  document
    .getElementById("episode-selector")
    .addEventListener("change", onEpisodeSelect);
  document
    .getElementById("show-selector")
    .addEventListener("change", onShowSelect);
  document
    .getElementById("show-all-button")
    .addEventListener("click", onShowAllClick);
  document
    .getElementById("show-search-input")
    .addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allShows.filter(
        (show) =>
          show.name.toLowerCase().includes(term) ||
          show.genres.join(" ").toLowerCase().includes(term) ||
          (show.summary || "").toLowerCase().includes(term)
      );
      renderAllShows(filtered);
    });

  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((shows) => {
      allShows = shows.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
      populateShowSelector(allShows);
      renderAllShows();
    })
    .catch((error) => {
      console.error("Fetch error (shows):", error);
      alert("Error loading shows. Please try again later.");
    });
}

function populateShowSelector(shows) {
  const showSelector = document.getElementById("show-selector");
  showSelector.innerHTML = `<option value="">Select a show</option>`;
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

window.addEventListener("load", setup);
