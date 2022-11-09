const inputs = Array.from(document.querySelectorAll("input"));

for (const current of inputs) {
    current.addEventListener("input", () => {
        if (!current.validity.valid) {
            return current.classList.add("error");
        }

        current.classList.remove("error");
        let value = parseInt(current.value, current.dataset.base);
        // @NOTE(art): only base 10 can be negative
        if (value < 0) value *= -1;

        for (const input of inputs) {
            if (input === current) continue;

            input.classList.remove("error");
            // @NOTE(art): input is empty
            if (isNaN(value)) {
                console.assert(current.value.length === 0,
                               "value: '%s'", current.value);
                input.value = "";
            } else {
                input.value = value.toString(input.dataset.base);
            }
        }
    });
}

let type = "signed";
let size = 64;

const typeButtons = Array.from(document.querySelectorAll("button[data-type]"));
for (const tb of typeButtons) {
    if (tb.dataset.type === type) tb.classList.add("active");

    tb.addEventListener("click", () => {
        if (tb.classList.contains("active")) return;

        type = tb.dataset.type;
        clearActiveButton(typeButtons);
        tb.classList.add("active");
    });
}

const sizeButtons = Array.from(document.querySelectorAll("button[data-size]"));
for (const sb of sizeButtons) {
    if (Number(sb.dataset.size) === size) sb.classList.add("active");

    sb.addEventListener("click", () => {
        if (sb.classList.contains("active")) return;

        size = Number(sb.dataset.size);
        clearActiveButton(sizeButtons);
        sb.classList.add("active");
    });
}

const clearActiveButton = buttons => {
    for (const b of buttons) {
        b.classList.remove("active");
    }
}
