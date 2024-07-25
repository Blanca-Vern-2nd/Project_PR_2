let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = 'model.json';
    const metadataURL = 'metadata.json';

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        webcam = new tmImage.Webcam(200, 200, true); // Flip horizontally
        await webcam.setup(); // Request access to the webcam
        await webcam.play(); // Start the webcam
        window.requestAnimationFrame(loop);

        document.getElementById('webcam').appendChild(webcam.canvas);
        labelContainer = document.createElement('div');
        document.body.appendChild(labelContainer);
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement('div'));
        }
    } catch (error) {
        console.error('Error during initialization:', error);
        document.getElementById('prediction').innerText = 'Error loading model or setting up webcam';
    }
}

async function loop() {
    webcam.update(); // Update the webcam frame
    await predict(); // Make predictions
    window.requestAnimationFrame(loop);
}

async function predict() {
    try {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    } catch (error) {
        console.error('Error during prediction:', error);
        document.getElementById('prediction').innerText = 'Error during prediction';
    }
}

init();
