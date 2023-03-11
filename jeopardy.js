const clueCells = document.getElementsByClassName("clue");
const startButton = document.querySelector("#start-game");
const game = document.querySelector("#board");
const categories = 6;
const clues = 5;

//get 6 categories from a page offset randomly betweeen 1-200
async function getCategoryIds() {
  const offset = Math.floor(Math.random() * 200);
  const categoriesResult = await axios.get(
    `http://jservice.io/api/categories?count=${categories}&offset=${offset}`
  );
  return categoriesResult.data;
}
// get 5 clues from given category ID
async function getClues(id) {
  const cluesResult = await axios.get(
    `http://jservice.io/api/clues?category=${id}`
  );
  const cluesData = cluesResult.data.slice(0, clues).map((clue) => {
    return {
      answer: clue.answer,
      question: clue.question,
    };
  });
  return cluesData;
}
//set up, get categories, start game
async function setupAndStart() {
  game.innerText = "loading....";
  const categoriesData = [];
  const categoriesResult = await getCategoryIds();
  for (const category of categoriesResult) {
    const cluesData = await getClues(category.id);
    categoriesData.push({
      categoryId: category.id,
      categoryTitle: category.title,
      clues: cluesData,
    });
  }
  console.log("Data", categoriesData);
  makeHtmlTable(categoriesData);
}

//make and fill out HTMl table
function makeHtmlTable(categories) {
  game.innerText = "";
  makeHeaderRow(categories);
  makeClueRows(categories);
}
// make header row
function makeHeaderRow(categories) {
  const tRow = document.createElement("tr");
  game.append(tRow);
  categories.forEach((category, i) => {
    const headCell = document.createElement("th");
    headCell.classList.add("cell", "head");
    headCell.innerText = categories[i].categoryTitle;
    tRow.append(headCell);
  });
}
//make clue rows
function makeClueRows(categories) {
  for (let i = 0; i < clues; i++) {
    const cRow = document.createElement("tr");
    game.append(cRow);
    for (const category of categories) {
      const clueCell = document.createElement("td");
      clueCell.classList.add("cell", "clue");
      clueCell.innerText = "?????";
      clueCell.addEventListener("click", (e) =>
        handleClueClick(e, category.clues[i].question, category.clues[i].answer)
      );
      cRow.append(clueCell);
    }
  }
}

//handle clue clicks
function handleClueClick(e, q, a) {
  const target = e.target;
  if (target.innerText === a) {
    return;
  } else {
    target.innerText = target.innerText === q ? a : q;
  }
}
//add event listener to start button
startButton.addEventListener("click", setupAndStart);
