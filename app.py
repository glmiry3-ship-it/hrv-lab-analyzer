import numpy as np
import pandas as pd
import streamlit as st

# Configuración de página
st.set_page_config(
    page_title="Simulador HRV & ECG — USB", page_icon="🫀", layout="wide"
)

# Título y Encabezado
st.title("🫀 Laboratorio Virtual: Variabilidad Cardíaca (HRV) para Fisioterapia")
st.caption(
    "Programa de Maestría en Actividad Física y Salud — Universidad Simón Bolívar"
)
st.caption("Docente a Cargo: Prof. Mirary Mantilla Morrón, FT, MSc, PhD(c)")
st.markdown("---")

# Menú Lateral
st.sidebar.header("📌 Módulos Didácticos")
opcion = st.sidebar.radio(
    "Seleccione el tema a explorar:",
    [
        "1. ¿Cómo Leer el Papel del ECG? (Tutorial Paso a Paso)",
        "2. Registro de Campo (Ingreso de Datos del Laboratorio)",
        "3. Protocolo Autonómico de 20 min (Sensors 2025)",
    ],
)

# ==============================================================================
# MÓDULO 1: TUTORIAL ILUSTRADO Y AMIGABLE
# ==============================================================================
if "1." in opcion:
    st.header("📐 Módulo 1: ¿Cómo identificar la Onda R y medir el Intervalo R-R?")

    st.success(
        "💡 **¿Qué es la Variabilidad Cardíaca (HRV) para un Fisioterapeuta?**\n\n"
        "Un corazón sano **NO es un metrónomo perfecto**. Entre latido y latido existen pequeñas variaciones de milisegundos "
        "dirigidas por el Sistema Nervioso Autónomo. El **Nervio Vago (Parasimpático)** genera esa variabilidad saludable (flexibilidad), "
        "mientras que el **Estrés o Fatiga (Simpático)** vuelve los latidos rígidos e idénticos."
    )

    col1, col2 = st.columns([1, 1.1])

    with col1:
        st.subheader("📋 Paso a Paso en el Papel del ECG")

        st.markdown(
            "1. **Ubica la Onda R:** Es el pico más alto y afilado de la señal (representa la contracción ventricular)."
        )
        st.markdown(
            "2. **Cuenta los Cuadritos Pequeños:** Mide la distancia horizontal desde la punta de una Onda R hasta la punta de la siguiente Onda R."
        )
        st.markdown(
            "3. **Convierte a Milisegundos (ms):**\n"
            "   * Velocidad estándar del papel = **25 mm/segundo**.\n"
            "   * **1 cuadrito pequeño (1 mm) = 40 milisegundos (ms)**.\n"
            "   * **1 cuadro grande (5 mm) = 200 milisegundos (ms)**."
        )

        st.info(
            "🧮 **Ejemplo Práctico:**\n\n"
            "Si entre dos Ondas R cuentas **21 cuadritos pequeños**:\n\n"
            "$$\\text{Intervalo R-R} = 21 \\text{ cuadritos} \\times 40\\text{ ms} = \\mathbf{840\\text{ ms}}$$"
        )

    with col2:
        st.subheader("🖼️ Esquema Interactivo del Papel de ECG")

        # Gráfico educativo tipo papel de ECG renderizado en SVG nativo
        svg_ecg = """
        <svg viewBox="0 0 600 260" width="100%" xmlns="http://www.w3.org/2000/svg" style="background-color: #FFF0F0; border: 2px solid #FF8080; border-radius: 8px;">
            <!-- Grid de fondo -->
            <defs>
                <pattern id="smallGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#FFCCCC" stroke-width="0.8"/>
                </pattern>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <rect width="60" height="60" fill="url(#smallGrid)"/>
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FF8080" stroke-width="1.5"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <!-- Trazado ECG -->
            <path d="M 10 160 L 60 160 L 70 145 L 80 160 L 90 170 L 100 160 L 110 160 L 120 165 L 125 180 L 135 30 L 145 200 L 150 160 L 170 160 L 185 130 L 210 160 L 360 160 L 370 145 L 380 160 L 390 170 L 400 160 L 410 160 L 420 165 L 425 180 L 435 30 L 445 200 L 450 160 L 470 160 L 485 130 L 510 160 L 590 160" 
                  fill="none" stroke="#990000" stroke-width="3" stroke-linecap="round"/>
            
            <!-- Etiquetas R1 y R2 -->
            <circle cx="135" cy="30" r="6" fill="#122B48" />
            <text x="120" y="20" font-family="Arial" font-size="14" font-weight="bold" fill="#122B48">Onda R1</text>
            
            <circle cx="435" cy="30" r="6" fill="#122B48" />
            <text x="420" y="20" font-family="Arial" font-size="14" font-weight="bold" fill="#122B48">Onda R2</text>
            
            <!-- Flecha y texto R-R -->
            <line x1="135" y1="50" x2="435" y2="50" stroke="#0055A5" stroke-width="3" stroke-dasharray="5,5"/>
            <polygon points="135,50 145,45 145,55" fill="#0055A5"/>
            <polygon points="435,50 425,45 425,55" fill="#0055A5"/>
            
            <rect x="200" y="65" width="170" height="30" rx="5" fill="#0055A5"/>
            <text x="285" y="85" font-family="Arial" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">R-R = 840 ms (21 cuadritos)</text>
            
            <!-- Nombres PQRST -->
            <text x="65" y="140" font-family="Arial" font-size="12" font-weight="bold" fill="#333">P</text>
            <text x="118" y="190" font-family="Arial" font-size="12" font-weight="bold" fill="#333">Q</text>
            <text x="148" y="215" font-family="Arial" font-size="12" font-weight="bold" fill="#333">S</text>
            <text x="185" y="120" font-family="Arial" font-size="12" font-weight="bold" fill="#333">T</text>
        </svg>
        """
        st.components.v1.html(svg_ecg, height=280)

