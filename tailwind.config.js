/** Donkey Taxis — colours sampled from the logo (red car, yellow tail light)
 *  and the cover photo (silver car, black Guernsey plate, charcoal banner). */
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        // ACTION — logo car red (#fe3841), deepened so white text passes AA. Call, quote and links only.
        action: { DEFAULT: "#c81e28", hover: "#a8161f", soft: "#fde4e5" },
        // BRAND — the logo's own reds, used in drawings of the car only
        brand: { red: "#fe3841", shade: "#d1262c" },
        // HIGHLIGHT — the logo's yellow tail light (#fddd41). Board status text, markers, the one lit tile.
        highlight: { DEFAULT: "#fddd41", deep: "#e9bf12" },
        // BOARD — the charcoal of the banner (#373636) and the black number plate (#151313)
        board: { DEFAULT: "#2a2e33", line: "#3b4148", ink: "#f2f3ef", dim: "#9aa3ad" },
        // INK — text: the banner's blue-grey (#5c6973) taken almost to black
        ink: { DEFAULT: "#1c2025", soft: "#4f5b66" },
        // SURFACE — the silver paintwork (#b9c2cc) lifted to grounds; never pure white
        surface: { DEFAULT: "#edf0f3", paper: "#f8f9fa", silver: "#b9c2cc", line: "#d5dbe1" },
        // ACCENT — the donkey's coat in the logo; tiny illustration details only
        accent: { DEFAULT: "#7b6457" },
      },
      fontFamily: {
        // Display: Google Sans Flex with the ROND (roundness) axis up, echoing the rounded "Donkey Taxis" lettering on the logo car
        display: ['"Google Sans Flex Variable"', '"Arial Rounded MT Bold"', "system-ui", "sans-serif"],
        body: ['"Rethink Sans Variable"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      maxWidth: { page: "84rem" },
    },
  },
  plugins: [],
};
