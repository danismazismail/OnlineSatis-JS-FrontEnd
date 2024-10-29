$(document).ready(function () {
  const $inputs = $(".input-group input");
  let email = ""; // E-posta adresini burada saklayacağız
  const userEmail = localStorage.getItem("userEmail");
  // Inputlar arasında geçiş
  $inputs.on("keyup", function (e) {
    const value = $(this).val();
    const index = $inputs.index(this);

    if (value.length === 1 && index < $inputs.length - 1) {
      $inputs.eq(index + 1).focus();
    } else if (value.length === 0 && index > 0) {
      $inputs.eq(index - 1).focus();
    }
  });

  // Doğrulama kodunu gönder
  $(".submit-btn").click(async function () {
    const code = $inputs
      .map(function () {
        return $(this).val();
      })
      .get()
      .join("");

    if (code.length !== 6) {
      alert("Kod eksik. Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5198/api/Account/Verify2FACode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: localStorage.getItem("userEmail"), // E-posta adresini kullanın
            Code: code,
          }),
        }
      );

      let data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data);
        sessionStorage.setItem("authToken", data);
        window.location.href = "http://127.0.0.1:5500";
      } else {
        alert(data.Message || "Doğrulama kodu geçersiz.");
      }
    } catch (error) {
      console.error("Doğrulama hatası:", error);
      alert("Bir hata oluştu.");
    }
  });

  // Kodun sadece rakam olmasını sağlayan validation
  $inputs.on("input", function () {
    const value = $(this).val();
    if (/[^0-9]/.test(value)) {
      // Yanlış karakter girildiğinde uyarı göster
      showWarning("Sadece rakam giriniz.");
      $(this).val(value.replace(/[^0-9]/g, "")); // Yanlış karakterleri temizle
    }
  });

  function showWarning(message) {
    let $warning = $(".warning");
    if ($warning.length === 0) {
      $warning = $('<span class="warning"></span>').appendTo("body");
    }
    $warning.text(message).show();
    setTimeout(() => $warning.hide(), 3000);
  }

  email = data.Email;

  // E-posta adresi mevcut değilse sayfayı yönlendir veya kullanıcıya uyarı göster
  if (!email) {
    alert("E-posta adresi mevcut değil. Lütfen tekrar giriş yapın.");
    window.location.href = "login.html"; // Giriş sayfasına yönlendir
  }
  // E-posta adresi eşleşmiyor ise sayfayı yönlendir veya kullanıcıya uyarı göster
  if (email === userEmail) {
    alert("E-posta adresi eşleşmiyor. Lütfen tekrar giriş yapın.");
    window.location.href = "login.html"; // Giriş sayfasına yönlendir
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("resendCode")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Linkin varsayılan davranışını engelle

      var email = localStorage.getItem("userEmail"); // E-posta adresini buradan al

      fetch("http://localhost:5198/api/Account/SendVerificationCodeAsync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      })
        .then((response) => response.json())
        .then((data) => {
          // Başarı mesajını göster
          Toastify({
            text: "Kod gönderme başarılı. Lütfen mailinizi kontrol ediniz.",
            duration: 3000, // Mesajın görünme süresi
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Başarı yeşili renk
            close: true, // Kapama butonu
          }).showToast();
        })
        .catch((error) => {
          // Hata mesajını göster
          Toastify({
            text: "Kod gönderme sırasında bir hata oluştu. Lütfen tekrar deneyin.",
            duration: 3000, // Mesajın görünme süresi
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)", // Hata kırmızı-turuncu renk
            close: true, // Kapama butonu
          }).showToast();
        });
    });
});
