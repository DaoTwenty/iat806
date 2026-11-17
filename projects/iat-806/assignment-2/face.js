const TILT_ON = 10;
const TILT_OFF = 4;
const FACE_LATENCY_MS = 100;

const LEFT_EYE = 263;
const RIGHT_EYE = 33;

class FaceInput {

    constructor() {
        this.video = null;
        this.faces = [];
        this.hits = [];
        this.tilt = 0;
        this.baseline = null;
        this.tilted = false;
        this.points = null;
    }

    async setup() {
        this.video = createCapture(VIDEO);
        this.video.size(640, 480);
        this.video.hide();
        this.face_mesh = await ml5.faceMesh({ maxFaces: 1 });
        this.face_mesh.detectStart(this.video, (results) => {
            this.faces = results;
        });
    }

    to_canvas_pos(keypoint) {
        let canvas_x = width - keypoint.x * width / this.video.width;
        let canvas_y = keypoint.y * height / this.video.height;
        return { x: canvas_x, y: canvas_y };
    }

    update() {
        this.hits = [];
        if (this.faces.length == 0) {
            this.points = null;
            return;
        }
        let k = this.faces[0].keypoints;
        let left = this.to_canvas_pos(k[LEFT_EYE]);
        let right = this.to_canvas_pos(k[RIGHT_EYE]);
        this.points = { left: left, right: right };

        let angle = degrees(atan2(right.y - left.y, right.x - left.x));
        if (this.baseline == null) {
            this.baseline = angle;
        }
        this.tilt = angle - this.baseline;
        if (!this.tilted && this.tilt < -TILT_ON) {
            this.tilted = true;
            this.hits.push("kick");
        } else if (!this.tilted && this.tilt > TILT_ON) {
            this.tilted = true;
            this.hits.push("snare");
        } else if (abs(this.tilt) < TILT_OFF) {
            this.tilted = false;
        }
    }

    drawVideo() {
        background(0);
        if (this.video) {
            push();
            translate(width, 0);
            scale(-1, 1);
            tint(255, 90);
            image(this.video, 0, 0, width, height);
            pop();
        }
    }

    drawFace() {
        if (!this.points) {
            return;
        }
        let p = this.points;
        push();
        strokeWeight(5);
        stroke(this.tilted ? (this.tilt < 0 ? COLORS.kick : COLORS.snare) : 255);
        line(p.left.x, p.left.y, p.right.x, p.right.y);
        pop();
    }

}
