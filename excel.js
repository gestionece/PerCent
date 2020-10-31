let selectedFile;
//console.log(window.XLSX);
document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})

let data = [{}]

document.getElementById('button').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, { type: "binary" });
            //console.log(workbook);
            workbook.SheetNames.forEach(sheet => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                //console.log(rowObject);
                //document.getElementById("jsondata").innerHTML = JSON.stringify(rowObject, undefined, 4);
                Calc(rowObject);
            });
        }
    }
});

function Calc(data) {
    if (data[1].LCL !== undefined) {
        let LCLs = [{
            "LCL": data[1].LCL,
            "TOT": 0,
            "CON": 0,
            "ANN": 0,
            "AV": 0
        }];
        var count = Object.keys(data).length;
        for (let i = 0; i < count; i++) {
            var LCLexist = false;
            for (let j = 0; j < LCLs.length; j++) {
                if (LCLs[j].LCL != undefined && data[i].LCL == LCLs[j].LCL) {
                    LCLexist = true;
                    LCLs[j].TOT += 1;
                    if (data[i]["Stato OdL"].localeCompare("Annullato") == 0) {
                        LCLs[j].ANN += 1;
                    }
                    if (data[i]["Stato OdL"].localeCompare("Chiuso") == 0 && (data[i]["Causale Esito"].localeCompare("OK FINALE") == 0 || data[i]["Causale Esito"].localeCompare("CHIUSO DA BACK OFFICE")  == 0)) {
                        LCLs[j].CON += 1;
                    }
                    if (data[i]["Stato OdL"].localeCompare("Chiuso") == 0 && (data[i]["Causale Esito"].localeCompare("Impossibilita'Â  di lavoro sotto tensione") == 0 || data[i]["Causale Esito"].localeCompare("Misuratore guasto / anomalia parola di stato") == 0 || data[i]["Causale Esito"].localeCompare("Altre cause") == 0 || data[i]["Causale Esito"].localeCompare("Dati misuratore non congruenti") == 0 || data[i]["Causale Esito"].localeCompare("Impedimento per ordine pubblico") == 0 || data[i]["Causale Esito"].localeCompare("Presenza dispositivo esterno") == 0 || data[i]["Causale Esito"].localeCompare("Sospetta manomissione / allaccio diretto") == 0)) {
                        //console.log(data[i]["Causale Esito"]);
                        LCLs[j].AV += 1;
                    }
                }
            }
            if (LCLexist == false) {
                LCLexist = false;
                let LCL = {
                    "LCL": data[i].LCL,
                    "TOT": 0,
                    "CON": 0,
                    "ANN": 0,
                    "AV": 0
                };
                LCLs.push(LCL);
            }
        }
        console.log(LCLs);
    }
}