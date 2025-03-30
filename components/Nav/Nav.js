const path = window.location.pathname;
const navTemplate = document.createElement("template");

navTemplate.innerHTML = `
  <nav id="nav">
    <a href="/" ${path === "/" ? 'class="selected"' : ''}>
      Home
    </a>
    <a href="/tic-tac-toe" ${path.includes("tic-tac-toe") ? 'class="selected"' : ''}]>
      Tic Tac Toe
    </a>
    <a href="/wordle" ${path.includes("wordle") ? 'class="selected"' : ''}]>
      Wordle
    </a>
    <a href="/snake" ${path.includes("snake") ? 'class="selected"' : ''}]>
      Snake
    </a>
  </nav>

  <style>
  nav {
    display: flex;
    gap: 10px;
    background-color: #ffffff;
    height: max-content;
  }
  
  a {
    font-size: 1.5rem;
    text-decoration: none;
    color: #1f1f1f;
    font-weight: bold;
    padding: 0.5rem;
  }

  .selected {
    background-color: grey;
  }
  </style>
`

class Nav extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(navTemplate.content.cloneNode(true))
  }
}

customElements.define("wg-nav", Nav);
