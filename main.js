const state = {
    type: "unsigned",
    size: 8
};

const bin = document.querySelector("#binary");
const dec = document.querySelector("#decimal");
const hex = document.querySelector("#hex");
const oct = document.querySelector("#octal");

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

        updateValues();
    });
}

const typeButtons = Array.from(document.querySelectorAll("button[data-type]"));
for (const tb of typeButtons) {
    if (tb.dataset.type === state.type) tb.classList.add("active");

    tb.addEventListener("click", () => {
        if (tb.classList.contains("active")) return;

        state.type = tb.dataset.type;
        clearActiveButton(typeButtons);
        tb.classList.add("active");

        updateValues();
    });
}

const sizeButtons = Array.from(document.querySelectorAll("button[data-size]"));
for (const sb of sizeButtons) {
    if (Number(sb.dataset.size) === state.size) sb.classList.add("active");

    sb.addEventListener("click", () => {
        if (sb.classList.contains("active")) return;

        state.size = Number(sb.dataset.size);
        clearActiveButton(sizeButtons);
        sb.classList.add("active");

        updateValues();
    });
}

const updateValues = () => {
    let bval = inputs.find(i => Number(i.dataset.base) === 2).value;
    bval = roundLen(bval, state.size);

    let hval = inputs.find(i => Number(i.dataset.base) === 16).value;
    hval = roundLen(hval, state.size / 4);

    let dval = parseInt(bval, 2);

    let oval = dval.toString(8);
    oval = roundLen(oval, Math.floor(state.size / 2.6));

    if (state.type === "signed") {
        if (bval[0] === "1") {
            dval = 2**state.size / 2 - dval;
        }
    }

    if (state.size > 8) {
        bval = separate(bval, 8);
    } else {
        bval = separate(bval, 4);
    }

    hval = separate(hval, 2)
    oval = separate(oval, 3);
    dval = separateDecimal(dval);

    bin.textContent = bval;
    dec.textContent = dval;
    hex.textContent = hval;
    oct.textContent = oval;
}

const clearActiveButton = buttons => {
    for (const b of buttons) {
        b.classList.remove("active");
    }
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
