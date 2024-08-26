// $(document).ready(function () {
//   $("#resetPasswordForm").on("submit", function (event) {
//     event.preventDefault(); // Formun varsayılan gönderimini engelle

//     // Temizleme işlemi
//     $("#nameError").text("");
//     $("#surnameError").text("");
//     $("#passwordError").text("");
//     $("#confirmPasswordError").text("");

//     const name = $("#name").val().trim();
//     const surname = $("#surname").val().trim();
//     const password = $("#password").val().trim();
//     const confirmPassword = $("#confirmPassword").val().trim();

//     // Basit form doğrulaması
//     let hasError = false;
//     if (!name) {
//       $("#nameError").text("İsim alanı boş bırakılamaz.");
//       hasError = true;
//     }
//     if (!surname) {
//       $("#surnameError").text("Soyisim alanı boş bırakılamaz.");
//       hasError = true;
//     }
//     if (!password) {
//       $("#passwordError").text("Şifre alanı boş bırakılamaz.");
//       hasError = true;
//     }
//     if (password !== confirmPassword) {
//       $("#confirmPasswordError").text("Şifreler eşleşmiyor.");
//       hasError = true;
//     }

//     if (hasError) {
//       return; // Hatalıysa işlem yapma
//     }

//     // API çağrısını yap
//     $.ajax({
//       url: "https://localhost:7203/api/reset-password",
//       type: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Token'ı ekle
//       },
//       data: JSON.stringify({
//         Name: name,
//         Surname: surname,
//         NewPassword: password,
//       }),
//       success: function (response) {
//         // Başarı durumunda, kullanıcıyı giriş ekranına yönlendir
//         window.location.href = "./sign-in.html";
//       },
//       error: function (xhr) {
//         const errorData = xhr.responseJSON;
//         if (xhr.status === 401) {
//           // Geçersiz token veya yetkisiz erişim
//           $("#passwordError").text("Geçersiz token veya yetkisiz erişim.");
//         } else if (xhr.status === 404) {
//           // Kullanıcı bulunamadı
//           $("#nameError").text("Kullanıcı bulunamadı.");
//         } else if (xhr.status === 400) {
//           // Hatalı giriş
//           $("#passwordError").text("Şifre sıfırlama işlemi başarısız.");
//         } else {
//           $("#passwordError").text("Bir hata oluştu.");
//         }
//       },
//     });
//   });

//   // Şifre göstermek/gizlemek için
//   $("#togglePassword").on("click", function (event) {
//     event.preventDefault(); // Linkin varsayılan davranışını engelle
//     const passwordInput = $("#password");
//     if (passwordInput.attr("type") === "password") {
//       passwordInput.attr("type", "text");
//       $(this).attr("aria-label", "Hide password");
//     } else {
//       passwordInput.attr("type", "password");
//       $(this).attr("aria-label", "Show password");
//     }
//   });

//   $("#toggleConfirmPassword").on("click", function (event) {
//     event.preventDefault(); // Linkin varsayılan davranışını engelle
//     const confirmPasswordInput = $("#confirmPassword");
//     if (confirmPasswordInput.attr("type") === "password") {
//       confirmPasswordInput.attr("type", "text");
//       $(this).attr("aria-label", "Hide password");
//     } else {
//       confirmPasswordInput.attr("type", "password");
//       $(this).attr("aria-label", "Show password");
//     }
//   });
// });

// $(document).ready(function () {
//   $("#resetPasswordForm").on("submit", function (event) {
//     event.preventDefault(); // Formun varsayılan gönderimini engelle

//     // Temizleme işlemi
//     $("#nameError").text("").hide();
//     $("#surnameError").text("").hide();
//     $("#passwordError").text("").hide();
//     $("#confirmPasswordError").text("").hide();

//     const name = $("#name").val().trim();
//     const surname = $("#surname").val().trim();
//     const password = $("#password").val().trim();
//     const confirmPassword = $("#confirmPassword").val().trim();

//     // Basit form doğrulaması
//     let hasError = false;
//     if (!name) {
//       $("#nameError").text("İsim alanı boş bırakılamaz.").show();
//       hasError = true;
//     }
//     if (!surname) {
//       $("#surnameError").text("Soyisim alanı boş bırakılamaz.").show();
//       hasError = true;
//     }
//     if (!password) {
//       $("#passwordError").text("Şifre alanı boş bırakılamaz.").show();
//       hasError = true;
//     }
//     if (password !== confirmPassword) {
//       $("#confirmPasswordError").text("Şifreler eşleşmiyor.").show();
//       hasError = true;
//     }

//     if (hasError) {
//       // Hatalıysa uyarıları 3 saniye sonra gizle
//       setTimeout(function () {
//         $("#nameError").fadeOut();
//         $("#surnameError").fadeOut();
//         $("#passwordError").fadeOut();
//         $("#confirmPasswordError").fadeOut();
//       }, 3000);
//       return; // Hatalıysa işlem yapma
//     }

