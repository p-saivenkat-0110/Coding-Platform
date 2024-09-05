function uploadImage(){
    var fileInput = document.getElementById('upload_profile');
    var file = fileInput.files[0];
    console.log(file)
    
    if(!file){
        alert("Please select an image file.");
        return;
    }
    var formData = new FormData();
    formData.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8888/upload_profile', true);

    xhr.onload = function(){
        if (xhr.status === 200) {
            alert("Image uploaded successfully!");
        }
        else{
            alert("Failed to upload image. Please try again later.");
        }
    };
    xhr.onerror = function() {
        alert("Failed to upload image. Please try again later.");
    };
    xhr.send(formData);
    // window.location.reload();
}