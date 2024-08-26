document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#loginForm");
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Formun varsayılan gönderimini engelle

    // Temizleme işlemi
    emailError.textContent = "";
    passwordError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basit HTML5 form doğrulaması
    if (!email || !password) {
      if (!email) emailError.textContent = "E-posta alanı boş bırakılamaz.";
      if (!password) passwordError.textContent = "Şifre alanı boş bırakılamaz.";
      return;
    }

    try {
      const response = await fetch("https://localhost:7203/api/Account/Login", {
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
          alert("Yetkisiz");
        } else {
          alert("Bir hata oluştu");
        }
        return;
      }
      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     let errorMessage = "Bir hata oluştu.";

      //     if (response.status === 422) {
      //       // API'den dönen hata mesajlarını işleyin
      //       if (errorData.message) {
      //         errorMessage = errorData.message;
      //       } else if (errorData.Email) {
      //         errorMessage = errorData.Email.join(" ");
      //       } else if (errorData.Password) {
      //         errorMessage = errorData.Password.join(" ");
      //       }
      //     } else if (response.status === 401) {
      //       errorMessage = "Yetkisiz giriş.";
      //     }

      //     alert(errorMessage); // Hata mesajını göster
      //     return;
      //   }

      const data = await response.json();
      console.log("API yanıtı:", data); // Yanıtı konsola yazdırın
      const token = data.Token;

      // Token'ı localStorage veya cookie'ye kaydedin (isteğe bağlı)
      localStorage.setItem("authToken", token);
      sessionStorage.setItem("authToken", token);

      console.log("Token:", localStorage.getItem("authToken"));
      console.log("Token:", sessionStorage.getItem("authToken"));

      // Başarı durumunda, kullanıcıyı başka bir sayfaya yönlendirin
      window.location.href = "/dashboard.html"; // Giriş sonrası yönlendirme URL'si
    } catch (error) {
      alert(error.message); // Hata mesajını göster
    }
  });
});
