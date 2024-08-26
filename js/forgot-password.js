document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("forgotPasswordForm");
  const emailInput = document.getElementById("emailInput");
  const emailError = document.getElementById("emailError");

  // E-posta doğrulama için regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Formun varsayılan gönderimini engelle

    // Temizleme işlemi
    emailError.textContent = "";

    const email = emailInput.value.trim();

    // Basit HTML5 form doğrulaması
    if (!email) {
      emailError.textContent = "E-posta alanı boş bırakılamaz.";
      setTimeout(() => {
        emailError.textContent = "";
      }, 5000); // 5 saniye sonra uyarıyı temizle
      return;
    }

    // E-posta formatı kontrolü
    if (!emailRegex.test(email)) {
      emailError.textContent = "Geçerli bir e-posta adresi giriniz.";
      setTimeout(() => {
        emailError.textContent = "";
      }, 5000); // 5 saniye sonra uyarıyı temizle
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5198/api/Account/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      // API yanıtında message özelliği var mı kontrol et
      if (response.ok && result.message) {
        alert(
          result.message ||
            "Şifre sıfırlama linki e-posta adresinize gönderildi."
        );
        form.reset();
      } else {
        // Hata durumu
        emailError.textContent = result.message || "Bir hata oluştu.";
        setTimeout(() => {
          emailError.textContent = "";
        }, 5000); // 5 saniye sonra uyarıyı temizle
      }
    } catch (error) {
      // Ağ hatası
      emailError.textContent = "Bir ağ hatası oluştu.";
      setTimeout(() => {
        emailError.textContent = "";
      }, 5000); // 5 saniye sonra uyarıyı temizle
      console.error("Error:", error);
    }
  });
});