# ==============================================================================
# MÓDULO 2: CALCULADORA R-R Y MÉTRICAS
# ==============================================================================
elif "2." in opcion:
    st.header("📊 Módulo 2: Registro de Datos e Interpretación Clínica")
    st.markdown(
        "Mida las distancias R-R en el papel de su ECG del laboratorio, multiplíquelas por **40 ms** e ingrese la lista de valores separada por comas."
    )

    c1, c2 = st.columns(2)
    with c1:
        rr_rep_txt = st.text_area(
            "🟢 Tira de ECG en Reposo Supino (ms):",
            "850, 890, 830, 860, 845, 870, 820, 880, 855, 840, 865, 835",
            height=120,
        )
    with c2:
        rr_pos_txt = st.text_area(
            "🟠 Tira de ECG Post-Esfuerzo / Recuperación (ms):",
            "520, 525, 518, 522, 520, 524, 519, 521, 523, 520, 522, 519",
            height=120,
        )

    def procesar(cadena):
        try:
            arr = np.array(
                [float(x.strip()) for x in cadena.split(",") if x.strip()]
            )
            if len(arr) < 2:
                return None
            fc = 60000 / np.mean(arr)
            sdnn = np.std(arr, ddof=1)
            rmssd = np.sqrt(np.mean(np.diff(arr) ** 2))
            return {"rr": arr, "fc": fc, "sdnn": sdnn, "rmssd": rmssd}
        except:
            return None

    d_rep = procesar(rr_rep_txt)
    d_pos = procesar(rr_pos_txt)

    if d_rep and d_pos:
        st.markdown("---")
        st.subheader("📈 Resultados Fisiológicos Obtenidos")

        m1, m2, m3, m4 = st.columns(4)
        m1.metric("FC Media Reposo", f"{d_rep['fc']:.1f} bpm")
        m2.metric(
            "RMSSD (Tono Vagal)",
            f"{d_rep['rmssd']:.1f} ms",
            f"{d_pos['rmssd'] - d_rep['rmssd']:.1f} ms post",
        )
        m3.metric("SDNN (Variabilidad Total)", f"{d_rep['sdnn']:.1f} ms")
        m4.metric(
            "Estado Autonómico",
            "Adaptación Vagal Sana"
            if d_rep["rmssd"] > 30
            else "Estrés / Retirada Vagal",
        )

        st.info(
            "💡 **Interpretación Clínica:**\n\n"
            "* **RMSSD:** Es el marcador del 'freno' del Nervio Vago. Valores superiores a **30 ms** en reposo indican buena salud cardiovascular y baja fatiga acumulada.\n"
            "* **Respuesta al Esfuerzo:** Durante o inmediatamente después del ejercicio, el RMSSD cae drásticamente porque el cuerpo retira el freno vagal para permitir que el corazón se acelere."
        )

        # Tacograma comparativo con tabla nativa
        st.subheader("📈 Tacograma (Variación de la Distancia R-R Latido a Latido)")
        df_taco = pd.DataFrame(
            {
                "Número de Latido": np.arange(1, len(d_rep["rr"]) + 1),
                "Reposo Supino (ms)": d_rep["rr"],
                "Post-Esfuerzo (ms)": d_pos["rr"][: len(d_rep["rr"])],
            }
        ).set_index("Número de Latido")

        st.line_chart(df_taco)

# ==============================================================================
# MÓDULO 3: PROTOCOLO AUTONÓMICO DE 20 MINUTOS
# ==============================================================================
else:
    st.header("🏃‍♂️ Módulo 3: Protocolo Autonómico de 20 Minutos")
    st.markdown(
        "Fases del Test de Perfil Autonómico Cardiovascular en Atletas (Sensors 2025):"
    )

    fase = st.selectbox(
        "Seleccione una fase del test para analizar su comportamiento:",
        [
            "Fase 1: Clinostatismo / Reposo Supino (5 min)",
            "Fase 2: Ventilación Controlada 10 ciclos/min (1 min)",
            "Fase 3: Ventilación Controlada 12 ciclos/min (1 min)",
            "Fase 4: Cambio Postural (1 min)",
            "Fase 5: Ortostatismo / De Pie (3:15 min)",
            "Fase 6: Test de Ruffier / Esfuerzo (0:45 min)",
            "Fase 7: Recuperación Inicial (1 min)",
            "Fase 8: Recuperación Final Supino (5 min)",
        ],
    )

    if "Fase 1" in fase or "Fase 8" in fase:
        st.success(
            "🌿 **Comportamiento Esperado:** Alta activación parasimpática (Vagal). RMSSD elevado (~80-110 ms) y Frecuencia Cardíaca baja."
        )
    elif "Fase 4" in fase or "Fase 5" in fase:
        st.warning(
            "⚡ **Comportamiento Esperado:** Estrés ortostático. Aumento de la modulación simpática y reducción del RMSSD (~45-50 ms)."
        )
    elif "Fase 6" in fase:
        st.error(
            "🔥 **Comportamiento Esperado:** Máxima exigencia simpática por ejercicio. Retirada vagal casi completa (RMSSD < 30 ms)."
        )
    else:
        st.info(
            "🫁 **Comportamiento Esperado:** Sincronización respiratoria de la Frecuencia Cardíaca (Arritmia Sinusal Respiratoria)."
        )
