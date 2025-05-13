// app.js
let tg = window.Telegram.WebApp;
let uploadedPhotos = 0;
let photos = [];

tg.expand();

document.getElementById('uploadButton').addEventListener('click', () => {
    if (uploadedPhotos < 3) {
        tg.showPopup({
            title: 'Загрузка фото',
            message: `Загрузите фото ${uploadedPhotos + 1}/3`,
            buttons: [{
                id: "upload",
                type: "default",
                text: "Выбрать фото"
            }]
        }, function(buttonId) {
            if (buttonId === "upload") {
                uploadPhoto();
            }
        });
    }
});

document.getElementById('generateButton').addEventListener('click', async () => {
    const location = document.getElementById('locationInput').value;
    if (!location) {
        tg.showPopup({
            title: 'Ошибка',
            message: 'Пожалуйста, укажите локацию'
        });
        return;
    }

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                photos: photos,
                location: location,
                userId: tg.initDataUnsafe.user.id
            })
        });

        if (response.ok) {
            const result = await response.json();
            showGeneratedImage(result.imageUrl);
        } else {
            throw new Error('Generation failed');
        }
    } catch (error) {
        tg.showPopup({
            title: 'Ошибка',
            message: 'Произошла ошибка при генерации изображения'
        });
    }
});

function uploadPhoto() {
    // Имитация загрузки фото (в реальном приложении здесь будет использоваться Telegram.WebApp.showPopup)
    const photoPlaceholders = document.querySelectorAll('.photo-placeholder');
    photoPlaceholders[uploadedPhotos].style.backgroundColor = '#3390ec';
    photoPlaceholders[uploadedPhotos].textContent = '✓';

    uploadedPhotos++;
    if (uploadedPhotos === 3) {
        document.getElementById('locationInput').style.display = 'block';
        document.getElementById('generateButton').style.display = 'block';
        document.getElementById('uploadButton').style.display = 'none';
    }
}

function showGeneratedImage(imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = '100%';
    img.style.borderRadius = '8px';

    const container = document.querySelector('.container');
    container.innerHTML = '';
    container.appendChild(img);

    tg.MainButton.setText('Создать новую фотосессию');
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
        window.location.reload();
    });
}
