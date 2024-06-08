const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");
const sort_wrapper = document.querySelector(".sort-wrapper");

// Serve a aggiungere degli eventi agli elementi HTML presenti nella pagina

inputElement.addEventListener("input", () => {
  handleInputChange(inputElement);
});
search_icon.addEventListener("click", handleSearchCloseOnClick);
sort_wrapper.addEventListener("click", handleSortIconOnClick);

// Serve a gestire i cambiamenti dell'input di ricerca. Quando e vuoto la funzione aggiunge una classe al'icona di chiusura della ricerca per renderla visibile; invece quando e vuoto, la funzione rimuove la classe per nascondere l'icona di chiusura 

function handleInputChange(inputElement) {
  const inputValue = inputElement.value;

  if (inputValue !== "") {
    document.querySelector("#search-close-icon").classList.add("search-close-icon-visible");
  } else {
    document.querySelector("#search-close-icon").classList.remove("search-close-icon-visible");
  }
}

// Gestisce l'evento di click sull'icona dealla barra di ricerca. Eseguendolo la funzione svuota il valore dell'input di ricerca e rimuove la classe che rende visibile l'icona di chiusura. Permetendo all'utente di azzerare la ricerca in modo rapido e intuitivo.

function handleSearchCloseOnClick() {
  document.querySelector("#search-input").value = "";
  document.querySelector("#search-close-icon").classList.remove("search-close-icon-visible");
}

// Serve a gestire il click sull'icona di ordinamento, aprendo o chiudendo il wrapper dei filtri e aggiugendo o rimuovendo un overlay sul bordo della pagina.

function handleSortIconOnClick() {
  document.querySelector(".filter-wrapper").classList.toggle("filter-wrapper-open");
  document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}
