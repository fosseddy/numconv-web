const inputs = [
    document.querySelector("#binary"),
    document.querySelector("#decimal"),
    document.querySelector("#hex"),
    document.querySelector("#octal")
];

for (const current of inputs) {
    current.addEventListener("input", () => {
        if (!current.validity.valid) {
            return current.classList.add("error");
        }

        current.classList.remove("error");
        let value = parseInt(current.value, current.dataset.base);
        if (value < 0) value *= -1;

        for (const input of inputs) {
            if (input === current) continue;

            input.classList.remove("error");

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
