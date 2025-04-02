const gameContainerTemplate = document.createElement("template");

gameContainerTemplate.innerHTML = `
  <section>
    <h1>
      <slot name="title" />
    </h1>
    <slot></slot>
    <div id="wrapper">
      <slot name="container"></slot>
      <slot name="canvas"></slot>
    </div>
  </section>

  <style>
    section {
      width: 100%;
      text-align: center;

      h1 {
        font-size: 2.5rem;
      }

      #wrapper {
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(1em, 5vw, 2em);
        margin-bottom: 2em;
        
        slot[name="container"]::slotted(*) {
          width: 100%;
          max-width: 800px;
          background: grey;
          padding: 1em;
        }

        slot[name="canvas"]::slotted(*) {
          padding: 0;
          margin: 0;
          height: 100%;
        }
      }

      @media only screen and (max-width: 600px) {
        h1 {
          font-size: 1.5em;
        }

        slot[name="container"]::slotted(*) {
          padding: 1em 0 !important;
        }
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
