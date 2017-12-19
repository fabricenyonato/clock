(function () {
    function onLoad(e) {
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
        var date = new Date;
        currentTime.second = date.getSeconds();
        currentTime.minute = date.getMinutes();
        currentTime.hour = date.getHours();
    }
    function initContext() {
        ctx = document.querySelector('#canvas').getContext('2d');
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
        var hd;
        var md;
        for (var _i = 0, hourDataArray_1 = hourDataArray; _i < hourDataArray_1.length; _i++) {
            var _hd = hourDataArray_1[_i];
            if ((_hd.text.text === '12' ? 0 : parseInt(_hd.text.text, 10)) === (currentTime.hour >= 12 ? currentTime.hour - 12 : currentTime.hour)) {
                _hd.circle.radius = 60;
                hd = _hd;
            }
            else
                _hd.circle.radius = 45;
            _hd.circle.fill();
            _hd.text.fill();
        }
        hd.text.fill();
        for (var _a = 0, minuteDataArray_1 = minuteDataArray; _a < minuteDataArray_1.length; _a++) {
            var _md = minuteDataArray_1[_a];
            if (parseInt(_md.text.text, 10) === currentTime.minute) {
                md = _md;
            }
        }
        // md.circle.radius = 20;
        md.circle.stroke();
        for (var _b = 0, secondDataArray_1 = secondDataArray; _b < secondDataArray_1.length; _b++) {
            var sd = secondDataArray_1[_b];
            if (parseInt(sd.text.text, 10) === currentTime.second) {
                sd.text.font = '25px Showcard Gothic';
                sd.needle.stroke();
            }
            else
                sd.text.font = '14px Showcard Gothic';
            sd.text.fill();
        }
        md.needle.stroke();
        hd.needle.stroke();
        centerCircle.fill();
    }
    function initTimeDataArray(arrayLength, degreeInterval, needleDistance, needleColor, needleWidth, textDistance, args) {
        var timeDataArray = [];
        var degree = degreeForZero;
        for (var i = 0; i < arrayLength; i++) {
            var item = i;
            var needle = new Line(ctx);
            needle.strokeStyle = needleColor;
            needle.width = needleWidth;
            needle.from = convertPointToCanvasOrigin(calculPointB(Utils.degreeToRadian(-degree + 180), 20));
            ;
            needle.to = convertPointToCanvasOrigin(calculPointB(Utils.degreeToRadian(-degree), needleDistance));
            var textPoint = Point.withPoint(calculPointB(Utils.degreeToRadian(-degree), textDistance));
            var text = new Text(ctx, item.toString(), convertPointToCanvasOrigin(textPoint));
            if (args) {
                if (args.font)
                    text.font = args.font;
                if (args.textColor)
                    text.fillStyle = args.textColor;
            }
            degree += degreeInterval;
            timeDataArray.push({
                text: text,
                needle: needle
            });
        }
        return timeDataArray;
    }
    function calculPointB(angle, radius) {
        return new Point(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    function convertPointToCanvasOrigin(p) {
        var pc = new Point(p.x + (ctx.canvas.width / 2), ctx.canvas.height - (p.y + (ctx.canvas.height / 2)));
        return pc;
    }
    function initTime() {
        updateCurrentTime();
        secondDataArray = initTimeDataArray(maxSeconds, secondsDegreeInterval, clockRadius - 20, '#8cbe51', 5, clockRadius, { font: '15px Showcard Gothic', textColor: '#BFBFBF' });
        secondDataArray.find(function (_sd) {
            return _sd.text.text === '0';
        }).text.text = '00';
        minuteDataArray = initTimeDataArray(maxSeconds, secondsDegreeInterval, clockRadius - 40, '#ef4f6d', 10, clockRadius - 50);
        hourDataArray = initTimeDataArray(maxHours, hoursDegreeInterval, clockRadius - 150, '#2ba3ce', 15, clockRadius - 75, { font: '70px Showcard Gothic', textColor: '#000' });
        hourDataArray.find(function (_hd) {
            return _hd.text.text === '0';
        }).text.text = '12';
        //init minuteDataArray[].circle
        for (var i in minuteDataArray)
            minuteDataArray[i].circle = new Circle(ctx, 15, secondDataArray[i].text.point, { strokeStyle: minuteCicleStyleArray[i], width: 5 });
        //init hourDataArray[].circle
        for (var i in hourDataArray)
            hourDataArray[i].circle = new Circle(ctx, 45, hourDataArray[i].text.point, { fillStyle: hourCicleStyleArray[i] });
        //init clockCircle
        // clockCircle = new Circle(ctx, clockRadius, convertPointToCanvasOrigin(new Point), {strokeStyle: '#fff', width: 2});
        //init centerCircle
        centerCircle = new Circle(ctx, 5, convertPointToCanvasOrigin(new Point), { fillStyle: '#fff' });
        //init blackBackRectangle
        blackBackRectangle = new Rectangle(ctx, {
            x: 0,
            y: 0,
            width: ctx.canvas.width,
            height: ctx.canvas.height,
        });
    }
    var Rectangle = /** @class */ (function () {
        function Rectangle(ctx, args) {
            this.ctx = ctx;
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.fillStyle = '#000';
            this.strokeStyle = '#000';
            this.lineWidth = 1;
            if (args) {
                if (args.x)
                    this.x = args.x;
                if (args.y)
                    this.y = args.y;
                if (args.width)
                    this.width = args.width;
                if (args.height)
                    this.height = args.height;
                if (args.fillStyle)
                    this.fillStyle = args.fillStyle;
                if (args.strokeStyle)
                    this.strokeStyle = args.strokeStyle;
                if (args.lineWidth)
                    this.lineWidth = args.lineWidth;
            }
        }
        Rectangle.prototype.stroke = function () {
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        };
        Rectangle.prototype.fill = function () {
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        Rectangle.prototype.draw = function () {
            this.stroke();
            this.fill();
        };
        Rectangle.prototype.clear = function () {
            this.ctx.clearRect(this.x, this.y, this.width, this.height);
        };
        return Rectangle;
    }());
    var Line = /** @class */ (function () {
        function Line(ctx) {
            this.ctx = ctx;
            this.from = new Point;
            this.to = new Point;
            this.strokeStyle = '#000';
            this.width = 1;
        }
        Line.prototype.stroke = function () {
            this.ctx.beginPath();
            this.ctx.moveTo(this.from.x, this.from.y);
            this.ctx.lineTo(this.to.x, this.to.y);
            this.ctx.lineWidth = this.width;
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.stroke();
            this.ctx.closePath();
        };
        return Line;
    }());
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.withPoint = function (p) {
            return new Point(p.x, p.y);
        };
        return Point;
    }());
    var Text = /** @class */ (function () {
        function Text(ctx, text, point, args) {
            if (point === void 0) { point = new Point; }
            this.ctx = ctx;
            this.text = text;
            this.point = point;
            this.fillStyle = '#000';
            this.font = '10px serif';
            if (args) {
                if (args.fillStyle)
                    this.fillStyle = args.fillStyle;
                if (args.font)
                    this.font = args.font;
            }
        }
        Text.prototype.fill = function () {
            this.ctx.font = this.font;
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillText(this.text, this.point.x, this.point.y);
        };
        return Text;
    }());
    var Circle = /** @class */ (function () {
        function Circle(ctx, radius, center, args) {
            if (center === void 0) { center = new Point; }
            this.ctx = ctx;
            this.radius = radius;
            this.center = center;
            this.fillStyle = '#000';
            this.strokeStyle = '#000';
            this.width = 1;
            if (args) {
                if (args.fillStyle)
                    this.fillStyle = args.fillStyle;
                if (args.strokeStyle)
                    this.strokeStyle = args.strokeStyle;
                if (args.width)
                    this.width = args.width;
            }
        }
        /* static withRandomXY(context: CanvasRenderingContext2D, maxRadius: number) {
            let circle = new Circle(context,  Utils.getRandomIntInclusive(1, maxRadius));
            circle.x = Utils.getRandomIntInclusive(circle.radius, circle.context.canvas.width - circle.radius);
            circle.y = Utils.getRandomIntInclusive(circle.radius, circle.context.canvas.height - circle.radius);

            return circle;
        } */
        Circle.prototype._arc = function () {
            this.ctx.arc(this.center.x, this.center.y, this.radius, Utils.degreeToRadian(0), Utils.degreeToRadian(360), false);
        };
        Circle.prototype.fill = function () {
            this.ctx.beginPath();
            this._arc();
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fill();
            this.ctx.closePath();
        };
        Circle.prototype.stroke = function () {
            this.ctx.beginPath();
            this._arc();
            this.ctx.lineWidth = this.width;
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.stroke();
            this.ctx.closePath();
        };
        return Circle;
    }());
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.degreeToRadian = function (degree) {
            return (degree * Math.PI) / 180;
        };
        Utils.getRandomIntInclusive = function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        return Utils;
    }());
    var degreeForZero = 270;
    var secondsDegreeInterval = 6;
    var hoursDegreeInterval = 30;
    var maxSeconds = 60;
    var maxHours = 12;
    var ctx;
    var currentTime = { hour: 0, minute: 0, second: 0 };
    var clockRadius;
    var secondDataArray = [];
    var minuteDataArray = [];
    var hourDataArray = [];
    var hourCicleStyleArray = ['#63f7db', '#8004f2', '#d82141', '#384a40', '#944ef0', '#d50fc1', '#92d8ea', '#249104', '#67a07e', '#47a965', '#ba9796', '#436c42'];
    var minuteCicleStyleArray = ['#4e4cf5', '#309a8a', '#49a196', '#5c756a', '#287db8', '#cbfc78', '#2ff277', '#9af532', '#16a9ca', '#62b5c5', '#8c018b', '#c67d4d', '#d0bc7e', '#234662', '#eb7fdc', '#8c05e1', '#5a3e6a', '#8caaaf', '#d1e26e', '#01399a', '#69b587', '#e7acf3', '#40134d', '#4c3454', '#66d319', '#618d02', '#623f2a', '#975e10', '#fb4b35', '#669b4f', '#671d1c', '#b5c479', '#b98037', '#49089e', '#c0977c', '#5207a2', '#37fb2f', '#c6ddf4', '#80664a', '#40f72a', '#7a9a33', '#783512', '#528df9', '#25952a', '#b77e04', '#ae7f3f', '#190568', '#899605', '#d137ff', '#fb1eb5', '#a73bb3', '#6e16d3', '#79145a', '#630048', '#40aac0', '#078454', '#2fa18f', '#c08375', '#fceeba', '#9c367d'];
    var animationFrameId;
    var centerCircle;
    // let clockCircle: Circle;
    var blackBackRectangle;
    addEventListener('load', onLoad, false);
    addEventListener('resize', onResize, false);
})();
