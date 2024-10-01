document.addEventListener("DOMContentLoaded", () => {
  const commentsSection = document.getElementById("comments");

  document
    .getElementById("commentForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const comment = document.getElementById("comment").value;

      const commentCard = document.createElement("div");
      commentCard.className = "col-md-6";
      commentCard.innerHTML = `
          <div class="card mt-2">
            <div class="card-body">
              <blockquote class="blockquote">
                <p>${comment}</p>
                <footer class="blockquote-footer">
                  ${name} | Kullanıcı
                </footer>
              </blockquote>
            </div>
          </div>
        `;
      commentsSection.appendChild(commentCard);

      document.getElementById("commentForm").reset();
    });

  document
    .getElementById("contactForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const contactName = document.getElementById("contactName").value;
      const contactEmail = document.getElementById("contactEmail").value;
      const contactMessage = document.getElementById("contactMessage").value;

      const data = {
        Name: contactName,
        Email: contactEmail,
        Message: contactMessage,
      };

      fetch("http://localhost:5198/api/Home/ContactUsAsync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: contactName,
          Email: contactEmail,
          Message: contactMessage,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              if (response.status === 404) {
                alert(errorData.message || "Geçersiz veri");
              } else {
                alert("Bir hata oluştu");
              }
            });
          } else {
            alert("Mesajınız alınmıştır! Size en kısa sürede geri döneceğiz.");
            document.getElementById("contactForm").reset();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Bir hata oluştu");
        });
    });

  function updateCountdown() {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(now.getMonth() + 1);
    futureDate.setDate(1); // Gelecek ayın 1. günü
    futureDate.setHours(0, 0, 0, 0); // Günün başı

    const timeDifference = futureDate - now;

    // Zaman hesaplaması
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // HTML elemanlarını güncelleme
    document.getElementById("days").innerHTML = `<div>${days
      .toString()
      .padStart(2, "0")}</div><span>Gün</span>`;
    document.getElementById("hours").innerHTML = `<div>${hours
      .toString()
      .padStart(2, "0")}</div><span>Saat</span>`;
    document.getElementById("minutes").innerHTML = `<div>${minutes
      .toString()
      .padStart(2, "0")}</div><span>Dakika</span>`;
    document.getElementById("seconds").innerHTML = `<div>${seconds
      .toString()
      .padStart(2, "0")}</div><span>Saniye</span>`;

    // Sayım bitişi kontrolü
    if (timeDifference < 0) {
      clearInterval(interval);
      document.getElementById("countdown").innerHTML = "Süre Doldu!";
    }
  }

  // Her saniye geri sayımı güncelle
  const interval = setInterval(updateCountdown, 1000);
  // İlk güncellemeyi hemen yap
  updateCountdown();
});
