ocument.addEventListener("DOMContentLoaded", () => {
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
});
