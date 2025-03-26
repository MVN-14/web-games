const gameContainerTemplate = document.createElement("template");

gameContainerTemplate.innerHTML = `
  <section>
    <h1>
      <slot name="title" />
    </h1>

    <div>
      <slot name="container" />
    </div>
  </section>

  <style>
    section {
      width: 100%;
      text-align: center;

      h1 {
        font-size: 2.5rem;
        padding-top: 2.5rem;
      }

      div {
        background: grey;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(1em, 5vw, 2em);
        margin-bottom: 6em;
        padding: 1em;
      }
    }
  </style>
`;

class GameContainer extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(gameContainerTemplate.content.cloneNode(true));
  }
}

customElements.define("wg-game-container", GameContainer);
