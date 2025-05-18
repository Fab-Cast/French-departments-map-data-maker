
function generate() {

    //reset :

    var i, allTextElements = document.getElementsByTagName('text');
    for (i = allTextElements.length-1; i >= 0; i -= 1) {
        allTextElements[i].parentNode.removeChild(allTextElements[i]);
    }


    // write :

    const textareaDepartements = document.querySelector("#textareaDepartements")
    const textareaChiffres = document.querySelector("#textareaChiffres")

    var arrayDepartements = textareaDepartements.value.replace(/\r\n/g, "\n").split("\n")
    var arrayChiffres = textareaChiffres.value.replace(/\r\n/g, "\n").split("\n")

    const color1 = document.querySelector("#color1").value
    const color2 = document.querySelector("#color2").value
    const color3 = document.querySelector("#color3").value

    const value1 = Number(document.querySelector("#under1").value)
    const value2 = Number(document.querySelector("#under2").value)


    for (let index = 0; index < arrayDepartements.length; index++) {


        let color = "#ccc"
        if (arrayChiffres[index] < value1) { color = color1 }
        if (arrayChiffres[index] >= value1 && arrayChiffres[index] < value2) { color = color2 }
        if (arrayChiffres[index] >= value2) { color = color3 }

        const element = arrayDepartements[index];

        const deptNum = element.match(/\(([^)]+)\)/)[1]

        document.getElementsByClassName(`land-${deptNum}`)[0].style.fill = color;

        const pathBox = document.getElementsByClassName(`land-${deptNum}`)[0].getBBox();

        document.querySelector("#complete_map").innerHTML += `<text id="id-${deptNum}" font-size="10" fill="${shadeColor(color, -60)}">${arrayChiffres[index]}</text>`; // tyle="stroke:${shadeColor(color, -50)};stroke-width:1px"
        const textBox = document.querySelector(`#id-${deptNum}`).getBBox();

        const centerX = (pathBox.width - textBox.width) / 2
        const centerY = (pathBox.height - textBox.height) / 2

        document.querySelector(`#id-${deptNum}`).setAttribute("x", pathBox.x + centerX);
        document.querySelector(`#id-${deptNum}`).setAttribute("y", (pathBox.y + (textBox.height / 2)) + (centerY));

    }
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}


const createStyleElementFromCSS = () => {
    // JSFiddle's custom CSS is defined in the second stylesheet file
    const sheet = document.styleSheets[0];

    const styleRules = [];
    for (let i = 0; i < sheet.cssRules.length; i++)
        styleRules.push(sheet.cssRules.item(i).cssText);

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styleRules.join(' ')))

    return style;
};

function downloadImage() {
    const style = createStyleElementFromCSS();
    // fetch SVG-rendered image as a blob object
    const svg = document.querySelector('#svgId');
    svg.insertBefore(style, svg.firstChild); // CSS must be explicitly embedded
    const data = (new XMLSerializer()).serializeToString(svg);
    const svgBlob = new Blob([data], {
        type: 'image/svg+xml;charset=utf-8'
    });
    style.remove(); // remove temporarily injected CSS

    // convert the blob object to a dedicated URL
    const url = URL.createObjectURL(svgBlob);

    // load the SVG blob to a flesh image object
    const img = new Image();
    img.addEventListener('load', () => {
        // draw the image on an ad-hoc canvas
        const bbox = svg.getBBox();

        const canvas = document.createElement('canvas');
        canvas.width = bbox.width;
        canvas.height = bbox.height;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, bbox.width, bbox.height);

        URL.revokeObjectURL(url);

        // trigger a synthetic download operation with a temporary link
        const a = document.createElement('a');
        a.download = 'image.png';
        document.body.appendChild(a);
        a.href = canvas.toDataURL();
        a.click();
        a.remove();
    });
    img.src = url;
};