//     // API çağrısını yap
//     $.ajax({
//       url: "https://localhost:5198/api/Account/reset-password",
//       type: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Token'ı ekle
//       },
//       data: JSON.stringify({
//         Name: name,
//         Surname: surname,
//         NewPassword: password,
//       }),
//       success: function (response) {
//         // Başarı durumunda, kullanıcıyı giriş ekranına yönlendir
//         window.location.href = "./sign-in.html";
//       },
//       error: function (err) {
//         const errorData = err.responseJSON;
//         if (err.status === 401) {
//           // Geçersiz token veya yetkisiz erişim
//           $("#passwordError")
//             .text("Geçersiz token veya yetkisiz erişim.")
//             .show();
//         } else if (err.status === 404) {
//           // Kullanıcı bulunamadı
//           $("#nameError").text("Kullanıcı bulunamadı.").show();
//         } else if (err.status === 400) {
//           // Hatalı giriş
//           $("#passwordError").text("Şifre sıfırlama işlemi başarısız.").show();
//         } else {
//           $("#passwordError").text("Bir hata oluştu.").show();
//         }
//         // Uyarıları 3 saniye sonra gizle
//         setTimeout(function () {
//           $("#nameError").fadeOut();
//           $("#surnameError").fadeOut();
//           $("#passwordError").fadeOut();
//           $("#confirmPasswordError").fadeOut();
//         }, 3000);
//       },
//     });
//   });

//   // Şifre göstermek/gizlemek için
//   $("#togglePassword").on("click", function (event) {
//     event.preventDefault(); // Linkin varsayılan davranışını engelle
//     const passwordInput = $("#password");
//     if (passwordInput.attr("type") === "password") {
//       passwordInput.attr("type", "text");
//       $(this).attr("aria-label", "Hide password");
//     } else {
//       passwordInput.attr("type", "password");
//       $(this).attr("aria-label", "Show password");
//     }
//   });

//   $("#toggleConfirmPassword").on("click", function (event) {
//     event.preventDefault(); // Linkin varsayılan davranışını engelle
//     const confirmPasswordInput = $("#confirmPassword");
//     if (confirmPasswordInput.attr("type") === "password") {
//       confirmPasswordInput.attr("type", "text");
//       $(this).attr("aria-label", "Hide password");
//     } else {
//       confirmPasswordInput.attr("type", "password");
//       $(this).attr("aria-label", "Show password");
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Formun varsayılan gönderimini engelle

      // Temizleme işlemi
      $("#nameError").text("").hide();
      $("#surnameError").text("").hide();
      $("#passwordError").text("").hide();
      $("#confirmPasswordError").text("").hide();

      const name = $("#name").val().trim();
      const surname = $("#surname").val().trim();
      const password = $("#password").val().trim();
      const confirmPassword = $("#confirmPassword").val().trim();

      // Basit form doğrulaması
      let hasError = false;
      if (!name) {
        $("#nameError").text("İsim alanı boş bırakılamaz.").show();
        hasError = true;
      }
      if (!surname) {
        $("#surnameError").text("Soyisim alanı boş bırakılamaz.").show();
        hasError = true;
      }
      if (!password) {
        $("#passwordError").text("Şifre alanı boş bırakılamaz.").show();
        hasError = true;
      }
      if (password !== confirmPassword) {
        $("#confirmPasswordError").text("Şifreler eşleşmiyor.").show();
        hasError = true;
      }

      if (hasError) {
        // Hatalıysa uyarıları 3 saniye sonra gizle
        setTimeout(function () {
          $("#nameError").fadeOut();
          $("#surnameError").fadeOut();
          $("#passwordError").fadeOut();
          $("#confirmPasswordError").fadeOut();
        }, 3000);
        return; // Hatalıysa işlem yapma
      }

      // Token'ı URL'den almak
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      // API çağrısını yap
      fetch("http://localhost:5198/api/Account/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token'ı ekle
        },
        body: JSON.stringify({
          Name: name,
          Surname: surname,
          NewPassword: password,
        }),
      })
        .then((response) => {
          return response.json().then((data) => ({
            status: response.status,
            body: data,
          }));
        })
        .then(({ status, body }) => {
          if (status >= 200 && status < 300) {
            // Başarı durumunda, kullanıcıyı giriş ekranına yönlendir
            window.location.href = "./sign-in.html";
          } else {
            // Hata durumunda mesajı göster
            const message = body.Message || "Bir hata oluştu.";
            if (status === 401) {
              $("#passwordError").text(message).show();
            } else if (status === 404) {
              $("#nameError").text(message).show();
            } else if (status === 400) {
              $("#passwordError").text(message).show();
            } else {
              $("#passwordError").text(message).show();
            }
            // Uyarıları 3 saniye sonra gizle
            setTimeout(function () {
              $("#nameError").fadeOut();
              $("#surnameError").fadeOut();
              $("#passwordError").fadeOut();
              $("#confirmPasswordError").fadeOut();
            }, 3000);
          }
        })
        .catch((err) => {
          console.error("Fetch hatası:", err);
          $("#passwordError").text("Bir hata oluştu.").show();
          setTimeout(function () {
            $("#passwordError").fadeOut();
          }, 3000);
        });
    });

  // Şifre göstermek/gizlemek için
  document
    .getElementById("togglePassword")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Linkin varsayılan davranışını engelle
      const passwordInput = document.getElementById("password");
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.setAttribute("aria-label", "Hide password");
      } else {
        passwordInput.type = "password";
        this.setAttribute("aria-label", "Show password");
      }
    });

  document
    .getElementById("toggleConfirmPassword")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Linkin varsayılan davranışını engelle
      const confirmPasswordInput = document.getElementById("confirmPassword");
      if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        this.setAttribute("aria-label", "Hide password");
      } else {
        confirmPasswordInput.type = "password";
        this.setAttribute("aria-label", "Show password");
      }
    });
});
