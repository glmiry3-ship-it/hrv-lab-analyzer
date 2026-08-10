import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# Configuración de la página
st.set_page_config(
    page_title="Simulador HRV & Autonómico — USB", page_icon="🫀", layout="wide"
)

# Estilos visuales en Azul Turquí e Institucionales
st.markdown(
    """
    <style>
    .main-title { color: #122B48; font-size: 26px; font-weight: bold; }
    .sub-title { color: #1B365D; font-size: 16px; }
    .concept-box { background-color: #F0F4F8; border-left: 5px solid #122B48; padding: 12px; margin: 10px 0; border-radius: 4px; }
    .step-box { background-color: #EBF8FF; border: 1px solid #3182CE; padding: 12px; border-radius: 6px; margin-bottom: 15px; }
    </style>
""",
    unsafe_allow_html=True,
)

# Banner Institucional
st.markdown(
    "<div class='main-title'>🫀 Simulador y Analizador de Variabilidad Cardíaca (HRV)</div>",
    unsafe_allow_html=True,
)
st.markdown(
    "<div class='sub-title'>Programa de Maestría en Actividad Física y Salud — Universidad Simón Bolívar<br>Prof. Mirary Mantilla Morrón, FT, MSc, PhD(c)</div><br>",
    unsafe_allow_html=True,
)

# Menú Lateral
st.sidebar.header("🛠️ Módulos Didácticos")
opcion = st.sidebar.radio(
    "Seleccione el Módulo de Aprendizaje:",
    [
        "1. ¿Cómo Medir el R-R en el ECG? (Tutorial FT)",
        "2. Registro de Campo (Ingreso de Datos)",
        "3. Protocolo Autonómico de 20 min (Art. Sensors 2025)",
    ],
)

# ==============================================================================
# MÓDULO 1: TUTORIAL PEDAGÓGICO PARA FISIOTERAPEUTAS
# ==============================================================================
if "1." in opcion:
    st.subheader(
        "📐 Módulo 1: ¿Cómo leer un Electrocardiograma y calcular el Intervalo R-R?"
    )

    st.markdown(
        """
    <div class='concept-box'>
    <b>💡 Concepto Clave para Fisioterapia:</b><br>
    El corazón no funciona como un metrónomo perfecto. Un corazón sano y adaptable muestra variaciones de milisegundos entre cada latido. 
    Esa diferencia es dirigida por el <b>Sistema Nervioso Autónomo (SNA)</b>: el nervio Vago (freno) genera variabilidad, mientras que el Simpático (acelerador) vuelve los latidos rígidos e idénticos.
    </div>
    """,
        unsafe_allow_html=True,
    )

    col_a, col_b = st.columns([1, 1])

    with col_a:
        st.markdown("### 🔍 Paso a Paso en el Papel del ECG:")
        st.write(
            "1. **Identifica la Onda R:** Es el pico más alto y afilado de la señal (despolarización ventricular)."
        )
        st.write(
            "2. **Mide la distancia R-R:** Cuenta cuántos cuadritos pequeños hay entre el pico R de un latido y el pico R del latido siguiente."
        )
        st.write(
            "3. **Convierte a Milisegundos (ms):** "
            "   * La velocidad estándar del papel del ECG es **25 mm/s**."
            "   * **1 cuadrito pequeño (1 mm) = 0.04 segundos = 40 milisegundos (ms)**."
            "   * **1 cuadro grande (5 mm) = 0.20 segundos = 200 milisegundos (ms)**."
        )
        st.info(
            "📝 **Ejemplo:** Si entre dos picos R cuentas **21 cuadritos pequeños**:\n"
            "$$21 \\text{ cuadritos} \\times 40 \\text{ ms} = 840 \\text{ ms}$$"
        )

    with col_b:
        t = np.linspace(0, 2, 500)
        ecg_signal = np.sin(2 * np.pi * 1.2 * t) ** 9 + 0.1 * np.sin(
            2 * np.pi * 10 * t
        )
        fig_ecg = go.Figure()
        fig_ecg.add_trace(
            go.Scatter(
                x=t * 1000,
                y=ecg_signal,
                mode="lines",
                name="Señal ECG",
                line=dict(color="#122B48", width=2),
            )
        )
        fig_ecg.add_annotation(
            x=410,
            y=0.9,
            text="Pico R (Latido 1)",
            showarrow=True,
            headheading=0,
            arrowhead=2,
            arrowcolor="red",
        )
        fig_ecg.add_annotation(
            x=1240,
            y=0.9,
            text="Pico R (Latido 2)",
            showarrow=True,
            headheading=0,
            arrowhead=2,
            arrowcolor="red",
        )
        fig_ecg.add_shape(
            type="line",
            x0=410,
            y0=0.5,
            x1=1240,
            y1=0.5,
            line=dict(color="red", width=3, dash="dash"),
        )
        fig_ecg.add_annotation(
            x=825,
            y=0.6,
            text="Intervalo R-R = 830 ms (20.7 cuadritos)",
            showarrow=False,
            font=dict(color="red", size=14, family="Arial"),
        )

        fig_ecg.update_layout(
            title="Visualización Educativa del Intervalo R-R en ECG",
            xaxis_title="Tiempo (Milisegundos - ms)",
            yaxis_title="Voltaje (mV)",
            template="plotly_white",
            height=350,
        )
        st.plotly_chart(fig_ecg, use_container_width=True)

