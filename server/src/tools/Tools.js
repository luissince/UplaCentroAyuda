const { lstat, writeFile, unlink, mkdir, chmod } = require("fs/promises");
const crypto = require('crypto');

function isEmail(value) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return value.match(validRegex) != null ? true : false;
}


const isNumber = (value) => Number.isInteger(value);

async function isDirectory(file) {
    try {
        const stats = await lstat(file);
        if (stats.isDirectory()) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

async function isFile(file) {
    try {
        const stats = await lstat(file);
        if (stats.isFile()) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}


async function removeFile(file) {
    try {
        await unlink(file)
        return true;
    } catch (error) {
        return false;
    }
}

async function createFile(file, data, options = 'base64') {
    await writeFile(file, data, options);
}


function currentDate() {
    let date = new Date();
    let formatted_date = date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (
        date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
    return formatted_date;
}

function currentTime() {
    let time = new Date();
    let formatted_time = (time.getHours() > 9 ? time.getHours() : '0' + time.getHours()) + ":" + (time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()) + ":" + (time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds());
    return formatted_time;
}

function dateFormat(value) {
    var parts = value.split("-");
    let today = new Date(parts[0], parts[1] - 1, parts[2]);
    return (
        (today.getDate() > 9 ? today.getDate() : "0" + today.getDate()) +
        "/" +
        (today.getMonth() + 1 > 9
            ? today.getMonth() + 1
            : "0" + (today.getMonth() + 1)) +
        "/" +
        today.getFullYear()
    );
}


function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = "") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(
            (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
            negativeSign +
            (j ? i.substr(0, j) + thousands : "") +
            i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
            (decimalCount
                ? decimal +
                Math.abs(amount - i)
                    .toFixed(decimalCount)
                    .slice(2)
                : "")
        );
    } catch (e) {
        return 0;
    }
}


function numberFormat(value, currency = "PEN") {
    let formats = [
        {
            locales: "es-PE",
            options: {
                style: "currency",
                currency: "PEN",
                minimumFractionDigits: 2,
            },
        },
        {
            locales: "en-US",
            options: {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
            },
        },
        {
            locales: "de-DE",
            options: {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
            },
        },
    ];

    let newFormat = formats.filter((item) => currency === item.options.currency);
    if (newFormat.length > 0) {
        var formatter = new Intl.NumberFormat(newFormat[0].locales, {
            style: newFormat[0].options.style,
            currency: newFormat[0].options.currency,
        });
        return formatter.format(value);
    } else {
        return 0;
    }
}

function calculateTaxBruto(impuesto, monto) {
    return monto / ((impuesto + 100) * 0.01);
}

function calculateTax(porcentaje, valor) {
    let igv = parseFloat(porcentaje) / 100.0;
    return valor * igv;
}

function frecuenciaPago(value) {
    if (value === 7) return "SEMANAL";
    if (value === 15) return "QUINCENAL";
    if (value === 30) return "MENSUAL";
    if (value === 60) return "BIMESTRAL";
    if (value === 90) return "TRIMESTRAL";
    return "NINGUNO";
}

function zfill(number, width = 6) {
    var numberOutput = Math.abs(number);
    var length = number.toString().length;
    var zero = "0";

    if (width <= length) {
        if (number < 0) {
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }
    }
}

function SHA1(value) {
    return crypto.createHash("sha1").update(value, "binary").digest("hex");
}

function MD5(value) {
    return crypto.createHash('md5').update(value).digest("hex");
}

module.exports = {
    currentDate,
    currentTime,
    dateFormat,
    formatMoney,
    calculateTaxBruto,
    calculateTax,
    numberFormat,
    frecuenciaPago,
    zfill,
    isDirectory,
    isFile,
    removeFile,
    createFile,
    mkdir,
    chmod,
    SHA1,
    MD5,
    isEmail,
    isNumber
};