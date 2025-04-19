//
// You can edit ALL of the code here

// SS - Adding 2 new functions for level 200
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearchBar(allEpisodes);
  setupEpisodeSelector(allEpisodes);
  setupShowAllButton(allEpisodes); // SS - Added function to show all episodes
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

// SS - Added this function to set up the search bar functionality
function setupSearchBar(allEpisodes) {
  const searchInput = document.getElementById("search-input");
  const episodeCount = document.getElementById("episode-count");
  //SS - Adding show all episodes button
  const showAllButton = document.getElementById("show-all-button");

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(function (episode) {
      const name = episode.name.toLowerCase();
      const summary = episode.summary.toLowerCase();
      return name.includes(searchTerm) || summary.includes(searchTerm);
    });

    makePageForEpisodes(filteredEpisodes);
    episodeCount.textContent = `Displaying ${filteredEpisodes.length} / ${allEpisodes.length} episodes`;
    // SS - Show the "Show All Episodes" button if the search results are not all episodes
    showAllButton.style.display =
      filteredEpisodes.length < allEpisodes.length ? "block" : "none";
  });
}

// SS - Added this function to set up the episode selector functionality
function setupEpisodeSelector(allEpisodes) {
  const episodeSelector = document.getElementById("episode-selector");
  //SS - Adding show all episodes button
  const showAllButton = document.getElementById("show-all-button");
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
      // SS - Show the "Show All Episodes" button when an individual episode is selected
      showAllButton.style.display = "block";
    }
  });
}

// SS - Added this function to display all episodes when requested
function setupShowAllButton(allEpisodes) {
  const showAllButton = document.getElementById("show-all-button");

  showAllButton.addEventListener("click", function () {
    makePageForEpisodes(allEpisodes);
    showAllButton.style.display = "none"; // Hide the "Show All Episodes" button after it's clicked
  });
}

window.onload = setup;
