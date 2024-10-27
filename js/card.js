window.onload = function () {
  // Sepeti LocalStorage'dan alıyoruz
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var subTotalElement = document.getElementById("subTotal");
  var shippingArea = document.getElementById("shippingArea");
  var subTotal = 0;
  var shippingCost = 0.0; // Sabit kargo ücreti

  // Her bir ürünün toplamını hesaplayıp ara toplamı güncelliyoruz
  cart.forEach((item) => {
    var itemTotal = (item.quantity * item.productPrice).toFixed(2);
    subTotal += parseFloat(itemTotal);
  });

  // Ara toplamı güncelleme
  subTotalElement.innerText = `$${subTotal.toFixed(2)}`;

  // Kargo firmalarını API'den çekiyoruz
  fetch("http://localhost:5198/api/Shipper/GetAllShipper")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Kargo firmalarını güncelle
      updateShippingArea(data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  // İlk kargo fiyatını otomatik olarak hesapla
  shippingCost = parseFloat(shippers[0].price); // İlk kargo firmasının fiyatını al
  var total = subTotal + shippingCost; // Yeni toplamı hesapla
  var totalElement = document.getElementById("totalPrice");
  totalElement.innerText = `$${total.toFixed(2)}`; // Toplam fiyatı güncelle

  // Kargo seçeneği değiştiğinde shippingCost'u güncelle
  document
    .querySelector(".shipping_box ul")
    .addEventListener("change", function (e) {
      if (e.target.name === "shipping") {
        // Sadece 'shipping' radyo butonlarını kontrol ediyoruz
        shippingCost = parseFloat(e.target.value); // Value'dan direkt sayıyı alıyoruz
        var total = subTotal + shippingCost; // Yeni toplamı hesapla
        console.log(`Seçilen kargo ücreti: $${shippingCost.toFixed(2)}`); // Konsola yazdır

        // Toplam fiyatı güncelle
        var totalElement = document.getElementById("totalPrice");
        totalElement.innerText = `$${total.toFixed(2)}`;
      }
    });
};

async function createOrder() {
  try {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Sepetiniz boş. Lütfen ürün ekleyin.");
      return;
    }

    const radios = document.getElementsByName("shipping");
    let selectedValue;

    for (let radio of radios) {
      if (radio.checked) {
        selectedValue = radio.value;
        break;
      }
    }

    if (!selectedValue) {
      alert("Lütfen bir kargo seçin.");
      return;
    }

    const orderData = {
      Products: cart.map((item) => ({
        ProductCode: item.productCode,
        Quantity: item.quantity,
      })),
      ShipperCode: selectedValue,
      UserEmail: localStorage.getItem("userEmail"),
    };

    console.log("Gönderilen Veri:", orderData);

    // fetch işlemini await ile bekle
    const response = await fetch(
      "http://localhost:5198/api/Order/CreateOrder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    console.log("API Yanıtı:", response);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`API Hatası: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json(); // JSON yanıtını bekle
    console.log("Sipariş Verisi:", data);

    alert("Sipariş başarıyla oluşturuldu!");
    localStorage.removeItem("cart"); // Sepeti temizle
  } catch (error) {
    console.error("Hata:", error);
    alert("Sipariş oluşturulurken bir hata oluştu: " + error.message);
  }
}

// Butona click olayı ekleme
document.getElementById("orderButton").onclick = createOrder;

// Kargo alanını güncelle
function updateShippingArea(shippers) {
  var shippingArea = document.getElementById("shippingArea");

  // Sabit kargo ücreti başlangıç olarak tanımlanabilir
  shippingCost = 0.0;
  subTotal = 0;

  // Sepeti LocalStorage'dan alıyoruz
  var cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Ara toplamı hesapla
  cart.forEach((item) => {
    var itemTotal = (item.quantity * item.productPrice).toFixed(2);
    subTotal += parseFloat(itemTotal);
  });

  // Kargo firmalarını içeren HTML içeriği oluşturma
  var shippingOptionsHtml = shippers
    .map(
      (shipper) => `
    <li>
        <input type="radio" name="shipping" value="${shipper.shipperCode}">
        ${shipper.shipperName}: ${
        shipper.deliveryTime
      } - $${shipper.price.toFixed(2)}
    </li>`
    )
    .join("");

  // Kargo alanını güncelle
  shippingArea.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td><h5>Ara Toplam</h5></td>
        <td><h5 id="subTotal">$${subTotal.toFixed(2)}</h5></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td><h5>Kargo Firmaları</h5></td>
        <td>
            <div class="shipping_box">
                <ul class="list" style="list-style-type: none;">
                    ${shippingOptionsHtml}
                </ul>
            </div>
        </td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td><h5>Toplam</h5></td>
        <td><h5>$${(subTotal + shippingCost).toFixed(2)}</h5></td>
    </tr>
  `;
}

function removeItem(productCode) {
  // LocalStorage'dan sepetteki ürünleri alıyoruz
  var cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Ürünü silme işlemi
  cart = cart.filter((item) => item.productCode !== productCode);

  // Güncellenmiş sepeti LocalStorage'a kaydet
  localStorage.setItem("cart", JSON.stringify(cart));

  // Sepeti güncelle
  updateCart();
}

function increaseQuantity(productCode) {
  // Input alanını productId ile buluyoruz
  var quantityInput = document.getElementById("quantity-" + productCode);
  var currentQuantity = parseInt(quantityInput.value);
  quantityInput.value = currentQuantity + 1;

  // Local storage'dan sepeti al
  var cart = JSON.parse(localStorage.getItem("cart")) || [];

  // İlgili ürünü bul ve miktarını artır
  var product = cart.find((item) => item.productCode === productCode);
  if (product) {
    product.quantity += 1;
  }

  // Güncellenen sepeti tekrar local storage'a kaydet
  localStorage.setItem("cart", JSON.stringify(cart));

  // Ürün toplam fiyatını güncelle
  updateTotalPrice(product.productCode, product.quantity, product.productPrice);
}

function decreaseQuantity(productCode) {
  // Input alanını productId ile buluyoruz
  var quantityInput = document.getElementById("quantity-" + productCode);
  var currentQuantity = parseInt(quantityInput.value);

  if (currentQuantity > 1) {
    quantityInput.value = currentQuantity - 1;

    // Local storage'dan sepeti al
    var cart = JSON.parse(localStorage.getItem("cart")) || [];

    // İlgili ürünü bul ve miktarını azalt
    var product = cart.find((item) => item.productCode === productCode);
    if (product) {
      product.quantity -= 1;
    }

    // Güncellenen sepeti tekrar local storage'a kaydet
    localStorage.setItem("cart", JSON.stringify(cart));

    // Ürün toplam fiyatını güncelle
    updateTotalPrice(
      product.productCode,
      product.quantity,
      product.productPrice
    );
  }
}

function updateTotalPrice(productCode, quantity, pricePerUnit) {
  var totalPriceElement = document.getElementById(
    "sumProductPrice-" + productCode
  );
  var newTotalPrice = (quantity * pricePerUnit).toFixed(2);
  totalPriceElement.innerText = "$" + newTotalPrice;
}

function removeItem(productCode) {
  // Local storage'dan sepeti al
  var cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Ürünü sepetten kaldır
  cart = cart.filter((item) => item.productCode !== productCode);

  // Güncellenen sepeti tekrar local storage'a kaydet
  localStorage.setItem("cart", JSON.stringify(cart));

  // Ürün satırını HTML'den kaldır
  document.querySelector(`[data-product-id='${productCode}']`).remove();
}

document.addEventListener("DOMContentLoaded", function () {
  // Kullanıcı e-posta bilgisi localStorage'da mevcut mu?
  const userEmail = localStorage.getItem("userEmail");
  const userContainer = document.getElementById("user-container");

  // Eğer kullanıcı girişi yapılmışsa, dropdown'ı ekle
  if (userEmail) {
    userContainer.innerHTML = `
              <div id="user-dropdown" class="dropdown">
                  <a
                      href="#"
                      class="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                  >
                      <img
                          alt=""
                          class="rounded-circle me-2"
                      />
                      <strong>${userEmail}</strong>
                  </a>
                  <ul class="dropdown-menu text-small shadow">
                      <li>
                          <a class="dropdown-item" href="#">New project...</a>
                      </li>
                      <li><a class="dropdown-item" href="#">Settings</a></li>
                      <li><a class="dropdown-item" href="logout.html">Ekranı Kitle</a></li>
                      <li><hr class="dropdown-divider" /></li>
                      <li><a class="dropdown-item" href="#">Sign out</a></li>
                  </ul>
              </div>
          `;
  } else {
    // Eğer kullanıcı girişi yapılmamışsa, giriş butonunu ekle
    userContainer.innerHTML = `
              <div id="login-button">
                  <a
                      id="navbar-custom"
                      class="btn btn-primary d-flex justify-content-end"
                      href="http://127.0.0.1:5500/sign-in.html"
                  >
                      Giriş Yap
                  </a>
              </div>
          `;
  }
});

class Cart {
  constructor() {
    // localStorage'dan sepet verilerini al
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
  }

  // Ürün ekleme
  addProduct(product) {
    const existingItemIndex = this.items.findIndex(
      (item) => item.productCode === product.productCode
    );

    const userEmail = localStorage.getItem("userEmail");

    if (existingItemIndex > -1) {
      this.items[existingItemIndex].quantity += 1;
      if (userEmail) {
        this.items[existingItemIndex].cartOwnerEmail = userEmail;
      }
    } else {
      this.items.push({
        productCode: product.productCode,
        productName: product.productName,
        productPrice: product.productPrice,
        cartOwnerEmail: userEmail,
        quantity: 1,
      });
    }
    this.saveCart();
  }

  // localStorage'a sepeti kaydet
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  // Sepeti sayfaya yükle
  loadCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Eski içerikleri temizle

    let totalPrice = 0;

    this.items.forEach((item) => {
      const itemTotal = item.productPrice * item.quantity;
      totalPrice += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>
                  <div class="media">
                    <div class="d-flex">
                      <img src="assets/img/arrivel/arrivel_1.png" alt="" />
                    </div>
                    <div class="media-body">
                      <p id="productName-${item.productCode}">${
        item.productName
      }</p>
                    </div>
                  </div>
                </td>
                <td>
                  <h5 id="productPrice-${
                    item.productCode
                  }">$${item.productPrice.toFixed(2)}</h5>
                </td>
                <td>
                  <div class="product_count" style="display: flex; align-items: center;">
                    <!-- Miktar Kontrolleri -->
                    <div class="quantity-controls" style="display: flex; align-items: center;">
                      <button
                        class="btn btn-outline-primary"
                        onclick="decreaseQuantity(${item.productCode})"
                        style="margin-right: 5px;"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id="quantity-${item.productCode}"
                        value="${item.quantity}"
                        min="1"
                        class="form-control text-center"
                        style="width: 60px; margin: 0 5px;"
                        readonly
                      />
                      <button
                        class="btn btn-outline-primary"
                        onclick="increaseQuantity(${item.productCode})"
                        style="margin-left: 5px;"
                      >
                        +
                      </button>
                      <button
                        class="btn btn-outline-danger"
                        onclick="removeProduct(${item.productCode})"
                        style="margin-left: 15px;"
                      >
                        x
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <h5 id="sumProductPrice-${
                    item.productCode
                  }">$${itemTotal.toFixed(2)}</h5>
                </td>
          `;
      cartItemsContainer.appendChild(row);
    });

    document.getElementById(
      "cart-total"
    ).innerText = `Toplam: $${totalPrice.toFixed(2)}`;
  }

  // Ürün silme
  removeProduct(productCode) {
    this.items = this.items.filter((item) => item.productCode !== productCode);
    this.saveCart();
    this.loadCart(); // Sepeti yeniden yükle
  }
}

// Sayfa açıldığında sepeti yükle
document.addEventListener("DOMContentLoaded", () => {
  const cart = new Cart();
  cart.loadCart();
});

// Ürün silme fonksiyonu
function removeProduct(productCode) {
  const cart = new Cart();
  cart.removeProduct(productCode);
}
