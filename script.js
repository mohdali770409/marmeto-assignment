const API_URL =
  "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";
let selectedColorId = "Yellow";
let selectedSize = "small";
let productName;
const fetchData = async () => {
  try {
    const res = await fetch(API_URL);
    if (res) {
      const { product } = await res.json();
      document.querySelector(".product-vendor").textContent = product.vendor;
      document.querySelector(".product-title").textContent = product.title;
      const priceNumber = Number(product.price.replace("$", ""));
      const originalPrice = Number(product.compare_at_price.replace("$", ""));
      const toShowPrice = 100 - Math.ceil((priceNumber / originalPrice) * 100);

      document.querySelector(".discounted").textContent = product.price;
      document.querySelector(".original-price").textContent =
        product.compare_at_price;
      document.querySelector(".offer-percent").textContent = `${toShowPrice}%`;

      const colorArray = product?.options[0].values;

      Object.values(colorArray).forEach((colorbox, ind) => {
        const element = document.querySelector(`.color-box-${ind + 1}`);
        const keys = Object.keys(colorbox);
        if (element) {
          element.style.backgroundColor = colorbox[keys];
        } else {
          console.error(`Element #color-box-${ind + 1} not found`);
        }
      });

      document.querySelector("#description").innerHTML = product.description;
      productName = product.title;
    }
  } catch (error) {
    console.log(error);
  }
};
fetchData();

const decrementButton = document.getElementById("decrement");
const incrementButton = document.getElementById("increment");

decrementButton.addEventListener("click", () => {
  const quantityNumberElement = document.querySelector(".quantity-number");

  let currentQuantity = parseInt(quantityNumberElement.textContent);

  if (currentQuantity > 1) {
    currentQuantity--;
    quantityNumberElement.textContent = currentQuantity;
  }
});

incrementButton.addEventListener("click", () => {
  const quantityNumberElement = document.querySelector(".quantity-number");
  let currentQuantity = parseInt(quantityNumberElement.textContent);

  if (currentQuantity) {
    currentQuantity++;
    quantityNumberElement.textContent = currentQuantity;
  }
});

const colorBoxes = document.querySelectorAll(".color-box");

let currentSelectedBox = null;

const images = document.querySelectorAll(".other-product-image");

const imageChange = (image) => {
  const ele = document.querySelector(".product-image");
  ele.src = image.src;
};
images.forEach((image) => {
  image.addEventListener("click", () => {
    imageChange(image);
  });
});

function addTickToBox(box) {
  if (currentSelectedBox) {
    const existingTick = currentSelectedBox.querySelector(".tick");
    if (existingTick) {
      currentSelectedBox.removeChild(existingTick);
    }
  }

  const tickSpan = document.createElement("span");
  tickSpan.className = "tick";
  tickSpan.textContent = "✓";
  box.appendChild(tickSpan);

  currentSelectedBox = box;
  selectedColorId = box.id;
}
colorBoxes.forEach((box) => {
  box.addEventListener("click", function () {
    addTickToBox(box);
  });
});

const radioButtons = document.querySelectorAll('input[name="size"]');

function checkSelectedSize() {
  radioButtons.forEach((radio) => {
    if (radio.checked) {
      selectedSize = radio.value;
    }
  });
}

radioButtons.forEach((radio) => {
  radio.addEventListener("change", checkSelectedSize);
});

checkSelectedSize();
const defaultBox = document.querySelector(".color-box-1");
addTickToBox(defaultBox);

const addToCartButton = document.querySelector(".add-to-cart-button");
addToCartButton.addEventListener("click", () => {
  const text = `${productName} with Color ${selectedColorId} and ${selectedSize} size added to cart`;
  const dynamicPara = document.querySelector("#dynamic-p");
  if (dynamicPara.querySelector("p") !== null) return;
  const newDynamicP = document.createElement("p");
  newDynamicP.classList = "after-addtocart-text";
  newDynamicP.textContent = text;
  dynamicPara.appendChild(newDynamicP);
});
