(() => {
    function onLoad(e: Event) {
        removeEventListener(e.type, onLoad, false);
        init();
    }


    function init() {
        initContext();
        clearContext();
        cancelAnimationFrame(animationFrameId);
        initTime();
        draw();
        animate();
    }


    function onResize() {
        resizeCanvas();
        init();
    }


    function resizeCanvas() {
        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;
    }


    function updateCurrentTime() {
        let date = new Date;
        currentTime.second = date.getSeconds();
        currentTime.minute = date.getMinutes();
        currentTime.hour = date.getHours();
    }


    function initContext() {
        ctx = (document.querySelector('#canvas') as HTMLCanvasElement).getContext('2d');
        resizeCanvas();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineCap = 'round';

        clockRadius = ((((ctx.canvas.width > ctx.canvas.height) ? ctx.canvas.height : ctx.canvas.width) / 5) * 4) / 2;
    }


    function clearContext() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }


    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        draw();
    }


    function draw() {
        clearContext();
        updateCurrentTime();
        blackBackRectangle.fill();
        // clockCircle.stroke();

        let hd: TimeData;
        let md: TimeData;

        for (let _hd of hourDataArray) {
            if ((_hd.text.text === '12' ? 0 : parseInt(_hd.text.text, 10)) === (currentTime.hour >= 12 ? currentTime.hour - 12 : currentTime.hour)) {
                _hd.circle.radius = 60;
                hd = _hd;
            } else _hd.circle.radius = 45;
            _hd.circle.fill();
            _hd.text.fill();
        }
        
        hd.text.fill();

        for (let _md of minuteDataArray) {
            if (parseInt(_md.text.text, 10) === currentTime.minute) {
                md = _md;
            }
        }

        // md.circle.radius = 20;
        md.circle.stroke();

        for (let sd of secondDataArray) {
            if (parseInt(sd.text.text, 10) === currentTime.second) {
                sd.text.font = '25px Showcard Gothic';
                sd.needle.stroke();
            }
            else sd.text.font = '14px Showcard Gothic';

            sd.text.fill();
        }

        md.needle.stroke();
        hd.needle.stroke();

        centerCircle.fill();
    }


    function initTimeDataArray(
        arrayLength: number,
        degreeInterval: number,
        needleDistance: number,
        needleColor: string,
        needleWidth: number,
        textDistance: number,
        args?: {
            font?: string,
            textColor?: string
        }
    ) {
        let timeDataArray: TimeData[] = [];
        let degree = degreeForZero;

        for (let i = 0; i < arrayLength; i++) {
            let item = i;

            let needle = new Line(ctx);
            needle.strokeStyle = needleColor;
            needle.width = needleWidth;
            needle.from = convertPointToCanvasOrigin(calculPointB(Utils.degreeToRadian(-degree + 180), 20));;
            needle.to = convertPointToCanvasOrigin(calculPointB(Utils.degreeToRadian(-degree), needleDistance));

            let textPoint = Point.withPoint(calculPointB(Utils.degreeToRadian(-degree), textDistance));
            let text = new Text(ctx, item.toString(), convertPointToCanvasOrigin(textPoint));

            if (args) {
                if (args.font) text.font = args.font;
                if (args.textColor) text.fillStyle = args.textColor;
            }

            degree += degreeInterval;
            
            timeDataArray.push({
                text: text,
                needle: needle
            });
        }

        return timeDataArray;
    }


    function calculPointB(angle: number, radius) {
        return new Point(Math.cos(angle)* radius, Math.sin(angle) * radius);
    }


    function convertPointToCanvasOrigin(p: Point) {
        let pc = new Point(p.x + (ctx.canvas.width / 2), ctx.canvas.height - (p.y + (ctx.canvas.height / 2)));

        return pc;
    }


    function initTime() {
        updateCurrentTime();

        secondDataArray = initTimeDataArray(maxSeconds, secondsDegreeInterval, clockRadius - 20, '#8cbe51', 5, clockRadius, {font: '15px Showcard Gothic', textColor: '#BFBFBF'});
        secondDataArray.find((_sd) => {
            return _sd.text.text === '0';
        }).text.text = '00';

        minuteDataArray = initTimeDataArray(maxSeconds, secondsDegreeInterval, clockRadius - 40, '#ef4f6d', 10, clockRadius - 50);

        hourDataArray = initTimeDataArray(maxHours, hoursDegreeInterval, clockRadius - 150, '#2ba3ce', 15, clockRadius - 75, {font: '70px Showcard Gothic', textColor: '#000'});
        hourDataArray.find((_hd) => {
            return _hd.text.text === '0';
        }).text.text = '12';

        //init minuteDataArray[].circle
        for (let i in minuteDataArray) minuteDataArray[i].circle = new Circle(ctx, 15, secondDataArray[i].text.point, {strokeStyle: minuteCicleStyleArray[i], width:5});

        //init hourDataArray[].circle
        for (let i in hourDataArray) hourDataArray[i].circle = new Circle(ctx, 45, hourDataArray[i].text.point, {fillStyle: hourCicleStyleArray[i]});

        //init clockCircle
        // clockCircle = new Circle(ctx, clockRadius, convertPointToCanvasOrigin(new Point), {strokeStyle: '#fff', width: 2});

        //init centerCircle
        centerCircle = new Circle(ctx, 5, convertPointToCanvasOrigin(new Point), {fillStyle: '#fff'});

        //init blackBackRectangle
        blackBackRectangle = new Rectangle(ctx, {
            x: 0,
            y: 0,
            width: ctx.canvas.width,
            height: ctx.canvas.height,
        });
    }


    class Rectangle {
        x: number = 0;
        y: number = 0;
        width: number = 0;
        height: number = 0;
        fillStyle: string = '#000';
        strokeStyle: string = '#000';
        lineWidth: number = 1;
    
        constructor(
            public ctx: CanvasRenderingContext2D,
            args?: {
                x?: number,
                y?: number,
                width?: number,
                height?: number,
                fillStyle?: string,
                strokeStyle?: string,
                lineWidth?: number,
            }
        ) {
            if (args) {
                if (args.x) this.x = args.x;
                if (args.y) this.y = args.y;
                if (args.width) this.width = args.width;
                if (args.height) this.height = args.height;
                if (args.fillStyle) this.fillStyle = args.fillStyle;
                if (args.strokeStyle) this.strokeStyle = args.strokeStyle;
                if (args.lineWidth) this.lineWidth = args.lineWidth;
            }
        }
    
        stroke() {
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        fill() {
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        draw() {
            this.stroke();
            this.fill();
        }
        
        clear() {
            this.ctx.clearRect(this.x, this.y, this.width, this.height);
        }
    }


    class Line {
        from = new Point;
        to = new Point;
        strokeStyle = '#000';
        width = 1;

        constructor(public ctx: CanvasRenderingContext2D) {}

        stroke() {
            this.ctx.beginPath();
            this.ctx.moveTo(this.from.x, this.from.y);
            this.ctx.lineTo(this.to.x, this.to.y);
            this.ctx.lineWidth = this.width;
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }


    class Point {
        constructor(
            public x: number = 0,
            public y: number = 0
        ) {}

        static withPoint(p: Point) {
            return new Point(p.x, p.y);
        }
    }


    class Text {
        fillStyle = '#000';
        font = '10px serif';

        constructor(
            public ctx: CanvasRenderingContext2D,
            public text: string,
            public point: Point = new Point,
            args?: {
                fillStyle?: string,
                font?: string
            }
        ) {
            if (args) {
                if (args.fillStyle) this.fillStyle = args.fillStyle;
                if (args.font) this.font = args.font;
            }
        }

        fill() {
            this.ctx.font = this.font;
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillText(this.text, this.point.x, this.point.y);
        }
    }


    class Circle {
        fillStyle: string = '#000';
        strokeStyle: string = '#000';
        width: number = 1;

        constructor(
            public ctx: CanvasRenderingContext2D,
            public radius: number,
            public center = new Point,
            args?: {
                fillStyle?: string,
                strokeStyle?: string,
                width?: number,
            } 
        ) {
            if (args) {
                if (args.fillStyle) this.fillStyle = args.fillStyle;
                if (args.strokeStyle) this.strokeStyle = args.strokeStyle;
                if (args.width) this.width = args.width;
            }
        }

        /* static withRandomXY(context: CanvasRenderingContext2D, maxRadius: number) {
            let circle = new Circle(context,  Utils.getRandomIntInclusive(1, maxRadius));
            circle.x = Utils.getRandomIntInclusive(circle.radius, circle.context.canvas.width - circle.radius);
            circle.y = Utils.getRandomIntInclusive(circle.radius, circle.context.canvas.height - circle.radius);

            return circle;
        } */

        private _arc() {
            this.ctx.arc(this.center.x, this.center.y, this.radius, Utils.degreeToRadian(0), Utils.degreeToRadian(360), false);
        }

        fill() {
            this.ctx.beginPath();
            this._arc();
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fill();
            this.ctx.closePath();
        }

        stroke() {
            this.ctx.beginPath();
            this._arc();
            this.ctx.lineWidth = this.width;
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }


    class Utils {
        static degreeToRadian(degree: number) {
            return (degree * Math.PI) / 180;
        }

        static getRandomIntInclusive(min: number, max: number) {
            min = Math.ceil(min);
            max = Math.floor(max);

            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /* static isInInterval(x: number, min: number, max: number) {
            return (min <= x) && (x <= max);
        } */
    }


    interface TimeData {
        text: Text;
        needle: Line;
        circle?: Circle;
    }


    const degreeForZero = 270;
    const secondsDegreeInterval = 6;
    const hoursDegreeInterval = 30;
    const maxSeconds = 60;
    const maxHours = 12;
    let ctx: CanvasRenderingContext2D;
    let currentTime: {hour: number, minute: number, second: number} = {hour: 0, minute: 0, second: 0};
    let clockRadius;
    let secondDataArray: TimeData[] = [];
    let minuteDataArray: TimeData[] = [];
    let hourDataArray: TimeData[] = [];
    let hourCicleStyleArray: string[] = ['#63f7db', '#8004f2', '#d82141', '#384a40', '#944ef0', '#d50fc1', '#92d8ea', '#249104', '#67a07e', '#47a965', '#ba9796', '#436c42'];
    let minuteCicleStyleArray: string[] = ['#4e4cf5', '#309a8a', '#49a196', '#5c756a', '#287db8', '#cbfc78', '#2ff277', '#9af532', '#16a9ca', '#62b5c5', '#8c018b', '#c67d4d', '#d0bc7e', '#234662', '#eb7fdc', '#8c05e1', '#5a3e6a', '#8caaaf', '#d1e26e', '#01399a', '#69b587', '#e7acf3', '#40134d', '#4c3454', '#66d319', '#618d02', '#623f2a', '#975e10', '#fb4b35', '#669b4f', '#671d1c', '#b5c479', '#b98037', '#49089e', '#c0977c', '#5207a2', '#37fb2f', '#c6ddf4', '#80664a', '#40f72a', '#7a9a33', '#783512', '#528df9', '#25952a', '#b77e04', '#ae7f3f', '#190568', '#899605', '#d137ff', '#fb1eb5', '#a73bb3', '#6e16d3', '#79145a', '#630048', '#40aac0', '#078454', '#2fa18f', '#c08375', '#fceeba', '#9c367d'];
    let animationFrameId: number;
    let centerCircle: Circle;
    // let clockCircle: Circle;
    let blackBackRectangle: Rectangle;

    addEventListener('load', onLoad, false);
    addEventListener('resize', onResize, false);
})();
