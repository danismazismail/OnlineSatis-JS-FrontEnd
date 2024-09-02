$(document).ready(function () {
  const $inputs = $(".input-group input");
  let email = ""; // E-posta adresini burada saklayacağız

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
            Email: email, // E-posta adresini kullanın
            Code: code,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        window.location.href = "http://127.0.0.1:5500/users.html";
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

  // E-posta adresini almak için URL'den veya başka bir kaynaktan alın
  const urlParams = new URLSearchParams(window.location.search);
  email = urlParams.get("email"); // E-posta adresini URL'den alıyoruz

  // E-posta adresi mevcut değilse sayfayı yönlendir veya kullanıcıya uyarı göster
  if (!email) {
    alert("E-posta adresi mevcut değil. Lütfen tekrar giriş yapın.");
    window.location.href = "login.html"; // Giriş sayfasına yönlendir
  }
});
