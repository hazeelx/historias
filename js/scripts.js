function cargarSelects()
{
    let personajeSelect = document.getElementById("personajeSelect");
    let artefactoSelect = document.getElementById("artefactoSelect");
    let lugarSelect = document.getElementById("localizacionSelect");

    personajes.forEach((p, index) =>
    {
        personajeSelect.innerHTML += `<option value="${index}">${p.nombre}</option>`
    });

    artefactos.forEach((a, index) =>
    {
        artefactoSelect.innerHTML += `<option value="${index}">${a.objeto}</option>`
    });

    localizaciones.forEach((l, index) =>
    {
        lugarSelect.innerHTML += `<option value="${index}">${l.lugar}</option>`
    });
}

function generarHistoria()
{
    let personaje = personajes[document.getElementById("personajeSelect").value];
    let artefacto = artefactos[document.getElementById("artefactoSelect").value];
    let lugar = localizaciones[document.getElementById("localizacionSelect").value];

    let historia = historiasOscuras[personaje.nombre][artefacto.objeto][lugar.lugar];


    let historiaFinal = `
        <h2>${personaje.nombre}</h2>
        <p><strong>Historia del personaje:</strong> ${personaje.historia}</p>

        <h3>Artefacto elegido: ${artefacto.objeto}</h3>
        <p>${artefacto.uso}</p>

        <h3>Localización: ${lugar.lugar}</h3>
        <p>${lugar.descripcion}</p>

        <h3>Historia combinada</h3>
        <p>${historia}</p>
    `;

    document.getElementById("hero").innerHTML = historiaFinal;

    new TypeIt("#hero", {
    speed: 40,
    startDelay: 300,
    cursor: true,
    lifeLike: true
})
.go();

}

window.onload = () => 
{
    cargarSelects();
    document.getElementById("btnGenerar").addEventListener("click", generarHistoria);
};