const API_KEY = "22e40eda03c997570e3dbc0c3a30edbc";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
let _fallback = "../previews/404img2.png";

var _embeds = [
  { sudo: "Vidora (No Ads)", name: "Vidora (No Ads)", movie: e => `https://vidora.su/movie/${e.tmdbId}?colour=dba4b2&autoplay=true`, series: e => `https://vidora.su/tv/${e.tmdbId}/${e.season}/${e.episode}?colour=dba4b2&autoplay=true` },
  { name: "embed.su", movie: e => `https://embed.su/embed/movie/${e.tmdbId}`, series: e => `https://embed.su/embed/tv/${e.tmdbId}/${e.season}/${e.episode}` },
  { name: "vidlink", movie: e => `https://vidlink.pro/movie/${e.tmdbId}?autoplay=false`, series: e => `https://vidlink.pro/tv/${e.tmdbId}/${e.season}/${e.episode}?autoplay=false` },
  { name: "vidsrc.rip (no ads)", movie: e => `https://vidsrc.rip/embed/movie/${e.tmdbId}`, series: e => `https://vidsrc.rip/embed/tv/${e.tmdbId}/${e.season}/${e.episode}` },
  { name: "vidbinge", movie: e => `https://vidbinge.dev/embed/movie/${e.tmdbId}`, series: e => `https://vidbinge.dev/embed/tv/${e.tmdbId}/${e.season}/${e.episode}` },
  { name: "moviesclub", movie: e => `https://moviesapi.club/movie/${e.tmdbId}`, series: e => `https://moviesapi.club/tv/${e.tmdbId}-${e.season}-${e.episode}` },
  { name: "vidsrc.cc", movie: e => `https://vidsrc.cc/v2/embed/movie/${e.tmdbId}`, series: e => `https://vidsrc.cc/v2/embed/tv/${e.tmdbId}/${e.season}/${e.episode}` },
  { name: "moviekex", movie: e => `https://moviekex.online/embed/movie/${e.tmdbId}`, series: e => `https://moviekex.online/embed/tv/${e.tmdbId}/${e.season}/${e.episode}` },
  { name: "vidsrc.vip", movie: e => `https://vidsrc.vip/embed/movie/${e.tmdbId}`, series: e => `https://vidsrc.vip/embed/tv/${e.tmdbId}/${e.season}/${e.episode}` },
  { name: "vidsrc.nl (no ads)", movie: e => `https://player.vidsrc.nl/embed/movie/${e.tmdbId}`, series: e => `https://player.vidsrc.nl/embed/tv/${e.tmdbId}/${e.season}/${e.episode}` },
  { name: "vidsrc.icu", movie: e => `https://vidsrc.icu/embed/movie/${e.tmdbId}`, series: e => `https://vidsrc.icu/embed/tv/${e.tmdbId}/${e.season}/${e.episode}` },
  { name: "autoembed", movie: e => `https://player.autoembed.cc/embed/movie/${e.tmdbId}?server=1`, series: e => `https://player.autoembed.cc/embed/tv/${e.tmdbId}/${e.season}/${e.episode}?server=1` },
  { name: "vidsrc.xyz", movie: e => `https://vidsrc.xyz/embed/movie?tmdb=${e.tmdbId}`, series: e => `https://vidsrc.xyz/embed/tv?tmdb=${e.tmdbId}&season=${e.season}&episode=${e.episode}` },
  { name: "123embed", movie: e => `https://play2.123embed.net/movie/${e.tmdbId}`, series: e => `https://play2.123embed.net/tv/${e.tmdbId}/${e.season}/${e.episode}` }
].filter(e => !0 !== e.disabled);

if(localStorage.getItem("adfree") === "y") {
  _embeds = _embeds.filter(e => (e.sudo || e.name).includes("(no ads)"))
                   .map(e => ({ ...e, sudo: (e.sudo || e.name).replace("(no ads)", "").trim() }));
}

async function getMovies(query, type) {
  if (!query) return [];
  try {
    const endpoint = type === "movie" ? "movie" : "tv";
    const res = await fetch(`${API_URL}/search/${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results || [];
  } catch(e) { console.error(e); return []; }
}

function loadEmbeds(t) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const closeBtn = document.createElement("button");
  closeBtn.id = "close-button";
  closeBtn.textContent = "Close";
  closeBtn.onclick = () => document.body.removeChild(modal);
  modal.appendChild(closeBtn);

  const select = document.createElement("select");
  _embeds.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.name;
    opt.text = e.sudo || e.name;
    select.add(opt);
  });
  modal.appendChild(select);

  const player = document.createElement("div");
  player.classList.add("vaplayer");
  modal.appendChild(player);

  function updatePlayer(embed) {
    player.innerHTML = `<iframe src="${t.type==='movie'?embed.movie(t):embed.series(t)}" frameborder="0" allowfullscreen></iframe>`;
  }

  select.onchange = () => {
    const e = _embeds.find(e => e.name === select.value);
    updatePlayer(e);
  };
  updatePlayer(_embeds[0]);

  document.body.appendChild(modal);
}

async function displayMoviesWithEmbeds(query, type) {
  const results = await getMovies(query, type);
  const main = document.querySelector("main");
  main.innerHTML = '';
  if(!results.length){ main.innerHTML = "<p>No results found</p>"; return; }

  results.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("movie");

    const img = document.createElement("img");
    img.src = item.poster_path ? IMAGE_BASE_URL+item.poster_path : _fallback;
    div.appendChild(img);

    const title = document.createElement("h2");
    title.textContent = item.title || item.name;
    div.appendChild(title);

    const btn = document.createElement("button");
    btn.textContent = "Watch Now";
    btn.onclick = () => loadEmbeds({type, tmdbId:item.id, title:item.title||item.name, poster:item.poster_path, season:1, episode:1});
    div.appendChild(btn);

    main.appendChild(div);
  });
}

document.getElementById("discover").addEventListener("click", () => {
  const query = document.getElementById("search").value.trim();
  const type = document.getElementById("type").value;
  if(query) displayMoviesWithEmbeds(query,type);
  else alert("Please enter a search term.");
});
