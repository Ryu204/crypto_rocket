import Phaser from 'phaser'
import { BaseScene } from './baseScene';
import theme from './theme';

export default class Textfield extends Phaser.GameObjects.Text {
    private isEntering = false
    private currentText = ''
    private static isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    private hiddenInput: HTMLElement | undefined

    constructor(scene: BaseScene, onSubmit: (text: string) => void, prompt = 'Enter', x: number = 0, y: number = 0, maxLength: number = 10) {
        super(scene, x, y, prompt, theme.disabledText)
        this.checkMobile()
        this.setOrigin(0, 0.5)
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                if (this.isEntering)
                    return;
                this.isEntering = true
                this.text = this.currentText + '_'
                if (Textfield.isMobile)
                    this.hiddenInput!.focus()
            })

        this.scene.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (event: KeyboardEvent) => {
            if (!this.isEntering) {
                return;
            }
            // User wants to submit
            if (event.key == 'Enter') {
                if (this.currentText.length == 0) {
                    this.scene.cameras.main.shake(30, .01, true)
                    this.text = prompt
                }
                else {
                    this.text = this.currentText
                    onSubmit(this.currentText)
                }     
                this.isEntering = false               
                return
            // Implement backspace
            } else if (event.key == 'Backspace' && this.currentText.length > 0) {
                this.currentText = this.currentText.slice(0, -1);
            // Add any other characters you want to allow    
            } else if (event.key.length == 1 && event.key.match(/[a-zA-Z0-9\s\-_]/) && this.currentText.length < maxLength) {
                this.currentText += event.key;
            // Gently informs the player that its time to stop typing
            } else if (this.currentText.length == maxLength) {
                this.scene.cameras.main.shake(30, .01, true);
            }
            this.text = this.currentText + '_'
        })
    }

    private checkMobile() {
        if (!Textfield.isMobile)
            return

        this.hiddenInput = document.createElement('input');
        this.hiddenInput.style.position = 'absolute'
        this.hiddenInput.style.opacity = '0'
        this.hiddenInput.style.zIndex = '-1'
        document.body.appendChild(this.hiddenInput)

        const self = this

        this.hiddenInput.addEventListener('input', function (event: any) {
            self.currentText = event.target.value;
            self.text = self.currentText + '_'
        });
    }
}