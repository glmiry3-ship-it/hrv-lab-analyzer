import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import streamlit as st

# Configuración de página
st.set_page_config(
    page_title="Simulador HRV & ECG — USB", page_icon="🫀", layout="wide"
)

# Encabezado Institucional
st.title("🫀 Simulador Didáctico de Variabilidad Cardíaca (HRV)")
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
        "2. Calculadora y Analizador R-R (Práctica de Campo)",
        "3. Protocolo Autonómico de 20 min (Art. Sensors 2025)",
    ],
)

# ==============================================================================
# MÓDULO 1: TUTORIAL ILUSTRADO PASO A PASO
# ==============================================================================
if "1." in opcion:
    st.header("📐 Módulo 1: Guía para Identificar la Onda R y Medir el R-R")

    st.success(
        "💡 **¿Qué es la Variabilidad Cardíaca (HRV) para Fisioterapia?**\n\n"
        "Un corazón sano NO es un metrónomo perfecto. Entre latido y latido existen variaciones de milisegundos "
        "controladas por el Sistema Nervioso Autónomo. El **Nervio Vago (Parasimpático)** genera esa variabilidad saludable, "
        "mientras que el **Estrés o Fatiga (Simpático)** vuelve los latidos rígidos e idénticos."
    )

    col1, col2 = st.columns([1, 1.2])

    with col1:
        st.subheader("📋 Paso a Paso en el Papel Milimetrado")

        st.markdown(
            "1. **Ubica la Onda R:** Es el pico afilado y más alto de la señal electrocardiográfica (representa la contracción del ventrículo)."
        )
        st.markdown(
            "2. **Cuenta los Cuadritos Pequeños:** Mide la distancia horizontal desde la punta de una Onda R hasta la punta de la siguiente Onda R."
        )
        st.markdown(
            "3. **Convierte a Milisegundos (ms):**\n"
            "   * Vel. Estándar del ECG = **25 mm/segundo**.\n"
            "   * **1 cuadrito pequeño (1 mm) = 40 milisegundos (ms)**.\n"
            "   * **1 cuadro grande (5 mm) = 200 milisegundos (ms)**."
        )

        st.info(
            "🧮 **Ejemplo Práctico:**\n\n"
            "Si entre dos Ondas R cuentas **21 cuadritos pequeños**:\n\n"
            "$$\\text{Intervalo R-R} = 21 \\times 40\\text{ ms} = \\mathbf{840\\text{ ms}}$$"
        )

    with col2:
        st.subheader("🖼️ Visualización en Papel Milimetrado de ECG")

        # Dibujo de señal ECG sintética sobre papel milimetrado con Matplotlib
        time_ms = np.linspace(0, 1600, 1000)

        def p_qrs_t(t_center):
            p = 0.12 * np.exp(-(((time_ms - t_center + 160) / 30) ** 2))
            q = -0.15 * np.exp(-(((time_ms - t_center + 35) / 10) ** 2))
            r = 1.2 * np.exp(-(((time_ms - t_center) / 12) ** 2))
            s = -0.25 * np.exp(-(((time_ms - t_center - 30) / 10) ** 2))
            t_w = 0.25 * np.exp(-(((time_ms - t_center - 180) / 40) ** 2))
            return p + q + r + s + t_w

        r1 = 350
        r2 = 1190
        signal = p_qrs_t(r1) + p_qrs_t(r2)

        fig, ax = plt.subplots(figsize=(8, 4.5), facecolor="#FFF0F0")
        ax.set_facecolor("#FFF0F0")  # Rosado clásico de ECG

        # Rejillas
        ax.grid(
            True, which="major", color="#FF9999", linestyle="-", linewidth=1.2
        )
        ax.grid(
            True, which="minor", color="#FFCCCC", linestyle=":", linewidth=0.6
        )
        ax.minorticks_on()

        # Trazado
        ax.plot(time_ms, signal, color="#990000", linewidth=2.2, label="ECG")

        # Marcas R y flecha R-R
        ax.annotate(
            "Onda R1",
            xy=(r1, 1.2),
            xytext=(r1 - 100, 1.4),
            arrowprops=dict(facecolor="black", shrink=0.05, width=1.5),
            fontsize=10,
            weight="bold",
        )
        ax.annotate(
            "Onda R2",
            xy=(r2, 1.2),
            xytext=(r2 + 20, 1.4),
            arrowprops=dict(facecolor="black", shrink=0.05, width=1.5),
            fontsize=10,
            weight="bold",
        )

        ax.annotate(
            "",
            xy=(r1, 1.15),
            xytext=(r2, 1.15),
            arrowprops=dict(arrowstyle="<->", color="blue", lw=2),
        )
        ax.text(
            (r1 + r2) / 2,
            1.22,
            "Intervalo R-R = 840 ms\n(21 cuadritos x 40 ms)",
            ha="center",
            va="bottom",
            color="blue",
            fontsize=10,
            weight="bold",
            bbox=dict(
                boxstyle="round,pad=0.3", fc="white", ec="blue", lw=1.5
            ),
        )

        # Nombres de Ondas
        ax.text(r1 - 160, 0.2, "P", fontsize=10, weight="bold")
        ax.text(r1 - 40, -0.25, "Q", fontsize=10, weight="bold")
        ax.text(r1 + 30, -0.3, "S", fontsize=10, weight="bold")
        ax.text(r1 + 180, 0.3, "T", fontsize=10, weight="bold")

        ax.set_xlim(0, 1600)
        ax.set_ylim(-0.5, 1.7)
        ax.set_xlabel("Tiempo en milisegundos (ms)", fontsize=10)
        ax.set_ylabel("Voltaje (mV)", fontsize=10)
        ax.set_title(
            "Complejo QRS en Papel Milimetrado de ECG",
            fontsize=12,
            weight="bold",
            color="#990000",
        )

        st.pyplot(fig)

