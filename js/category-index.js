function loadCategories() {
    if (!window.location.hash) {
        window.location = window.location + "#loaded";
        window.location.reload();
      };


  fetch("http://localhost:5198/api/Categories/GetAllCategory")
    .then((response) => response.json())
    .then((data) => {
       console.log(data);
      var table = document.getElementById("categories");

      table.innerHTML = "";

      data.forEach((category) => {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");
        var td6 = document.createElement("td");
        var td7 = document.createElement("td");
        var td8 = document.createElement("td");

        td1.appendChild(document.createTextNode(category.categoryCode));
        td2.appendChild(document.createTextNode(category.categoryName));
        td3.appendChild(document.createTextNode(category.categoryDescription));
        td4.appendChild(
          document.createTextNode(
            new Date(category.createdDate).toLocaleString("tr-TR")
          )
        );
        td5.appendChild(
          document.createTextNode(
            (category.updatedDate != null ? new Date(category.updatedDate).toLocaleString("tr-TR") : "-")
          )
        );
        td6.appendChild(document.createTextNode(
            category.status == 1 ? "Aktif" : "Güncellenmiş"
        ));

        var buttonUpdate = document.createElement("a");
        buttonUpdate.id = "updateBtn" + category.categoryCode;
        buttonUpdate.classList.add("btn");
        buttonUpdate.classList.add("btn-primary");
        buttonUpdate.href = "UpdateCategory.html?id=" + category.categoryCode;
        buttonUpdate.appendChild(document.createTextNode("Update"));
        td7.appendChild(buttonUpdate);

        var buttonDelete = document.createElement("a");
        buttonDelete.id = "deleteBtn" + category.categoryCode;
        buttonDelete.classList.add("btn");
        buttonDelete.classList.add("btn-danger");
        buttonDelete.addEventListener("click", function () {
          deleteCategory(category.categoryCode);
        });
        buttonDelete.appendChild(document.createTextNode("Delete"));
        td8.appendChild(buttonDelete);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);

        table.appendChild(tr);
      });
    });
}

function createCategory() { 
    let form = document.getElementById("form");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = new FormData(form);
           

            fetch("http://localhost:5198/api/Categories/CreateCategory", {
                method: "POST",
                body: data,
            }).then((response) => { console.log(response); })
              .then((window.location.href = "Category-index.html"))
              .catch((error) => { console.error(error) })
        })
     
    }
 }

 function updateCategoryGet(){
  var queryString=decodeURIComponent(window.location.search)
  //console.log(queryString.substring(4))
  var categoryId=queryString.substring(4)
 
fetch("http://localhost:5198/api/Categories/GetCategoryById?id=" +categoryId)
.then((response) => response.json())
.then((data) =>{
  document.getElementById("id").value=data.categoryCode;
  document.getElementById("name").value=data.categoryName;
  document.getElementById("description").value=data.categoryDescription;
})
 }

 function updateCategoryPost(event){
  event.preventDefault();
  let form =document.getElementById("updateCategoryForm");
  const data=new FormData(form);
   fetch("http://localhost:5198/api/Categories/UpdateCategory",{
    method:"PUT",
    body:data
   }).then((response)=>console.log(response))
   .then(()=>{
    window.location.href="Category-index.html"
   })
   .catch((error)=>console.log(error))
 }
 function deleteCategory(categoryCode){
  var result =confirm("Silmek istediğinize emin misiniz?")
  if(result){
    fetch("http://localhost:5198/api/Categories/DeleteCategory?id=" +categoryCode,{
      method:"DELETE"
    })
    .then(()=>{
      loadCategories()
    }).catch(error=>console.log(error))
  }
 }