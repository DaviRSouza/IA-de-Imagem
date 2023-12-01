const generateForm = document.querySelector(".generate-form");
const ImageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "";
let isImageGenerating = false
const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgData = ImageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        const aiGeneretedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneretedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneretedImg)
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`)
        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity), 
                size: "512x512",
                response_format: "b64_json"
            })
        });
        if(!response.ok) throw new Error("Falha na hora de gerar imagem, por favor tente novamente")
        const { data } = await response.json();
        updateImageCard([...data])
    } catch(error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;

    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img-card loading">
            <img src="assets/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="assets/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");

    ImageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);