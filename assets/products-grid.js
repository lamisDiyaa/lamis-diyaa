document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("product-popup");
  const closeBtn = document.getElementById("close-popup");
  const title = document.getElementById("popup-title");
  const description = document.getElementById("popup-description");
  const price = document.getElementById("popup-price");
  const variantSelect = document.getElementById("variant-select");
  const sizeSelect = document.getElementById("size-select");
  const addToCartBtn = document.getElementById("add-to-cart");
  const image = document.getElementById("popup-image");
  const colorOptions = document.getElementById("color-options");
  const selectedColorText = document.getElementById("selected-color-text");
  let currentVariants = [];
  let selectedColor = "";
  let selectedSize = "";

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const variantsData = JSON.parse(
        card.dataset.variants.replace(/&quot;/g, '"')
      );
      currentVariants = variantsData;
      title.textContent = card.dataset.title;
      description.textContent = card.dataset.description
        .split(" ")
        .slice(0, 14)
        .join(" ");
      price.textContent = card.dataset.price;
      image.src = card.dataset.image;
      image.alt = card.dataset.title;
      colorOptions.innerHTML = "";
      sizeSelect.innerHTML = "";
      // to get colors
      const colors = [
        ...new Set(currentVariants.map((v) => v.option2).filter(Boolean)),
      ];

      colors.forEach((color) => {
        const colorDiv = document.createElement("div");
        const borderDiv = document.createElement("div");
        colorDiv.classList.add("color-box");

        borderDiv.style.setProperty(
          "width",
          "4.839285850524902px",
          "important"
        );
        borderDiv.style.setProperty("height", "39px", "important");
        borderDiv.style.setProperty(
          "border-left",
          ".5px solid black",
          "important"
        );
        borderDiv.style.setProperty(
          "border-right",
          ".5px solid black",
          "important"
        );
        borderDiv.style.setProperty(
          "background-color",
          `${color}`,
          "important"
        );
        borderDiv.style.setProperty("position", "absolute", "important");
        borderDiv.style.setProperty("left", "-.5px", "important");
        borderDiv.style.setProperty("top", "0", "important");
        colorDiv.style.setProperty("position", "relative", "important");
        colorDiv.style.setProperty("padding", "5px 15px", "important");
        colorDiv.style.setProperty("width", "135.5px", "important");
        colorDiv.style.setProperty("background-color", "#FFFFFF", "important");
        colorDiv.style.setProperty("cursor", "pointer", "important");
        colorDiv.title = color;
        colorDiv.textContent = color;
        colorDiv.dataset.color = color;

        // to select color
        colorDiv.addEventListener("click", () => {
          selectedColor = color;
          colorOptions.querySelectorAll(".color-box").forEach((div) => {
            div.style.setProperty("background-color", "#FFFFFF", "important");
            div.style.setProperty("color", "black", "important");
          });
          borderDiv.style.setProperty(
            "background-color",
            `${color}`,
            "important"
          );

          if (color === "white") {
            borderDiv.style.setProperty(
              "background-color",
              "white",
              "important"
            );
            colorDiv.style.setProperty("color", "black", "important");
          } else {
            colorDiv.style.setProperty("color", "white", "important");
          }
          colorDiv.style.setProperty("background-color", "black", "important");
        });
        if (selectedColorText) {
          selectedColorText.textContent = color;
        }
        colorDiv.appendChild(borderDiv);
        colorOptions.appendChild(colorDiv);
      });

      // size section
      sizeSelect.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.classList.add("valid");
      defaultOption.textContent = "  Choose your size";
      sizeSelect.appendChild(defaultOption);

      // to get sizes
      const sizes = [
        ...new Set(currentVariants.map((v) => v.option1).filter(Boolean)),
      ];

      sizes.forEach((size) => {
        const opt = document.createElement("option");
        opt.value = size;
        opt.textContent = size;
        sizeSelect.appendChild(opt);
      });
      sizeSelect.addEventListener("focus", function () {
        defaultOption.textContent = " ";
        defaultOption.style.setProperty("display", "none", "important");
      });

      sizeSelect.addEventListener("change", () => {
        selectedSize = sizeSelect.value;
      });

      sizeSelect.addEventListener("blur", function () {
        if (sizeSelect.value === "") {
          defaultOption.textContent = "Choose your size ";
          defaultOption.style.setProperty("display", "block", "important");
        }
      });
      popup.style.setProperty("display", "flex", "important");
    });
  });
  // close btn
  closeBtn.onclick = () =>
    popup.style.setProperty("display", "none", "important");
  window.onclick = (e) => {
    if (e.target === popup)
      popup.style.setProperty("display", "none", "important");
  };

  // add to cart
  addToCartBtn.onclick = () => {
    if (!selectedColor || !selectedSize) {
      return alert("Please select both color and size");
    }

    const selectedVariant = currentVariants.find(
      (v) => v.option1 === selectedSize && v.option2 === selectedColor
    );

    if (!selectedVariant) {
      return alert("This combination is not available.");
    }
    // select softWinterVariantId
    let softWinterVariantId = null;
    document.querySelectorAll(".product-card").forEach((card) => {
      if (card.dataset.title === "Soft Winter Jacket") {
        const variants = JSON.parse(
          card.dataset.variants.replace(/&quot;/g, '"')
        );
        const softVariant = variants.find(
          (v) => v.option1 === "Medium" && v.option2 === "Black"
        );
        if (softVariant) {
          softWinterVariantId = softVariant.id;
        }
      }
    });

    // add selected product
    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedVariant.id, quantity: 1 }),
    })
      .then(() => {
        // add Soft Winter Jacket if size is medium and color is black
        if (
          selectedColor === "Black" &&
          selectedSize === "Medium" &&
          softWinterVariantId
        ) {
          return fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: softWinterVariantId, quantity: 1 }),
          });
        }
      })
      .then(() => {
        alert(`Added to cart: ${selectedSize} / ${selectedColor}`);
        popup.style.display = "none";
      })
      .catch(() => {
        alert("Error adding to cart");
      });
  };
});
