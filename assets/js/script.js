let apiURL = "https://mindicador.cl/api/";
let codigoMonedas = ["dolar", "euro"];
let grafico;

let inputMontoPesos = document.getElementById("montoPesos");
let selectMonedaCambio = document.getElementById("monedaCambio");
let parrafoMensaje = document.getElementById("mensaje");
let botonBuscar = document.getElementById("botonBuscar");
let myChart = document.getElementById("myChart");

renderSelect();
botonBuscar.addEventListener("click", async function(){
    let codigoMoneda = selectMonedaCambio.value;

    let moneda = await getMoneda(codigoMoneda);

    renderGrafico(moneda);
   

});
 
async function renderSelect(){
    let monedas = await getMonedas(codigoMonedas);
    let html="";

    for(const moneda of monedas){
        let template=`
        <option value="${moneda.codigo}">${moneda.nombre}</option>
        `;

        html += template;
    }

    selectMonedaCambio.innerHTML += html

 }
 async function getMonedas(arrayCodigos){
    let monedas=[];

    for(let i=0; i<arrayCodigos.length; i++){
        let moneda = await getMoneda(arrayCodigos[i])
        monedas.push(moneda);
    }
    return monedas;
 }

 
 async function getMoneda(codigo){

    try {
        const res = await fetch(apiURL + codigo);
        let moneda = await res.json();
        return moneda;
    } catch (error){
        parrafoMensaje.innerHTML="Se produjo un error en la consulta"
    }

 }
function renderGrafico(moneda){
    let serie10Ultimos = moneda.serie.slice(0,10);
    const labels = serie10Ultimos.map(serie => serie.fecha.slice(0,10)).reverse();
    const data = serie10Ultimos.map(serie => serie.valor).reverse(); 
    const datasets = [
        {
            label: "Historial ultimos 10 dias",
            borderColor: "white",
            data
        }
    ];

    const conf = {
        type:"line",
        data:{
            labels,
            datasets
        }
    };

    myChart.innerHTML ="";
    if(grafico){
        grafico.destroy();
    }

    grafico = new Chart(myChart,conf);



    let valorDivisaHoy=data[9];
    let pesos=inputMontoPesos.value
    let totalCambioDivisa= Math.round(pesos/valorDivisaHoy)
    parrafoMensaje.innerHTML=`El cambio es equivalente a ${totalCambioDivisa} ${selectMonedaCambio.value}`

    
}

