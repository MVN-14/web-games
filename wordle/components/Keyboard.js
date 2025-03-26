const backspaceChar = "⇽";
const buttonValues = [
  "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", backspaceChar
];


const keyboardTemplate = document.createElement("template")
keyboardTemplate.innerHTML = `
  <div>
  </div>

  <style>
    div {
      width: clamp(380px, 12.5em, 12.5em);
      margin: 0 auto;
    }

    button {
      padding: 1.5em 1em;
      font-size: 0.4em;
      font-weight: bold;
    }
    
.disabled {
  background: light-grey;
  color: grey;
};
  </style>
`

buttonValues.forEach((v) => {
  const button = document.createElement("button");
  button.innerText = v;

  keyboardTemplate.content.querySelector("div").append(button);
})


class Keyboard extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(keyboardTemplate.content.cloneNode(true));
    shadow.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => this.emitKeyPress(b.innerText));
    })

    document.addEventListener("keyup", (e) => {
      console.log(e.key);
      if (!buttonValues.includes(e.key.toUpperCase()) && e.key !== "Backspace") {
        return;
      }

      this.emitKeyPress(e.key.toUpperCase());
    })
  }

  static observedAttributes = ["disabled-keys"];
  set disabledKeys(keys) {
    this.setAttribute('disabled-keys', keys);
  }
  get disabledKeys() {
    this.getAttribute('disabled-keys');
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "disabled-keys") {
      Array.from(this.shadowRoot.querySelectorAll("button")).forEach(b => {
        if (newValue.includes(b.innerText)) {
          b.disabled = true;
          b.classList.add("disabled");
        }
      })
    }
  }

  emitKeyPress(key) {
    if (this.getAttribute('disabled-keys')?.includes(key)) {
      return;
    }

    const keyPressedEvent = new CustomEvent("wg-keyboard-key-pressed", {
      bubbles: true,
      cancelable: true,
      detail: key === backspaceChar ? "BACKSPACE" : key
    });

    return this.dispatchEvent(keyPressedEvent);
  }
}

customElements.define("wg-keyboard", Keyboard);