# ==============================================================================
# MÓDULO 2: INGRESO DE DATOS DEL ESTUDIANTE Y CÁLCULO
# ==============================================================================
elif "2." in opcion:
    st.subheader(
        "📊 Módulo 2: Registro de Campo e Interpretación de Datos del ECG"
    )
    st.write(
        "Mida los intervalos R-R del papel milimetrado de su electrocardiograma e ingréselos separados por comas."
    )

    c1, c2 = st.columns(2)
    with c1:
        rr_reposo_in = st.text_area(
            "🟢 Tira de ECG en Reposo Supino (milisegundos):",
            "850, 890, 830, 860, 845, 870, 820, 880, 855, 840, 865, 835",
            height=120,
            help="Escriba los valores en ms calculados multiplicando los cuadritos por 40.",
        )
    with c2:
        rr_post_in = st.text_area(
            "🟠 Tira de ECG Post-Esfuerzo / Recuperación (milisegundos):",
            "520, 525, 518, 522, 520, 524, 519, 521, 523, 520, 522, 519",
            height=120,
        )

    def analizar_rr(cadena):
        try:
            arr = np.array(
                [float(x.strip()) for x in cadena.split(",") if x.strip()]
            )
            if len(arr) < 2:
                return None
            fc = 60000 / np.mean(arr)
            sdnn = np.std(arr, ddof=1)
            diff = np.diff(arr)
            rmssd = np.sqrt(np.mean(diff**2))
            return {"rr": arr, "fc": fc, "sdnn": sdnn, "rmssd": rmssd}
        except:
            return None

    r_rep = analizar_rr(rr_reposo_in)
    r_pos = analizar_rr(rr_post_in)

    if r_rep and r_pos:
        st.markdown("---")
        st.markdown("### 📈 Panel de Métricas Fisiológicas")

        k1, k2, k3, k4 = st.columns(4)
        k1.metric(
            "Frecuencia Cardíaca Promedio",
            f"{r_rep['fc']:.1f} bpm",
            f"{r_pos['fc'] - r_rep['fc']:.1f} bpm post",
            delta_color="inverse",
        )
        k2.metric(
            "RMSSD (Tono Vagal / Parasimpático)",
            f"{r_rep['rmssd']:.1f} ms",
            f"{r_pos['rmssd'] - r_rep['rmssd']:.1f} ms post",
        )
        k3.metric(
            "SDNN (Variabilidad Total)",
            f"{r_rep['sdnn']:.1f} ms",
            f"{r_pos['sdnn'] - r_rep['sdnn']:.1f} ms post",
        )
        k4.metric(
            "Diagnóstico de Modulación",
            "Buena Adaptación Vagal"
            if r_rep["rmssd"] > 30
            else "Estrés / Retirada Vagal",
        )

        st.markdown(
            """
        <div class='concept-box'>
        <b>🔍 Explicación Clínica para el Informe:</b><br>
        • <b>RMSSD (Milisegundos):</b> Es el marcador principal del "freno" vagal. Si es alto (>30 ms), el sujeto tiene excelente capacidad de recuperación y baja fatiga.<br>
        • <b>Comparación Reposo vs Post-Esfuerzo:</b> Al hacer ejercicio, el RMSSD cae porque el nervio Vago se retira para permitir que el corazón se acelere. En la recuperación, un rápido aumento del RMSSD indica alta condición física.
        </div>
        """,
            unsafe_allow_html=True,
        )

        fig_t = go.Figure()
        fig_t.add_trace(
            go.Scatter(
                y=r_rep["rr"],
                mode="lines+markers",
                name="Reposo Supino",
                line=dict(color="#122B48", width=2),
            )
        )
        fig_t.add_trace(
            go.Scatter(
                y=r_pos["rr"],
                mode="lines+markers",
                name="Recuperación Post-Esfuerzo",
                line=dict(color="#DD6B20", width=2),
            )
        )
        fig_t.update_layout(
            title="Tacograma (Variación R-R Latido a Latido)",
            xaxis_title="Número de Latido",
            yaxis_title="Intervalo R-R (ms)",
            template="plotly_white",
        )
        st.plotly_chart(fig_t, use_container_width=True)

