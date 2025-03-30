const backspaceChar = "⇽";
const buttonValues = {
  row1: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  row2: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  row3: ["ENTER", "Z", "X", "C", "V", "B", "N", "M", backspaceChar]
};


const keyboardTemplate = document.createElement("template")
keyboardTemplate.innerHTML = `
  <div>
    <span id="row1"></span>
    <span id="row2"></span>
    <span id="row3"></span>
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

    span {
      display: block;
    }
    
.disabled {
  background: light-grey;
  color: grey;
};
  </style>
`

let rows = ["row1", "row2", "row3"]
rows.forEach(row => {
  buttonValues[row].forEach(v => {
    const button = document.createElement("button");
    button.innerText = v;
    keyboardTemplate.content.getElementById(row).append(button);
  })
});

/*
buttonValues.row1.forEach((v) => {
  const button = document.createElement("button");
  button.innerText = v;

  if (v <= "P") {
    keyboardTemplate.content.getElementById("row-1").append(button);
  }
})
*/

class Keyboard extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(keyboardTemplate.content.cloneNode(true));
    shadow.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => this.emitKeyPress(b.innerText));
    })

    document.addEventListener("keyup", (e) => {
      if (!getButtonValues().includes(e.key.toUpperCase()) && e.key !== "Backspace") {
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

const getButtonValues = () => {
  return [...buttonValues.row1, ...buttonValues.row2, ...buttonValues.row3];
};

customElements.define("wg-keyboard", Keyboard);
