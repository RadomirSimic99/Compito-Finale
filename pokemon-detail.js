let currentPokemonId = null;

//Serve in poche parole per caricare informazioni di unPokèmon specifico sulla pagina web, controllando che l' id sia valido e gestendo il caso in cui non lo sia 

document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 649;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  currentPokemonId = id;
  loadPokemon(id);
});

// La funzione fa una chiamata asincrona a due endpoint dell'API per ottenere i dettagli del Pokèmon e le informazioni sulla sua specie. Una volta ottenuti i dati la funzione li visualizza sulla pagina web e aggiora il contenuto in base all'id del Pokèmon. 


async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()
      ),
    ]);

    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilitiesWrapper.innerHTML = "";

    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;

      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) => document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== 151) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }

      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.error("An error occured while fetching Pokemon data:", error);
    return false;
  }
}

//La funzione async serve a cambiare il Pokèmon visualizzato sulla pagina tramite il suo id. Invece la costante typeColors contiene  una mappatura dei colori associati ai diversi tipi di Pokèmon

async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  dark: "#EE99AC",
};

//Semplicemnte serve per applicare rapidamente modifiche di stile a più elementi simultanaemante 

function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

//Questa funzione converte un colore esadecimale in formato RGBA. Prende in input un colore esadecimale nella forma "#RRGGBB" e restituisce una stringa RGBA nella forma "R, G, B".

function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

// La funzione serve per impostare il colore dello sfondo e altre proprietà visive di alcuni elementi HTML 

function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);

  setElementStyles(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    color
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );

  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}

// Questa funzione serve a prendere una stringa in input e restituire la stessa stringa con la prima lettera convertita in maiuscolo e le restanti in minuscolo 

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Semplifica il processo di creazione di nuovi elementi HTML e di aggiunta di essi al DOM

function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

//In generale serve per mostare in dettaglio le informazioni di un Pokèmon sulla pagina web

function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  document.querySelector("title").textContent = capitalizePokemonName;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;

  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;

  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });

  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;

  const abilitiesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  const statNameMapping = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });

    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });

  setTypeBackgroundColor(pokemon);
}

// Serve per estarre il testo in descrittivo in inglese di una determianata specie di Pokèmon dalla sua scheda di informazioni. Di cui controlla le voci di testo descrittve nella scheda delle informazioni della specie e restituisce il testo in inglese se presente, altrimenti restituisce una stringa vuota.

function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}
