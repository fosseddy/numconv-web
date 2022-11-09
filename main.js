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

const buttons = Array.from(document.querySelectorAll("button"));
for (const b of buttons) {
    if (b.dataset.type === type) b.classList.add("active");
    if (Number(b.dataset.size) === size) b.classList.add("active");

    b.addEventListener("click", () => {
        if (b.dataset.type) {
            if (b.classList.contains("active")) return;
            type = b.dataset.type;
        }

        if (b.dataset.size) {
            if (b.classList.contains("active")) return;
            size = Number(b.dataset.size);
        }

        for (const bb of buttons) {
            bb.classList.remove("active");
            if (bb.dataset.type === type) bb.classList.add("active");
            if (Number(bb.dataset.size) === size) bb.classList.add("active");
        }
    });
}