# ==============================================================================
# MÓDULO 2: CALCULADORA R-R Y MÉTRICAS
# ==============================================================================
elif "2." in opcion:
    st.header("📊 Módulo 2: Registro de Datos e Interpretación Clínica")
    st.markdown(
        "Mida las distancias R-R en el papel de su ECG, multiplíquelas por **40 ms** e ingrese la lista de valores separada por comas."
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

        # Tacograma comparativo
        fig_t, ax_t = plt.subplots(figsize=(9, 4))
        ax_t.plot(
            d_rep["rr"],
            "o-",
            color="#122B48",
            linewidth=2,
            label="Reposo Supino (Variable/Sano)",
        )
        ax_t.plot(
            d_pos["rr"],
            "o-",
            color="#DD6B20",
            linewidth=2,
            label="Post-Esfuerzo (Rígido/Fatiga)",
        )
        ax_t.set_title("Tacograma: Variación de la Distancia R-R Latido a Latido")
        ax_t.set_xlabel("Número de Latido Consecutive")
        ax_t.set_ylabel("Intervalo R-R (ms)")
        ax_t.grid(True, linestyle="--", alpha=0.6)
        ax_t.legend()
        st.pyplot(fig_t)

# ==============================================================================
# MÓDULO 3: PROTOCOLO AUTONÓMICO DE 20 MINUTOS
# ==============================================================================
else:
    st.header("🏃‍♂️ Módulo 3: Protocolo Autonómico (Art. Sensors 2025)")
    st.markdown(
        "Fases del Test de Perfil Autonómico Cardiovascular en Atletas de Élite[cite: 4]:"
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
            "🌿 **Comportamiento Esperado:** Alta activación parasimpática (Vagal). RMSSD elevado (~80-110 ms) y Frecuencia Cardíaca baja[cite: 4]."
        )
    elif "Fase 4" in fase or "Fase 5" in fase:
        st.warning(
            "⚡ **Comportamiento Esperado:** Estrés ortostático. Aumento de la modulación simpática y reducción del RMSSD (~45-50 ms)[cite: 4]."
        )
    elif "Fase 6" in fase:
        st.error(
            "🔥 **Comportamiento Esperado:** Máxima exigencia simpática por ejercicio. Retirada vagal casi completa (RMSSD < 30 ms)[cite: 4]."
        )
    else:
        st.info(
            "🫁 **Comportamiento Esperado:** Sincronización respiratoria de la Frecuencia Cardíaca (Arritmia Sinusal Respiratoria)[cite: 4]."
        )
