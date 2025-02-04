window.onload = function () {
    wpf_confetti_animation();
}


/**
 * Add confetti to the canvas element on the confirmation message
 *
 * @link  https://wpforms.com/developers/how-to-add-confetti-animation-to-confirmation-message/
 *
 */

function wpf_confetti_animation() {

//If the canvas ID does not exist on the page, this script will not run

    if (document.querySelector('#canvas') !== null) {

        class Progress {
            constructor(param = {}) {
                this.timestamp = null;
                this.duration = param.duration || Progress.CONST.DURATION;
                this.progress = 0;
                this.delta = 0;
                this.progress = 0;
                this.isLoop = !!param.isLoop;

                this.reset();
            }

            static get CONST() {
                return {
                    DURATION: 1000
                };
            }

            reset() {
                this.timestamp = null;
            }

            start(now) {
                this.timestamp = now;
            }

            tick(now) {
                if (this.timestamp) {
                    this.delta = now - this.timestamp;
                    this.progress = Math.min(this.delta / this.duration, 1);

                    if (this.progress >= 1 && this.isLoop) {
                        this.start(now);
                    }

                    return this.progress;
                } else {
                    return 0;
                }
            }
        }

        class Confetti {
            constructor(param) {
                this.parent = param.elm || document.body;
                this.canvas = document.createElement("canvas");
                this.ctx = this.canvas.getContext("2d");
                this.width = param.width || this.parent.offsetWidth;
                this.height = param.height || this.parent.offsetHeight;
                this.length = param.length || Confetti.CONST.PAPER_LENGTH;
                this.yRange = param.yRange || this.height * 2;
                this.progress = new Progress({
                    duration: param.duration,
                    isLoop: true
                });
                this.rotationRange = typeof param.rotationLength === "number" ? param.rotationRange
                    : 10;
                this.speedRange = typeof param.speedRange === "number" ? param.speedRange
                    : 10;
                this.sprites = [];

                this.canvas.style.cssText = [
                    "display: block",
                    "position: absolute",
                    "top: 0",
                    "left: 0",
                    "pointer-events: none"
                ].join(";");

                this.render = this.render.bind(this);

                this.build();

                this.parent.appendChild(this.canvas);
                this.progress.start(performance.now());

                requestAnimationFrame(this.render);
            }

            static get CONST() {
                return {
                    //CUSTOMIZE: This will adjust how wide the paper is
                    SPRITE_WIDTH: 9,
                    //CUSTOMIZE: This will adjust how tall the paper is
                    SPRITE_HEIGHT: 16,
                    //CUSTOMIZE: This will adjust how much confetti appears, raise the number for less confetti
                    PAPER_LENGTH: 100,
                    //CUSTOMIZE: This will control the rotation rate of each piece of confetti
                    ROTATION_RATE: 50,
                    //CUSTOMIZE: These are the default colors used for the confetti. You can change these numbers or add to them.
                    //CUSTOMIZE: Separate adding new colors by a comma after each new color added.
                    COLORS: [
                        "#EF5350",
                        "#EC407A",
                        "#AB47BC",
                        "#7E57C2",
                        "#5C6BC0",
                        "#42A5F5",
                        "#29B6F6",
                        "#26C6DA",
                        "#26A69A",
                        "#66BB6A",
                        "#9CCC65",
                        "#D4E157",
                        "#FFEE58",
                        "#FFCA28",
                        "#FFA726",
                        "#FF7043",
                        "#8D6E63",
                        "#BDBDBD",
                        "#78909C"]
                };
            }

            build() {
                for (let i = 0; i < this.length; ++i) {
                    let canvas = document.createElement("canvas"),
                        ctx = canvas.getContext("2d");

                    canvas.width = Confetti.CONST.SPRITE_WIDTH;
                    canvas.height = Confetti.CONST.SPRITE_HEIGHT;

                    canvas.position = {
                        initX: Math.random() * this.width,
                        initY: -canvas.height - Math.random() * this.yRange
                    };

                    canvas.rotation = (this.rotationRange / 2) - Math.random() * this.rotationRange;
                    canvas.speed = (this.speedRange / 2) + Math.random() * (this.speedRange / 2);

                    ctx.save();
                    ctx.fillStyle = Confetti.CONST.COLORS[(Math.random() * Confetti.CONST.COLORS.length) | 0];
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.restore();

                    this.sprites.push(canvas);
                }
            }

            render(now) {
                let progress = this.progress.tick(now);

                this.canvas.width = this.width;
                this.canvas.height = this.height;

                for (let i = 0; i < this.length; ++i) {
                    this.ctx.save();
                    this.ctx.translate(
                        this.sprites[i].position.initX + this.sprites[i].rotation * Confetti.CONST.ROTATION_RATE * progress,
                        this.sprites[i].position.initY + progress * (this.height + this.yRange)
                    );
                    this.ctx.rotate(this.sprites[i].rotation);
                    this.ctx.drawImage(
                        this.sprites[i],
                        -Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)) / 2,
                        -Confetti.CONST.SPRITE_HEIGHT / 2,
                        Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)),
                        Confetti.CONST.SPRITE_HEIGHT
                    );
                    this.ctx.restore();
                }

                requestAnimationFrame(this.render);
            }
        }

        (() => {
            //CUSTOMIZE: This will control the speed of how fast the confetti falls, raise the number for a slower fall.
            const DURATION = 8000,
                //CUSTOMIZE: This number controls how much confetti will appear on the screen. For more confetti, raise the number.
                LENGTH = 120;

            new Confetti({
                width: window.innerWidth,
                height: window.innerHeight,
                length: LENGTH,
                duration: DURATION
            });

            setTimeout(() => {
                new Confetti({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    length: LENGTH,
                    duration: DURATION
                });
            }, DURATION / 2);
        })();

    }
}

