function loadProducts() {
  if (!window.location.hash) {
    window.location = window.location + "#loaded";
    window.location.reload();
  }
  fetch("http://localhost:5198/api/AdminProduct/GetProduct")
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => b.productCode - a.productCode);
      var table = document.getElementById("products");
      table.innerHTML = "";
      data.forEach((product) => {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");
        var td6 = document.createElement("td");
        var td7 = document.createElement("td");
        var td8 = document.createElement("td");
        var td9 = document.createElement("td");
        var td10 = document.createElement("td");

        td1.appendChild(document.createTextNode(product.productCode));
        td2.appendChild(document.createTextNode(product.productName));
        td3.appendChild(document.createTextNode(`$${product.productPrice}`));
        td4.appendChild(document.createTextNode(product.stock));
        td5.appendChild(document.createTextNode(product.categoryName));

        td6.appendChild(
          document.createTextNode(
            new Date(product.createdDate).toLocaleString("tr-TR")
          )
        );
        td7.appendChild(
          document.createTextNode(
            product.updatedDate != null
              ? new Date(product.updatedDate).toLocaleString("tr-TR")
              : "-"
          )
        );
        td8.appendChild(
          document.createTextNode(
            product.status == 1 ? "Aktif" : "Güncellenmiş"
          )
        );
        var buttonUpdate = document.createElement("a");
        buttonUpdate.id = "updateBtn" + product.productCode;
        buttonUpdate.classList.add("btn");
        buttonUpdate.classList.add("btn-primary");
        buttonUpdate.href = "UpdateProduct.html?id=" + product.productCode;
        buttonUpdate.appendChild(document.createTextNode("Update"));
        td9.appendChild(buttonUpdate);

        var buttonDelete = document.createElement("a");
        buttonDelete.id = "deleteBtn" + product.productCode;
        buttonDelete.classList.add("btn");
        buttonDelete.classList.add("btn-danger");
        buttonDelete.addEventListener("click", function () {
          deleteProduct(product.productCode);
        });
        buttonDelete.appendChild(document.createTextNode("Delete"));
        td10.appendChild(buttonDelete);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);
        tr.appendChild(td10);

        table.appendChild(tr);
      });
    });
}
function loadCategoriesIntoSelect() {
  fetch("http://localhost:5198/api/Categories/GetAllCategory")
    .then((response) => response.json())
    .then((categories) => {
      var select = document.getElementById("categorySelect");
      categories.forEach((category) => {
        var option = document.createElement("option");
        option.value = category.categoryCode;
        option.text = category.categoryName;
        select.appendChild(option);
      });
    })
    .catch((error) => console.error("Error:", error));
}
function createProduct() {
  let form = document.getElementById("form1");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      console.log(data);

      fetch("http://localhost:5198/api/AdminProduct/CreateProduct", {
        method: "POST",
        body: data,
      })
        .then((response) => {
          console.log(response);
        })
        .then(
          (window.location.href = "http://127.0.0.1:5500/Product-index.html")
        )
        .catch((error) => {
          console.error(error);
        });
    });
  }
}
function updateProductGet() {
  var queryString = decodeURIComponent(window.location.search);
  //console.log(queryString.substring(4))
  var productId = queryString.substring(4);

  fetch("http://localhost:5198/api/AdminProduct/GetProductById?id=" + productId)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("ProductCode").value = data.productCode;
      document.getElementById("ProductName").value = data.productName;
      document.getElementById("ProductPrice").value = data.productPrice;
      document.getElementById("Stock").value = data.stock;
    });
}
function updateProductPost(event) {
  event.preventDefault();
  let form = document.getElementById("updateProductForm");
  const data = new FormData(form);
  fetch("http://localhost:5198/api/AdminProduct/UpdateProduct", {
    method: "PUT",
    body: data,
  })
    .then((response) => console.log(response))
    .then(() => {
      window.location.href = "Product-index.html";
    })
    .catch((error) => console.log(error));
}
function deleteProduct(productCode) {
  var result = confirm("Silmek istediğinize emin misiniz?");
  if (result) {
    fetch(
      "http://localhost:5198/api/AdminProduct/DeleteProduct?id=" + productCode,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        loadProducts();
      })
      .catch((error) => console.log(error));
  }
}

window.onload = function () {
  loadCategoriesIntoSelect();
  createProduct();
};
function Logout() {
  // Kullanıcının token'ını localStorage veya cookie'den alabilirsiniz (bu örnekte localStorage üzerinden alındı)
  let token = localStorage.getItem("authToken"); // Token'ı sakladığınız yer

  if (!token) {
    alert("Çıkış yapmak için bir token bulunamadı.");
    return;
  }
  $.ajax({
    url: "http://localhost:5198/api/Account/logout",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(token),
    success: function (data) {
      alert(data.message); // Başarılı mesajı göster
      // Token'ı temizleyin ve logout sayfasına yönlendirin
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("userEmail"); // Kullanıcı e-postasını localStorage'dan sil
      sessionStorage.removeItem("userEmail"); // Kullanıcı adresini localStorage'dan sil
      window.location.href = "sign-in.html"; // Logout sayfasına yönlendirme
    },
    error: function (xhr) {
      var errorMessage =
        xhr.responseJSON && xhr.responseJSON.message
          ? xhr.responseJSON.message
          : "Bilinmeyen bir hata oluştu";
      console.error("Hata:", errorMessage);
      alert("Çıkış yapılamadı: " + errorMessage);
    },
  });
}
