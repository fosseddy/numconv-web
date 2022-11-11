const inputs = Array.from(document.querySelectorAll("input"));

const info = {
    binary: document.querySelector("#info-binary"),
    unsigned: document.querySelector("#info-unsigned"),
    signed: document.querySelector("#info-signed"),
    hex: document.querySelector("#info-hex"),
    octal: document.querySelector("#info-octal")
};

const state = {
    size: 32,
    lastUsedInput: inputs[0]
};

for (const current of inputs) {
    current.addEventListener("input", () => {
        state.lastUsedInput = current;

        if (!current.validity.valid) {
            return current.classList.add("error");
        }

        let value = parseInt(current.value, current.dataset.base);

        if (!isNaN(value)) {
            if (current.getAttribute("id") === "signed") {
                if (value > 2**state.size / 2 - 1 ||
                    value < -1 * 2**state.size / 2
                ) {
                    return current.classList.add("error");
                }
                if (value < 0) value += 2**state.size;
            } else {
                if (value > 2**state.size - 1) {
                    return current.classList.add("error");
                }
            }
        }

        current.classList.remove("error");

        for (const input of inputs) {
            if (input === current) continue;

            input.classList.remove("error");
            // @NOTE(art): input is empty
            if (isNaN(value)) {
                console.assert(
                    current.value.length === 0,
                    "value: '%s'",
                    current.value
                );
                input.value = "";
            } else {
                if (input.getAttribute("id") === "signed" &&
                    value > 2**state.size / 2
                ) {
                     input.value = value - 2**state.size;
                } else {
                    input.value = value.toString(input.dataset.base);
                }
            }
        }

        updateInfo();
    });
}

const buttons = Array.from(document.querySelectorAll("button[data-size]"));
for (const b of buttons) {
    if (Number(b.dataset.size) === state.size) b.classList.add("active");

    b.addEventListener("click", () => {
        if (b.classList.contains("active")) return;

        for (const bb of buttons) {
            bb.classList.remove("active");
        }

        state.size = Number(b.dataset.size);
        b.classList.add("active");

        // @NOTE(art): update inputs after size change
        state.lastUsedInput.dispatchEvent(new Event("input"));
    });
}

const updateInfo = () => {
    let size = state.size;
    if (size > 32) size = 64;

    let bval = inputs.find(i => Number(i.dataset.base) === 2).value;
    bval = roundLen(bval, size);

    let hval = inputs.find(i => Number(i.dataset.base) === 16).value;
    hval = roundLen(hval, size / 4);

    let uval = inputs.find(i => i.getAttribute("id") === "unsigned").value;
    let sval = inputs.find(i => i.getAttribute("id") === "signed").value;

    let oval = inputs.find(i => Number(i.dataset.base) === 8).value;
    oval = roundLen(oval, Math.floor(size / 2.6));

    if (size > 8) {
        bval = separate(bval, 8);
    } else {
        bval = separate(bval, 4);
    }

    hval = separate(hval, 2)
    oval = separate(oval, 3);
    uval = separateDecimal(uval);
    sval = separateDecimal(sval);

    info.binary.textContent = bval;
    info.unsigned.textContent = uval;
    info.signed.textContent = sval;
    info.hex.textContent = hval;
    info.octal.textContent = oval;
}

const roundLen = (s, n) => {
    return s.length > n
        ? s.slice(-n)
        : s.padStart(n, "0");
}

const separate = (s, n) => {
    if (s.length <= n) return s;

    const tmp = [];
    for (let i = 0; i < s.length; ++i) {
        if (i % n === 0 && i > 0) tmp.push(" ");
        tmp.push(s[i]);
    }

    return tmp.join("");
}

const separateDecimal = d => {
    const isNeg = d < 0;
    d = String(d);

    if (isNeg) d = d.slice(1);

    d = separate([...d].reverse(), 3);
    d = [...d].reverse().join("");

    if (isNeg) d = "-" + d;

    return d;
}

updateInfo();
