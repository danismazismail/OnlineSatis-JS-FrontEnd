async function fetchProducts() {
  // Yükleniyor mesajını göster (isteğe bağlı)
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex"; // Yükleniyor mesajını göster
  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const apiUrl = `http://localhost:5198/api/Product/GetProduct/${id}`;

    // API'den ürün verilerini almak
    fetch(apiUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Ürün bilgisi alınamadı");
        }
        return response.json(); // Gelen yanıtı JSON formatına çevir
      })
      .then(function (product) {
        console.log(product);
        // API'den gelen verileri DOM'a yerleştirmek
        document.getElementById("productName").innerText = product.productName;
        document.getElementById(
          "productPrice"
        ).innerText = `₺${product.productPrice}`;
      })
      .catch(function (error) {
        console.error("Ürün bilgisi alınamadı:", error);
      })
      .finally(() => {
        // Yükleniyor mesajını gizle (isteğe bağlı)
        if (loader) loader.style.display = "none"; // Yükleniyor mesajını gizle
      });

    const commentsSection = document.getElementById("comments");

    document
      .getElementById("commentForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const comment = document.getElementById("comment").value;
        const email = document.getElementById("contactEmail").value;

        const commentCard = document.createElement("div");
        commentCard.className = "col-md-6";
        commentCard.innerHTML = `
          <div class="card mt-2">
            <div class="card-body">
              <blockquote class="blockquote">
                <p>${comment}</p>
                <footer class="blockquote-footer">
                  ${name} | ${email}
                </footer>
              </blockquote>
            </div>
          </div>
        `;
        commentsSection.appendChild(commentCard);

        document.getElementById("commentForm").reset();
      });
  });
}
fetchProducts();
