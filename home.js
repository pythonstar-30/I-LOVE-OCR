document.getElementById("processButton").addEventListener("click", () => {
    const fileInput = document.getElementById("imageInput");
    const outputArea = document.getElementById("ocrOutput");
    const downloadButton = document.getElementById("downloadButton");

    if (!fileInput.files[0]) {
        alert("Please upload an image first!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();

    // Append the image file and required API parameters
    formData.append("file", file);
    formData.append("apikey", "K84018303588957"); 
    formData.append("language", "eng"); 

    fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.OCRExitCode === 1) {
                const extractedText = data.ParsedResults[0].ParsedText;
                outputArea.value = extractedText;

                downloadButton.style.display = "block";

                // Enable download as PDF
                downloadButton.onclick = () => {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                
                    const maxWidth = 180;
                    const splitText = doc.splitTextToSize(extractedText, maxWidth);
                
                    let yPosition = 10;
                    const lineHeight = 10;
                    
                    splitText.forEach((line, index) => {
                        if (yPosition + lineHeight > doc.internal.pageSize.height) {
                            doc.addPage();  // Add a new page if the current page is full
                            yPosition = 10;  // Reset y position for the new page
                        }
                
                        doc.text(line, 10, yPosition);
                        yPosition += lineHeight;
                    });
                
                    doc.save("OCR_Output.pdf");
                };
                
            } else {
                alert("Failed to process the image. Error: " + data.ErrorMessage);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while processing the image.");
        });
});

document.getElementById("menuButton").addEventListener("click", function () {
    document.getElementById("dropdownMenu").classList.toggle("active");
});

// Hide dropdown if clicked outside
document.addEventListener("click", function (event) {
    let menu = document.getElementById("dropdownMenu");
    let button = document.getElementById("menuButton");

    if (!button.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove("active");
    }
});


    

