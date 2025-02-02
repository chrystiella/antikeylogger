function uploadFile() {
    let fileInput = document.getElementById("fileInput").files[0];
    if (!fileInput) {
        alert("Please select a file to scan.");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput);

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        let resultElement = document.getElementById("result");
        resultElement.innerText = data.message;
        
        if (data.is_suspicious) {
            resultElement.className = "danger";
        } else {
            resultElement.className = "safe";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while scanning the file.");
    });
}
