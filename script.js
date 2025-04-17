//You can edit ALL of the code here

//SS- adding 2 new functions for level 200
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearchBar(allEpisodes);
  setupEpisodeSelector(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear existing content

  episodeList.forEach((episode) => {
    const container = document.createElement("div");
    container.className = "episode-card";

    const title = document.createElement("h3");
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    title.textContent = `${episode.name} - ${episodeCode}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = episode.name;

    const summary = document.createElement("div");
    summary.innerHTML = episode.summary;

    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.textContent = "More info on TVMaze";

    container.append(title, image, summary, link);
    rootElem.appendChild(container);
  });
}
// I added this function to set up the search bar functionality
function setupSearchBar(allEpisodes) {
  const searchInput = document.getElementById("search-input");
  const episodeCount = document.getElementById("episode-count");

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(function (episode) {
      const name = episode.name.toLowerCase();
      const summary = episode.summary.toLowerCase();
      return name.includes(searchTerm) || summary.includes(searchTerm);
    });

    makePageForEpisodes(filteredEpisodes);
    episodeCount.textContent = `Displaying ${filteredEpisodes.length} / ${allEpisodes.length} episodes`;
  });
}

// SS - I added this function to set up the episode selector functionality
function setupEpisodeSelector(allEpisodes) {
  const episodeSelector = document.getElementById("episode-selector");

  // SS - Populate the selector with episode options
  allEpisodes.forEach(function (episode, index) {
    const option = document.createElement("option");
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    option.value = index;
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  episodeSelector.addEventListener("change", function () {
    const selectedIndex = episodeSelector.value;
    if (selectedIndex === "") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = [allEpisodes[selectedIndex]];
      makePageForEpisodes(selectedEpisode);
    }
  });
}

window.onload = setup;
