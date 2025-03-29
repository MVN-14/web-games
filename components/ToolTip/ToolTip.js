const toolTipTemplate = document.createElement("template");

toolTipTemplate.innerHTML = `
<button id="tool-tip-btn" type="button">&#9432;</button>
<dialog>
  <button type="button" id="close-btn">X</button>
  <p id="description">
    <slot />
  </p>
</dialog>
<style>
  #tool-tip-btn {
    background: none;
    border: none;
    font-size: inherit;
    font-weight: normal;
    color: lightblue;
  }

  #tool-tip-btn:hover {
    cursor: pointer;
    color: white;
    font-weight: 900;
  }

  #close-btn {
    position: absolute;
    top: 3%;
    right: 3%;
    font-size: 1em;
    border: none;
    background: none;
  }

  #close-btn:hover {
    cursor: pointer;
    font-weight: 900;
  }

  #description {
    font-size: 0.5em;
    font-weight: normal;
    text-align: left;
    max-width: 800px;
  }
</style>
`

class ToolTip extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.append(toolTipTemplate.content.cloneNode(true));

    this.shadow.querySelector("#tool-tip-btn").addEventListener("click", () => {
      this.shadow.querySelector("dialog").showModal();
    })
    this.shadow.querySelector("#close-btn").addEventListener("click", () => {
      this.shadow.querySelector("dialog").close();
    })
  }
}

customElements.define("wg-tool-tip", ToolTip);
