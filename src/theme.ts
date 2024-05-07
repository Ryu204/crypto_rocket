import Phaser from 'phaser'

const baseText: Phaser.Types.GameObjects.Text.TextStyle = {
    fontSize: 40,
    fontFamily: 'Minecraft',
    stroke: '#000000',
    strokeThickness: 2
}

const titleText = structuredClone(baseText)
titleText.fontSize = 50
titleText.color = '#ff0000'

const scoreText: typeof baseText = structuredClone(baseText) 
scoreText.fontSize = 40

const disabledText = structuredClone(baseText)
disabledText.color = '#444444'

const theme = {
    baseText: baseText,
    scoreText: scoreText,
    titleText: titleText,
    disabledText: disabledText,
    background: 0x443355,
}

export default theme;