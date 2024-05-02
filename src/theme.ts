import Phaser from 'phaser'

const baseText: Phaser.Types.GameObjects.Text.TextStyle = {
    fontSize: 40,
    fontFamily: 'Helvetica'
}

const titleText = structuredClone(baseText)
titleText.fontSize = 50

const scoreText: typeof baseText = structuredClone(baseText) 
scoreText.fontSize = 50

const theme = {
    baseText: baseText,
    scoreText: scoreText,
    titleText: titleText
}

export default theme;