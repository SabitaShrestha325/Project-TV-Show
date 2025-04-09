//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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

window.onload = setup;
