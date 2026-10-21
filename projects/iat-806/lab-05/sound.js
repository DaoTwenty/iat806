// class for sounds playing iteratively
class IterativeSound {
  // volume goes from 0 (silent) to 1 (full)
  constructor(files, volume = 1) {
    this.files = files;
    this.volume = volume;
    this.start = 0;
    this.num = this.files.length;
  }

  // loading sounds async
  async setup() {
    this.sounds = [];
    for (let i = 0; i < this.files.length; i++) {
      this.sounds[i] = await new Audio(this.files[i]);
      this.sounds[i].volume = this.volume;
    }
  }

  // playing current sound and upadting index
  play() {
    this.sounds[this.start].play();
    this.start = (this.start + 1) % this.num;
  }
}