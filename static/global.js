console.log("IT's ALIVE");
const ARE_WE_HOME = document.documentElement.classList.contains("home");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: "./", title: "Home" },
  { url: "'/projects", title: "Projects" },
  { url: "/contact", title: "Contact Info" },
  { url: "/resume", title: "CV" },
  {
    url: "https://github.com/therealnalm",
    title: "Github",
  },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

document.body.insertAdjacentHTML(
  "afterbegin",
  `
	<label class='color-scheme'>
		Theme:
		<select>
			<option value = "dark">Dark</option>
            <option value = "light">Light</option>
            <option value = "light dark">Automatic</option>
		</select>
	</label>`
);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
    console.log("hit");
  }
  if (a.host !== location.host) {
    a.target = "blank";
  }
  nav.append(a);
}
console.log("we at: " + location.pathname);

let select = document.querySelector("select");

select.addEventListener("input", function (event) {
  document.documentElement.style.setProperty(
    "color-scheme",
    event.target.value
  );
  localStorage.colorScheme = event.target.value;
});

if (localStorage.colorScheme) {
  document.documentElement.style.setProperty(
    "color-scheme",
    localStorage.colorScheme
  );
  select.value = localStorage.colorScheme;
}
