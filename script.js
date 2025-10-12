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

  // Limpiar pantalla si muestra mensajes de error
  if (pantalla.value.startsWith("⚠️") || pantalla.value.startsWith("❌")) {
    pantalla.value = "";
  }

  // Si la pantalla muestra solo "0"
  if (pantalla.value === "0") {
    // Si es un número o el signo menos, reemplazar el 0
    if (!operadores.includes(valor) || valor === '−') {
      pantalla.value = "";
    }
    // Si es +, ×, ÷ o punto decimal, mantener el 0
  }

  // Evitar operadores consecutivos
  if (operadores.includes(valor) && operadores.includes(ultimoCaracter)) {
    pantalla.value = pantalla.value.slice(0, -1);
  }

  // Evitar múltiples puntos decimales en un mismo número
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

    // Convertir símbolos matemáticos a operadores JavaScript
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

    // Redondear resultado para evitar problemas de precisión
    pantalla.value = Math.round(resultado * 100000000) / 100000000;
    pantalla.classList.remove("error");
  } catch {
    pantalla.value = "⚠️ Error: Expresión inválida";
    pantalla.classList.add("error");
  }
}

function evaluarExpresion(expr) {
  // Eliminar espacios
  expr = expr.replace(/\s+/g, '');

  // Validar que solo contenga números y operadores permitidos
  if (!/^[0-9+\-*/.()]+$/.test(expr)) {
    throw new Error("Expresión inválida");
  }

  // Usar Function en lugar de eval (más seguro en este contexto controlado)
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