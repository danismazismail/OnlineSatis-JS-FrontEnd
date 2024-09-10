$(document).ready(function () {
  $("#registerForm").on("submit", function (event) {
    event.preventDefault(); // Formun sayfa yenilemesini önler

    // Temizleme
    clearErrors();

    // Form verilerini toplama
    const name = $("#name").val().trim();
    const surname = $("#surname").val().trim();
    const tcKimlikNo = $("#tc-kimlik-no").val().trim();
    const phone = $("#phone").val().trim();
    const birthdate = $("#birthdate").val().trim();
    const email = $("#email").val().trim();
    const password = $("#password").val().trim();
    const confirmPassword = $("#confirm-password").val().trim();

    // Validasyon
    let isValid = true;

    // İsim Kontrolü
    if (!name) {
      $("#nameError").text("İsim alanı boş bırakılamaz.");
      isValid = false;
    }

    // Soyisim Kontrolü
    if (!surname) {
      $("#surnameError").text("Soyisim alanı boş bırakılamaz.");
      isValid = false;
    }

    // TC Kimlik No Kontrolü
    if (!tcKimlikNo || !/^\d{11}$/.test(tcKimlikNo)) {
      $("#tcKimlikNoError").text("Geçerli bir TC Kimlik No giriniz.");
      isValid = false;
    }

    // Telefon Kontrolü
    if (!phone || !/^\+\d{12}$/.test(phone)) {
      $("#phoneError").text("Telefon numarası +905325323232 gibi olmalıdır.");
      isValid = false;
    }

    // Doğum Tarihi Kontrolü
    if (!birthdate) {
      $("#birthdateError").text("Doğum tarihi alanı boş bırakılamaz.");
      isValid = false;
    }

    // Email Kontrolü
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $("#emailError").text("Geçerli bir e-posta adresi giriniz.");
      isValid = false;
    }

    // Şifre Kontrolü
    if (
      !password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{4,8}$/.test(password)
    ) {
      $("#passwordError").text(
        "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermeli ve 4-8 karakter uzunluğunda olmalıdır."
      );
      isValid = false;
    }

    // Şifre Tekrarı Kontrolü
    if (password !== confirmPassword) {
      $("#confirmPasswordError").text("Şifreler uyuşmuyor.");
      isValid = false;
    }

    if (isValid) {
      // Formu API'ye gönder
      $.ajax({
        url: "http://localhost:5198/api/Account/Register", // API endpoint
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          name,
          surname,
          identityNumber: tcKimlikNo,
          mobilePhone: phone,
          birthDate: birthdate,
          email,
          password,
        }),
        success: function (response) {
          // Başarı durumu
          alert(response.message);
          window.location.href = "http://127.0.0.1:5500/sign-in.html";
        },
        error: function (xhr) {
          let errorMessage =
            "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.";

          // JSON formatında hata mesajını almaya çalış
          try {
            const response = $.parseJSON(xhr.responseText);
            if (response && response.message) {
              errorMessage = response.message;
            }
          } catch (e) {
            // JSON değilse düz metin olarak hata mesajını al
            errorMessage = xhr.responseText || errorMessage;
          }

          alert(errorMessage);
        },
      });
    }
  });

  function clearErrors() {
    $("#nameError").text("");
    $("#surnameError").text("");
    $("#tcKimlikNoError").text("");
    $("#phoneError").text("");
    $("#birthdateError").text("");
    $("#emailError").text("");
    $("#passwordError").text("");
    $("#confirmPasswordError").text("");
  }
});
