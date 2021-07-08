let detailA = null;
let detailB = null;
let priceA = null;
let priceB = null;
let floorA = null;
let floorB = null;
let landA = null;
let landB = null;

function compare(valueA, valueB, row, order) {
  divA = document.getElementById("detailA__" + row);
  divB = document.getElementById("detailB__" + row);
  if (valueA * order > valueB * order) {
    divA.style.backgroundColor = "rgb(255, 129, 129)";
    divB.style.backgroundColor = "rgb(129, 255, 161)";
  } else {
    divA.style.backgroundColor = "rgb(129, 255, 161)";
    divB.style.backgroundColor = "rgb(255, 129, 129)";
  }
}
function handleComparison() {
  compare(priceA, priceB, "price", 1);
  compare(floorA, floorB, "floor", -1);
  compare(landA, landB, "land", -1);
}

function handleClick(id) {
  letter = "";
  if (!detailA && id != detailB) {
    detailA = id;
    loadDetail(id, "detailA");
    letter = "A";
  } else if (!detailB && id != detailA) {
    detailB = id;
    loadDetail(id, "detailB");
    letter = "B";
  } else if (id == detailA) {
    document
      .getElementById("detailA")
      .removeChild(document.getElementById("detailA").firstChild);
    detailA = null;
    document
      .getElementById(id)
      .removeChild(document.getElementById(id).lastChild);
  } else if (id == detailB) {
    document
      .getElementById("detailB")
      .removeChild(document.getElementById("detailB").firstChild);
    detailB = null;
    document
      .getElementById(id)
      .removeChild(document.getElementById(id).lastChild);
  } else return;

  document.getElementById("image" + id).classList.toggle("border");
  const text = document.createElement("div");
  text.innerHTML = letter;
  text.className = "centered";
  //   text.onclick = handleClick(id);
  document.getElementById(id).appendChild(text);

  if (detailA && detailB) {
    setTimeout(handleComparison, 500);
  }
}

function appendRow(leftSpan, rightSpan, row, detail, DOM) {
  const DOM_row = document.createElement("div");
  DOM_row.className = "div_padding";
  DOM_row_left = document.createElement("span");
  DOM_row_left.innerHTML = leftSpan;
  DOM_row_right = document.createElement("span");
  DOM_row_right.innerHTML = rightSpan;
  DOM_row_right.className = "align_right";
  DOM_row.id = detail + "__" + row;
  DOM_row.appendChild(DOM_row_left);
  DOM_row.appendChild(DOM_row_right);
  DOM.appendChild(DOM_row);
}

async function loadDetail(id, detail) {
  let response = await fetch(
    "https://estate-comparison.codeboot.cz/detail.php?id=" + id
  );

  if (response.ok) {
    let estate = await response.json();

    const DOM = document.createElement("div");
    DOM.className = "col";
    DOM.style.border = "1px solid grey";
    DOM.style.padding = "1rem";
    DOM.style.margin = "0.5rem";
    DOM.style.height = "100%";

    const DOM_img = document.createElement("img");
    DOM_img.src = estate.images[0];
    DOM_img.className = "detail_image";
    DOM.appendChild(DOM_img);

    appendRow(estate.name, "", "name", detail, DOM);
    appendRow("Price", estate.prize_czk + " Kč", "price", detail, DOM);
    appendRow("Locality", estate.locality, "locality", detail, DOM);
    appendRow("Floor area", estate.building_area + " m2", "floor", detail, DOM);
    appendRow("Land area", estate.land_area + " m2", "land", detail, DOM);

    if (estate.company_logo) {
      const DOM_logo = document.createElement("img");
      DOM_logo.src = estate.company_logo;
      DOM_logo.alt = "";
      DOM_logo.style.width = "8rem";
      DOM.appendChild(DOM_logo);
    }

    if (document.getElementById(detail).firstChild)
      document
        .getElementById(detail)
        .replaceChild(DOM, document.getElementById(detail).firstChild);
    else document.getElementById(detail).appendChild(DOM);

    if (detail === "detailA") priceA = estate.prize_czk;
    else priceB = estate.prize_czk;

    if (detail === "detailA") floorA = estate.building_area;
    else floorB = estate.building_area;

    if (detail === "detailA") landA = estate.land_area;
    else landB = estate.land_area;
    
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

async function loadEstates() {
  let response = await fetch("https://estate-comparison.codeboot.cz/list.php");

  if (response.ok) {
    let json = await response.json();

    json.map((estate, index) => {
      const container = document.createElement("div");
      container.className = "container";
      const DOM_img = document.createElement("img");
      DOM_img.src = estate.images[0];
      DOM_img.className = "preview_image";
      DOM_img.onclick = () => {
        handleClick(estate.id);
      };
      DOM_img.id = "image" + estate.id;
      container.id = estate.id;
      container.appendChild(DOM_img);
      document.getElementById("list").appendChild(container);
    });
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

loadEstates();
