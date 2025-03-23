const path = window.location.pathname;

const html = `
  <nav id="nav">
    <a href="/" ${path === "/" ? 'class="selected"' : ''}>
      Home
    </a>
    <a href="/tic-tac-toe" ${path.includes("tic-tac-toe") ? 'class="selected"' : ''}]>
      Tic Tac Toe
    </a>
  </nav>
`

class Nav extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = html;
  }
}

customElements.define("wg-nav", Nav);
