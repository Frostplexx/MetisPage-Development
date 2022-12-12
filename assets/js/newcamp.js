window.onload = async function () {
    const imagesrc = document.getElementById("dmDiscordTagImg");
    const color = await ColorExtract(imagesrc.src)
    document.getElementById("usercard").style.setProperty("--color1", "#" + color);
    const color2 = changeBrightness(hexToRgbA("#" + color), 1.3);
    document.getElementById("usercard").style.setProperty("--color2", color2);

}


/**
 * extracts the most prominent color from an image
 * @param {string} src image source
 * @return {Promise<string>} hex color
 */
function ColorExtract(src) {
    //extract colors and how often they show up
    let img = new Image();
    img.src = src
    img.crossOrigin = "anonymous";
//     wait for image to load
    return  new Promise((resolve, reject) => {
        img.onload = function () {

            let canvas = document.createElement("canvas");
            let c = canvas.getContext('2d');
            c.width = canvas.width = img.width;
            c.height = canvas.height = img.height;
            c.clearRect(0, 0, c.width, c.height);
            c.drawImage(img, 0, 0, img.width, img.height);
            let col, colors = {};
            let pixels, r, g, b, a;
            r = g = b = a = 0;
            pixels = c.getImageData(0, 0, img.width, img.height);
            for (var i = 0, data = pixels.data; i < data.length; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                a = data[i + 3]; // alpha
                // skip pixels >50% transparent
                if (a < (255 / 2))
                    continue;
                col = rgbToHex(r, g, b);
                if (!colors[col])
                    colors[col] = 0;
                colors[col]++;
            }

            //delete colors that exists fewer than 5 times and brightness clamping
            let main_colors = new Map();
            for (var hex in colors) {
                if (colors[hex] > 5 && brightnessByColor("#" + pad(hex)) < 170 && brightnessByColor("#" + pad(hex)) > 30) {
                    main_colors.set(pad(hex), colors[hex])
                }

            }
            //sort them by amount
            let mapSort = new Map([...main_colors.entries()].sort((x, y) => y[1] - x[1]).slice(0, 20));
            let StandardDeviationMap = new Map();

            //key = color
            //value = amount

            //convert hex colors to rgb
            mapSort.forEach(function (value, key) {
                //convert map to rgb array
                let color_values = key.match(/.{2}/g);
                color_values.forEach((x, j) => {
                    color_values[j] = parseInt(color_values[j], 16)
                })
                //calculate colorfulness by calculting the standard deviation of 20 most used colors -> when one part brighter = more of that color = higher standard deviation
                let n = color_values.length
                let mean = color_values.reduce((a, b) => a + b) / n
                let standard_deviation = Math.sqrt(color_values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
                StandardDeviationMap.set(key, standard_deviation)
            })
            //sort by highest deviation = most colorful
            let StandardDeviationSortMap = new Map([...StandardDeviationMap.entries()].sort((k, h) => h[1] - k[1]));
            //return that hex color
            resolve(StandardDeviationSortMap.keys().next().value);
        }
    })
}


/**
 * rgb color to hex valua
 * @param {string} r red component
 * @param {string} g green component
 * @param {string} b blue component
 * @return {string} hex color
 */
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function pad(hex) {
    return ("000000" + hex).slice(-6);
}


/**
 * Calculate brightness value by RGB or HEX color.
 * @param color (String) The color value in RGB or HEX (for example: #000000 || #000 || rgb(0,0,0) || rgba(0,0,0,0))
 * @returns (Number) The brightness value (dark) 0 ... 255 (light)
 */
function brightnessByColor(color) {
    var color = "" + color, isHEX = color.indexOf("#") == 0, isRGB = color.indexOf("rgb") == 0;
    if (isHEX) {
        const hasFullSpec = color.length == 7;
        var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
        if (m) var r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16),
            g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16), b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);
    }
    if (isRGB) {
        var m = color.match(/(\d+){3}/g);
        if (m) var r = m[0], g = m[1], b = m[2];
    }
    if (typeof r != "undefined") return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}


/**
 * takes hex color and converts it to rgba
 * @param {string} hex Hex value of color
 * @return {string} rgba color
 */
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

/**
 * Change brightness of hex color
 * @param {string} rgba rgba value of color
 * @param {number} brightness Brightness multiplier e.g. 2 = 2*brightness
 * @return {string} new brighter or darker color
 */
function changeBrightness(rgba, brightness){
    let r,g,b,a
    rgba = rgba.substring(1).replace("gba(", "").replace(")", "").split(",")
    r = rgba[0]; g = rgba[1]; b = rgba[2]; a = rgba[3];
    r *= brightness; g *= brightness; b *= brightness;
    return(`rgba(${r},${g},${b},${a})`)
}