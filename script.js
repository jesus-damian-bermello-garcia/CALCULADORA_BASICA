let encendida = true;
const pantalla = document.getElementById("pantalla");

function agregar(valor) {
  if (!encendida) {
    pantalla.value = "⚠️ Apagada";
    pantalla.classList.add("error");
    return;
  }

  pantalla.classList.remove("error");

  const ultimoCaracter = pantalla.value.slice(-1);
  const operadores = ['+', '−', '×', '÷'];

 
  if (pantalla.value.startsWith("⚠️") || pantalla.value.startsWith("❌")) {
    pantalla.value = "";
  }


  if (pantalla.value === "0") {
    if (!operadores.includes(valor) || valor === '−') {
      pantalla.value = "";
    }
  }

  if (operadores.includes(valor) && operadores.includes(ultimoCaracter)) {
    pantalla.value = pantalla.value.slice(0, -1);
  }

  if (valor === '.') {
    const numeros = pantalla.value.split(/[+−×÷]/);
    const ultimoNumero = numeros[numeros.length - 1];
    if (ultimoNumero.includes('.')) {
      return;
    }
  }

  pantalla.value += valor;
}

function limpiar() {
  if (!encendida) return;
  pantalla.classList.remove("error");
  pantalla.value = "0";
}

function calcular() {
  if (!encendida) return;

  try {
    let expresion = pantalla.value;

    
    expresion = expresion.replace(/×/g, '*');
    expresion = expresion.replace(/÷/g, '/');
    expresion = expresion.replace(/−/g, '-');

    // Validar división por cero
    if (/\/\s*0(?!\.)(?!\d)/.test(expresion)) {
      pantalla.value = "❌ Error: no se puede dividir entre cero";
      pantalla.classList.add("error");
      return;
    }

    // Función segura para evaluar expresiones matemáticas
    const resultado = evaluarExpresion(expresion);

    if (!isFinite(resultado)) {
      pantalla.value = "❌ Error: Resultado no válido";
      pantalla.classList.add("error");
      return;
    }

    pantalla.value = Math.round(resultado * 100000000) / 100000000;
    pantalla.classList.remove("error");
  } catch {
    pantalla.value = "⚠️ Error: Expresión inválida";
    pantalla.classList.add("error");
  }
}

function evaluarExpresion(expr) {
  expr = expr.replace(/\s+/g, '');

  // Validar que solo contenga números y operadores permitidos
  if (!/^[0-9+\-*/.()]+$/.test(expr)) {
    throw new Error("Expresión inválida");
  }
  return Function('"use strict"; return (' + expr + ')')();
}

function togglePower() {
  encendida = !encendida;
  if (encendida) {
    pantalla.value = "0";
    pantalla.classList.remove("error");
  } else {
    pantalla.value = "⚠️ Apagada";
    pantalla.classList.add("error");
  }
}