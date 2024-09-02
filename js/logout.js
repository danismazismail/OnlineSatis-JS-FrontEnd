$(document).ready(function () {
  // localStorage'dan e-posta adresini al
  var email = localStorage.getItem("userEmail");

  if (email != null) {
    // E-posta adresini input alanına yerleştir
    $("#emailInput").text(email);
  }

  $("form").on("submit", async function (e) {
    e.preventDefault(); // Formun normal şekilde submit edilmesini engeller

    const password = $("input[type='password']").val();

    try {
      const response = await fetch("http://localhost:5198/api/Account/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404 || response.status === 422) {
          // API'den dönen hata mesajlarını işleyin
          if (errorData.Password) {
            alert(errorData.Password);
          } else {
            alert("Geçersiz veri");
          }
        } else if (response.status === 401) {
          alert("Yetkisiz");
        } else {
          alert("Bir hata oluştu");
        }
        return;
      }

      const result = await response.json();

      // `data.Data`'yı kontrol et
      if (result.twoFactorRequired === true) {
        // İki faktörlü doğrulama gereklidir
        window.location.href = "http://127.0.0.1:5500/two-steps.html";
        localStorage.setItem("userEmail", email);
      } else {
        // İki faktörlü doğrulama gerekmiyor
        const token = result.data.token;

        // Token'ı localStorage veya cookie'ye kaydedin (isteğe bağlı)
        localStorage.setItem("authToken", token);
        sessionStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", email);
        window.location.href = "http://127.0.0.1:5500/users.html";
      }
    } catch (error) {
      alert(error.message); // Hata mesajını göster
    }
  });
});

//Password gizle göster için
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");

  togglePassword.addEventListener("click", function (event) {
    event.preventDefault(); // Linkin varsayılan davranışını engelle

    // Şifre alanının tipini değiştir
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      // Simgeyi değiştirme (opsiyonel)
      togglePassword.setAttribute("aria-label", "Hide password");
    } else {
      passwordInput.type = "password";
      // Simgeyi değiştirme (opsiyonel)
      togglePassword.setAttribute("aria-label", "Show password");
    }
  });
});
