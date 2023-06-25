const api = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});
const listCharacters = document.getElementById("list");
let nextUrl = null;
let prevUrl = null;
let page = 1;
let pages = 1;
const cardsPerPage = 6;
let response;
let statusColor = "";
let statusColorClass = "";
let statusText = "";

function getCharacters(url, name = "") {
  api
    .get(url)
    .then((response) => {
      const data = response.data;
      nextUrl = data.info.next;
      prevUrl = data.info.prev;
      const characters = data.results;

      if (name !== "") {
        response = `${url}?name=${name}`;
      } else {
        response = url;
      }

      render(characters);
    })
    .catch((err) => {
      alert(err);
    });
}

function searchCharacters(event) {
  event.preventDefault();
  const name = document.getElementById("search-bar").value;
  const url = name !== "" ? `/character/?name=${name}` : "/character";
  getCharacters(url);
}

function render(characters) {
  const paginatedCharacters = paginateCharacters(characters, page, cardsPerPage);

  listCharacters.innerHTML = "";
  let cardsCounter = 0;

  paginatedCharacters.forEach((character) => {
    if (character.status === "Alive") {
      statusColorClass = "green-status";
    } else if (character.status === "Dead") {
      statusColorClass = "red-status";
    } else {
      statusColorClass = "gray-status";
    }

    listCharacters.innerHTML += `
      <div class="card mt-4">
        <div class="card border-success size-card">
          <img class="img-fluid rounded mx-auto d-block" id="size-img" src="${character.image}" alt="${character.name}" />
          <div class="card-body ms-3">
            <a id="infoCharacter" href="#">
              <small class="card-title text-bg-dark">${character.name}</small>
            </a>
            <div class="status">
              <li class="statusColor ${statusColorClass}"></li>
              <small>
                <strong class="text-bg-dark">
                  ${statusText} ${character.species}
                </strong>
              </small>
            </div>
            <small style="color: white;">Última localização conhecida</small>

            <small>
              <strong class="text-bg-dark">${character.location.name}</strong>
            </small>

            <small style="color: white;">Visto a última vez em</small>

            <small>
              <strong class="text-bg-dark">Nome do episódio</strong>
            </small>
          </div>
        </div>
      </div>`;

    cardsCounter++;
  });
}

function paginateCharacters(characters, currentPage, cardsPerPage) {
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const paginatedCharacters = characters.slice(startIndex, endIndex);
  return paginatedCharacters;
}

function changePage(url) {
  if (url != null) {
    getCharacters(url);
  }
}

const buttonPrevPage = document.getElementById("prev");
buttonPrevPage.addEventListener("click", () => {
  changePage(prevUrl);
  console.log("clicou!")
});

const buttonNextPage = document.getElementById("next");
buttonNextPage.addEventListener("click", () => {
  changePage(nextUrl);
  console.log("deu certo")
});

getCharacters("/character");
