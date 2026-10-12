class AngryPianist {
    constructor(max_interruptions, angry_duration) {
        this.times_interrupted = 0;
        this.max_int = max_interruptions;
        this.dur = angry_duration;
        this.is_angry = false;
        this.angry_start = -1;
    }

    async setup() {
        let pianist_files = [
            "assets/angry/pianist_angry0.png",
            "assets/angry/pianist_angry1.png",
            "assets/angry/pianist_angry2.png",
            "assets/angry/pianist_angry3.png",
            "assets/angry/pianist_angry4.png",
            "assets/angry/pianist_angry5.png",
            "assets/angry/pianist_angry6.png",
            "assets/angry/pianist_angry7.png"
        ];
        let pianist_images = [];
        for (let i = 0; i < pianist_files.length; i++) {
            pianist_images.push(await loadImage(pianist_files[i]));
        }
        this.animation = new FramesAnimation(pianist_images, 10, width/2, height/2 - 80, 0, 250, true, 0);

        this.text_animations = [];
        for (let j = 0; j < 3; j++) {
            let text_files = [
                `assets/angry/text${j}_angry0.png`,
                `assets/angry/text${j}_angry1.png`,
                `assets/angry/text${j}_angry2.png`,
                `assets/angry/text${j}_angry3.png`,
                `assets/angry/text${j}_angry4.png`,
                `assets/angry/text${j}_angry5.png`,
                `assets/angry/text${j}_angry6.png`,
                `assets/angry/text${j}_angry7.png`
            ];
            let text_images = [];
            for (let i = 0; i < text_files.length; i++) {
                text_images.push(await loadImage(text_files[i]));
            }
            this.text_animations.push(new FramesAnimation(text_images, 10, width/2, height/2 + 75, 0, 125, true, 0));
        }

        this.audio = await loadSound("assets/angry/pianist_angry_loop.mp3");
    }

    interrupt(callback) {
        this.times_interrupted++;
        if (this.times_interrupted >= this.max_int) {
            this.callback = callback;
            this.times_interrupted = 0;
            this.is_angry = true;
            this.animation.active = true;
            this.angry_start = frameCount;
            this.random_text = this.text_animations[Math.floor(Math.random() * this.text_animations.length)];
            return true;
        }
        return false;
    }

    loop() {
        // only render if pianist is angry
        if (this.is_angry) {
            this.animation.draw();
            this.random_text.draw();

            if (!this.audio.isPlaying()) {
                // p5.sound 0.4: loop() only sets the flag, start() plays
                this.audio.loop(true);
                this.audio.start();
            }

            if (frameCount - this.angry_start > this.dur) {
                this.is_angry = false
                this.animation.active = false;
                this.audio.stop();
                this.callback();
                this.callback = null;
            }
        }
    }
}