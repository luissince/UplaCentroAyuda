import Swal from "../assets/js/sweetalert";

export function getCurrentDate() {
    let today = new Date();
    let formatted_date = today.getFullYear() + "-" + ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : '0' + (
        today.getMonth() + 1)) + "-" + (today.getDate() > 9 ? today.getDate() : '0' + today.getDate());
    return formatted_date;
};

export function getCurrentTime() {
    let today = new Date();
    let formatted_time = (today.getHours() > 9 ? today.getHours() : '0' + today.getHours()) + ":" + (today.getMinutes() > 9 ? today.getMinutes() : '0' + today.getMinutes()) + ":" + (today.getSeconds() > 9 ? today.getSeconds() : '0' + today.getSeconds());
    return formatted_time;
}

export function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = "") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" +
            thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        return 0;
    }
};

export function monthName(month) {
    let months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Setiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];
    return months[month - 1];
}

export function porcent(total, valor) {
    return (valor * 100) / total;
}

export function ModalAlertInfo(title, message) {
    Swal({
      title: title,
      text: message,
      type: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }
  
  export function ModalAlertSuccess(title, message, callback = function () { }) {
    Swal({
      title: title,
      text: message,
      type: "success",
      showConfirmButton: true,
      allowOutsideClick: false,
    }).then((event) => {
      callback();
    });
  }
  
  export function ModalAlertWarning(title, message, callback = function () { }) {
    Swal({
      title: title,
      text: message,
      type: "warning",
      showConfirmButton: true,
      allowOutsideClick: false,
    }).then((event) => {
      callback();
    });
  }
  
  export function ModalAlertError(title, message) {
    Swal({
      title: title,
      text: message,
      type: "error",
      showConfirmButton: true,
      allowOutsideClick: false,
    });
  }
  
  export function ModalAlertDialog(title, mensaje, callback) {
    Swal({
      title: title,
      text: mensaje,
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((isConfirm) => {
      if (isConfirm.value === undefined) {
        return false;
      }
      if (isConfirm.value) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }
  