# ==============================================================================
# MÓDULO 3: PROTOCOLO AUTONÓMICO DE 20 MINUTOS (TAFUR-TASCÓN ET AL., SENSORS 2025)
# ==============================================================================
else:
    st.subheader(
        "🏃‍♂️ Módulo 3: Protocolo Autonómico de 20 Minutos (Tafur-Tascón et al., Sensors 2025)"
    )
    st.markdown(
        """
    Este módulo reproduce las <b>8 fases del Test de Perfil Autonómico Cardiovascular</b> utilizado en ciclistas de élite (U-23) para evaluar la asimetría y recuperación de la frecuencia cardíaca.
    """
    )

    fase = st.selectbox(
        "Seleccione la Fase del Protocolo a Simular:",
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
            "🌿 **Comportamiento Esperado:** Alta activación parasimpática (Vagal). RMSSD elevado (~80-110 ms), baja FC."
        )
    elif "Fase 4" in fase or "Fase 5" in fase:
        st.warning(
            "⚡ **Comportamiento Esperado:** Estrés ortostático. Aumento del tono simpático, reducción del RMSSD (~45-50 ms), elevación de la FC."
        )
    elif "Fase 6" in fase:
        st.error(
            "🔥 **Comportamiento Esperado:** Máxima modulación simpática por esfuerzo. Retirada vagal casi total (RMSSD < 30 ms)."
        )
    else:
        st.info(
            "🫁 **Comportamiento Esperado:** Sincronización de la Arritmia Sinusal Respiratoria (ASR) por modulación vagal."
        )

    st.markdown("---")
    st.markdown("### 📝 Cuestionario de Aplicación Clínica para Fisioterapia:")
    st.write(
        "1. **¿Por qué un deportista con alta capacidad aeróbica recupera su RMSSD más rápido después del Test de Ruffier (Fase 7 y 8)?**"
    )
    st.write(
        "2. **Si un paciente en rehabilitación cardiaca muestra un RMSSD rígido (sin cambios) entre el reposo y el esfuerzo, ¿qué riesgo fisiológico representa?**"
    )
