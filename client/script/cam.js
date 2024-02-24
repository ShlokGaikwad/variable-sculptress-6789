const recordButton = document.getElementById('recordButton');
const video = document.getElementById('video');

recordButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
});
