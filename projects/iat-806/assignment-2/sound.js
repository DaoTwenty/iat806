// sound playing engine

class SoundEngine {

    constructor() {
        this.sounds = {};
    }

    async load(files) {
        for (let name in files) {
            this.sounds[name] = await loadSound(files[name]);
        }
        // make metronome clicks quiet
        this.sounds.click.amp(0.3);
        this.sounds.click_hi.amp(0.3);
    }

    // browsers only allow sound after a click
    start() {
        userStartAudio();
    }

    play(name) {
        this.sounds[name].play();
    }

}
