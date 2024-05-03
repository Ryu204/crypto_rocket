const config = {
    "spawner": {
        "interval": 2.5,
        "timePerScreenWidth": 5,
        "sizePerBird": 1.5,
        "maxAmplitude": 200,
        "fuel": 2
    },
    "bird": {
        "beginAmplitudePerWidth": 0.7,
        "beginAnimationSpeed": 0.006,
        "width": 20,
        "scale": 2,
        "pushStrength": 3000,
        "maxVelocityY": 200,
        "omegaPerVelY": 0.03,
        "fuel": 2,
        "fuelSpeed": 1.5,
        "fallFuelSpeedScale": 0.2
    },
    "game": {
        "width": Math.min(500, screen.availWidth - 10),
        "height": Math.min(500, screen.availHeight - 10),
        "gravity": 1000
    }
}

export default config