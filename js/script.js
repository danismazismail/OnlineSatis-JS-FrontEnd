document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#loginForm");
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");

  // E-posta doğrulama için regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Formun varsayılan gönderimini engelle

    // Temizleme işlemi
    emailError.textContent = "";
    passwordError.textContent = "";

    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();

    // Basit HTML5 form doğrulaması
    if (!email || !password) {
      if (!email) emailError.textContent = "E-posta alanı boş bırakılamaz.";
      if (!password) passwordError.textContent = "Şifre alanı boş bırakılamaz.";
      setTimeout(() => {
        emailError.textContent = "";
        passwordError.textContent = "";
      }, 3000); // 3 saniye sonra uyarıyı temizle
      return;
    }

    // E-posta formatı kontrolü
    if (!emailRegex.test(email)) {
      emailError.textContent = "Geçerli bir e-posta adresi giriniz.";
      setTimeout(() => {
        emailError.textContent = "";
      }, 3000); // 3 saniye sonra uyarıyı temizle
      return;
    }

    try {
      const response = await fetch("http://localhost:5198/api/Account/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email, // JSON formatında `Email` ve `Password` özellikleri
          Password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404 || response.status === 422) {
          // API'den dönen hata mesajlarını işleyin
          if (errorData) {
            if (errorData.message) {
              emailError.textContent = errorData.message;
            }
            if (errorData.Password) {
              passwordError.textContent = errorData.Password;
            }
          } else {
            alert("Geçersiz veri");
          }
        } else if (response.status === 401) {
          alert("Geçersiz kimlik bilgileri");
        } else {
          alert("Bir hata oluştu");
        }
        return;
      }
      let result = await response.json();
      if (result.userRole === 1) {
        localStorage.setItem("userEmail", email);
        window.location.href = "http://127.0.0.1:5500/Category-index.html";
        return;
      }
      // `data.Data`'yı kontrol et
      if (result.twoFactorRequired === true) {
        // İki faktörlü doğrulama gereklidir
        localStorage.setItem("userEmail", email);
        window.location.href = "http://127.0.0.1:5500/two-steps.html";
        return;
      }

      // İki faktörlü doğrulama gerekmiyor
      let token = result.data;

      // Token'ı localStorage veya cookie'ye kaydedin (isteğe bağlı)
      localStorage.setItem("authToken", token);
      sessionStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", email);
      window.location.href = "http://127.0.0.1:5500/index.html";
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

document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const rememberMeCheckbox = document.querySelector(".form-check-input");

  // Sayfa yüklendiğinde e-posta adresini kontrol et
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeCheckbox.checked = true; // Checkbox işaretlenmiş olarak göster
  }

  // Formu gönderirken e-posta adresini kaydet
  document.getElementById("loginForm").addEventListener("submit", function () {
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("savedEmail", emailInput.value);
    } else {
      localStorage.removeItem("savedEmail");
    }
  });
});
