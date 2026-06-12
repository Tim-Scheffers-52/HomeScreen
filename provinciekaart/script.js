const svgNS = "http://www.w3.org/2000/svg";
const markersLayer = document.querySelector("#markers");
const labelsLayer = document.querySelector("#labels");

const provinces = [
  { nr: 1, name: "Drenthe", x: 724, y: 245, labelX: 715, labelY: 292 },
  { nr: 2, name: "Flevoland", x: 508, y: 388, labelX: 520, labelY: 438 },
  { nr: 3, name: "Friesland", x: 559, y: 177, labelX: 558, labelY: 226 },
  { nr: 4, name: "Gelderland", x: 573, y: 482, labelX: 630, labelY: 520 },
  { nr: 5, name: "Groningen", x: 735, y: 111, labelX: 735, labelY: 158 },
  { nr: 6, name: "Limburg", x: 582, y: 769, labelX: 525, labelY: 730 },
  { nr: 7, name: "Noord-Brabant", x: 447, y: 658, labelX: 455, labelY: 710 },
  { nr: 8, name: "Noord-Holland", x: 374, y: 322, labelX: 315, labelY: 370 },
  { nr: 9, name: "Overijssel", x: 685, y: 387, labelX: 690, labelY: 437 },
  { nr: 10, name: "Utrecht", x: 443, y: 499, labelX: 385, labelY: 545 },
  { nr: 11, name: "Zeeland", x: 162, y: 677, labelX: 215, labelY: 722 },
  { nr: 12, name: "Zuid-Holland", x: 308, y: 517, labelX: 315, labelY: 568 }
];

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

function makeMarker(province) {
  const group = svgEl("g", {
    class: "marker",
    tabindex: "0",
    role: "button",
    "aria-label": `Toon of verberg ${province.name}`,
    "data-name": province.name,
    transform: `translate(${province.x} ${province.y})`
  });

  group.append(
    svgEl("circle", { class: "hit", r: 30 }),
    svgEl("circle", { class: "outer", r: 22 }),
    svgEl("circle", { class: "inner", r: 16 }),
    svgEl("text", { x: 0, y: 1 })
  );
  group.querySelector("text").textContent = province.nr;

  group.addEventListener("click", () => toggleProvince(province.name));
  group.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleProvince(province.name);
    }
  });
  return group;
}

function makeLabel(province) {
  const width = Math.max(118, province.name.length * 13 + 30);
  const group = svgEl("g", { "data-name": province.name });
  group.append(
    svgEl("rect", {
      x: province.labelX - width / 2,
      y: province.labelY - 22,
      width,
      height: 44,
      rx: 18,
      class: "label-bg"
    }),
    svgEl("text", {
      x: province.labelX,
      y: province.labelY + 1,
      class: "label-text"
    })
  );
  group.querySelector("text").textContent = province.name;
  return group;
}

function toggleProvince(name) {
  const province = provinces.find(p => p.name === name);
  const marker = markersLayer.querySelector(`[data-name="${name}"]`);
  const existing = labelsLayer.querySelector(`[data-name="${name}"]`);
  marker.classList.toggle("active");
  if (existing) existing.remove();
  else labelsLayer.appendChild(makeLabel(province));
}

provinces.forEach(province => markersLayer.appendChild(makeMarker(province)));

document.querySelector("#reset").addEventListener("click", () => {
  labelsLayer.innerHTML = "";
  markersLayer.querySelectorAll(".marker").forEach(marker => marker.classList.remove("active"));
});
