function uploadFile() {
    let fileInput = document.getElementById("fileInput").files[0];
    let resultElement = document.getElementById("result");
    let progressContainer = document.getElementById("progress-container");
    let progressBar = document.getElementById("progress-bar");

    if (!fileInput) {
        alert("Please select a file to scan.");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput);

    // Reset UI
    resultElement.innerText = "Scanning...";
    resultElement.className = "";
    progressContainer.style.display = "block";
    progressBar.style.width = "0%";

    // Fake progress animation
    let progress = 0;
    let interval = setInterval(() => {
        progress += 20;
        progressBar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 500);

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            progressContainer.style.display = "none"; // Hide progress bar
            resultElement.innerText = data.message;

            if (data.is_suspicious) {
                resultElement.className = "danger";
            } else {
                resultElement.className = "safe";
            }
        }, 500); // Delay for better UX
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while scanning the file.");
        progressContainer.style.display = "none";
    });
}
