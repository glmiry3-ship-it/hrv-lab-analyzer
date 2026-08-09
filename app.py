import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# Configuración de la página
st.set_page_config(
    page_title="HRV ECG Analyzer — USB", page_icon="🫀", layout="wide"
)

# Estilo personalizado en azul turquí
st.markdown(
    """
    <style>
    .main-title { color: #122B48; font-size: 26px; font-weight: bold; }
    .sub-title { color: #1B365D; font-size: 16px; }
    </style>
""",
    unsafe_allow_html=True,
)

st.markdown(
    "<div class='main-title'>🫀 Analizador y Simulador de Variabilidad Cardíaca (HRV)</div>",
    unsafe_allow_html=True,
)
st.markdown(
    "<div class='sub-title'>Programa de Maestría en Actividad Física y Salud — Universidad Simón Bolívar<br>Prof. Mirary Mantilla Morrón, FT, MSc, PhD(c)</div><br>",
    unsafe_allow_html=True,
)

st.sidebar.header("🛠️ Panel de Control")
opcion = st.sidebar.radio(
    "Seleccione el Modo de Trabajo:",
    [
        "1. Analizar Datos Reales del ECG (Laboratorio)",
        "2. Simulador de Tono Autonómico (Demo Inductiva)",
    ],
)

if "1." in opcion:
    st.subheader(
        "📊 Procesamiento de Intervalos R-R Extraídos del ECG de Laboratorio"
    )
    st.info(
        "💡 **Instrucciones:** Mida la distancia entre los picos R en el papel del ECG (en milisegundos). Ingrese la secuencia separada por comas."
    )

    col1, col2 = st.columns(2)
    with col1:
        rr_reposo_str = st.text_area(
            "🟢 Intervalos R-R en Reposo Supino (ms):",
            "850, 890, 830, 860, 845, 870, 820, 880, 855, 840, 865, 835",
            height=120,
        )
    with col2:
        rr_post_str = st.text_area(
            "🟠 Intervalos R-R en Recuperación Post-Esfuerzo (ms):",
            "520, 525, 518, 522, 520, 524, 519, 521, 523, 520, 522, 519",
            height=120,
        )

    def calcular_hrv(rr_str):
        try:
            rr = np.array([float(x.strip()) for x in rr_str.split(",") if x.strip()])
            if len(rr) < 2:
                return None
            fc_media = 60000 / np.mean(rr)
            sdnn = np.std(rr, ddof=1)
            diff_rr = np.diff(rr)
            rmssd = np.sqrt(np.mean(diff_rr**2))
            return {
                "rr": rr,
                "fc": fc_media,
                "sdnn": sdnn,
                "rmssd": rmssd,
                "diff": diff_rr,
            }
        except:
            return None

    data_reposo = calcular_hrv(rr_reposo_str)
    data_post = calcular_hrv(rr_post_str)

    if data_reposo and data_post:
        st.markdown("---")
        st.subheader("📈 Resultados de Modulación Autonómica")

        m1, m2, m3, m4 = st.columns(4)
        m1.metric(
            "FC Media Reposo",
            f"{data_reposo['fc']:.1f} bpm",
            f"{data_post['fc'] - data_reposo['fc']:.1f} bpm post",
            delta_color="inverse",
        )
        m2.metric(
            "RMSSD Reposo (Vagal)",
            f"{data_reposo['rmssd']:.1f} ms",
            f"{data_post['rmssd'] - data_reposo['rmssd']:.1f} ms post",
        )
        m3.metric(
            "SDNN Reposo (Total)",
            f"{data_reposo['sdnn']:.1f} ms",
            f"{data_post['sdnn'] - data_reposo['sdnn']:.1f} ms post",
        )
        m4.metric(
            "Estado Autonómico Basal",
            "Predominio Vagal" if data_reposo["rmssd"] > 30 else "Estrés / Simpático",
        )

        # Tacograma
        fig_taco = go.Figure()
        fig_taco.add_trace(
            go.Scatter(
                y=data_reposo["rr"],
                mode="lines+markers",
                name="Reposo Basal",
                line=dict(color="#122B48", width=2),
            )
        )
        fig_taco.add_trace(
            go.Scatter(
                y=data_post["rr"],
                mode="lines+markers",
                name="Recuperación Post-Esfuerzo",
                line=dict(color="#DD6B20", width=2),
            )
        )
        fig_taco.update_layout(
            title="Tacograma (Variabilidad de Intervalos R-R Latido a Latido)",
            xaxis_title="Número de Latido",
            yaxis_title="Intervalo R-R (ms)",
            template="plotly_white",
        )
        st.plotly_chart(fig_taco, use_container_width=True)

        # Poincaré
        fig_poincare = go.Figure()
        fig_poincare.add_trace(
            go.Scatter(
                x=data_reposo["rr"][:-1],
                y=data_reposo["rr"][1:],
                mode="markers",
                name="Reposo (Disperso = Alto RMSSD/Vagal)",
                marker=dict(color="#122B48", size=10),
            )
        )
        fig_poincare.add_trace(
            go.Scatter(
                x=data_post["rr"][:-1],
                y=data_post["rr"][1:],
                mode="markers",
                name="Post-Esfuerzo (Agrupado = Retirada Vagal)",
                marker=dict(color="#DD6B20", size=10),
            )
        )
        fig_poincare.update_layout(
            title="Gráfico No Lineal de Poincaré (R-R_n vs R-R_n+1)",
            xaxis_title="R-R_n (ms)",
            yaxis_title="R-R_n+1 (ms)",
            template="plotly_white",
        )
        st.plotly_chart(fig_poincare, use_container_width=True)

else:
    st.subheader("🎛️ Simulador Fisiológico de Modulación Autonómica")
    tono = st.slider(
        "Ajuste el Tono Autonómico del Sujeto (0 = Estrés Simpático | 100 = Alto Tono Vagal):",
        min_value=0,
        max_value=100,
        value=75,
    )

    rmssd_sim = 10 + (tono * 0.8)
    fc_sim = 110 - (tono * 0.5)

    st.write(
        f"**Predicción:** Frecuencia Cardíaca = **{fc_sim:.0f} bpm** | RMSSD Vagal Estimado = **{rmssd_sim:.1f} ms**"
    )
    if tono < 35:
        st.error(
            "⚠️ **Predominio Simpático Elevado / Retirada Vagal:** El trazado de intervalos R-R se vuelve rígido, monótono y sin variabilidad."
        )
    else:
        st.success(
            "🌿 **Predominio Parasimpático / Alto Tono Vagal:** El trazado muestra alta flexibilidad fisiológica e irregularidad sana latido a latido."
        )
