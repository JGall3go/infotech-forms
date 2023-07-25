window.jsPDF = window.jspdf.jsPDF;

var doc = new jsPDF();

// Source HTMLElement or a string containing HTML.
var page1 = document.querySelector("#ACTA-DE-SERVICIOS-PG1");
var page2 = document.querySelector("#ACTA-DE-SERVICIOS-PG2");
var page3 = document.querySelector("#ACTA-DE-SERVICIOS-PG3");

doc.html(page1, {
    callback: function (doc) {

        doc.addPage();
        // Another process
        doc.html(page2, {
            callback: function (doc) {
                // Save the PDF
                doc.html(page3, {
                    callback: function (doc) {
                        // Save the PDF
                        doc.save("acta-servicios" + makeid(5) + ".pdf");
                        // window.location.replace("/");
                    },
                    x: 0,
                    y: 595,
                    width: 210, //target width in the PDF document
                    windowWidth: 827, //window width in CSS pixels
                    height: 279
                });
            },
            x: 0,
            y: 298,
            width: 210, //target width in the PDF document
            windowWidth: 827, //window width in CSS pixels
            height: 279
        });
        
    },
    x: 0,
    y: 0,
    width: 210, //target width in the PDF document
    windowWidth: 827, //window width in CSS pixels
    height: 279
});

// ID Generator
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

// JGall3go