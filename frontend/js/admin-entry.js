const button =
    document.getElementById("admin-entry");

if(button){

    button.addEventListener("click",()=>{

        const token =
            localStorage.getItem("kai_admin_token");

         window.location.href =
                "./admin/login.html";

    });

}