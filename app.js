// --- CALCULADORAS CLÍNICAS (FISIOLOGÍA) ---
const ClinicalCalculators = {
    // 1. Caminata 6 Min
    troosters: (age, heightM, weightKg, gender) => {
window.errorLog = [];
        const heightCm = heightM * 100;
        const g = gender === 'M' ? 1 : 0;
        const pred = 218 + (5.14 * heightCm) - (5.32 * age) - (1.80 * weightKg) + (51.31 * g);
        return pred.toFixed(0);
    },
    vo2peakCahalin: (distanceM) => {
        return (0.03 * distanceM + 3.98).toFixed(1);
    },
    mets: (vo2) => {
        return (vo2 / 3.5).toFixed(1);
    },
    
    // 2. CPET y Zonas de Entrenamiento
    cpetZones: (vo2peak, vt1_pct, vt2_pct, hrMax) => {
        const vt1_vo2 = (vo2peak * (vt1_pct/100)).toFixed(1);
        const vt2_vo2 = (vo2peak * (vt2_pct/100)).toFixed(1);
        const vt1_hr = Math.round(hrMax * (vt1_pct/100)); // Aproximación lineal para simulación
        const vt2_hr = Math.round(hrMax * (vt2_pct/100)); 
        
        return {
            vt1_vo2, vt2_vo2, vt1_hr, vt2_hr,
            z1: `< ${vt1_hr} lpm`,
            z2: `${vt1_hr} - ${vt2_hr} lpm`,
            z3: `> ${vt2_hr} lpm`
        };
    },
    
    // 3. InBody / Obesidad Sarcopénica
    sarcopeniaCheck: (alm, heightM, fatPercent, gender) => {
        const smi = (alm / (heightM * heightM)).toFixed(2);
        // Puntos de corte EWGSOP2 para SMI
        const smiCutoff = gender === 'M' ? 7.0 : 5.5;
        const fatCutoff = gender === 'M' ? 25 : 35;
        
        let dx = "Normal";
        if (smi < smiCutoff && fatPercent > fatCutoff) {
            dx = "Obesidad Sarcopénica";
        } else if (smi < smiCutoff) {
            dx = "Sarcopenia";
        } else if (fatPercent > fatCutoff) {
            dx = "Obesidad";
        }
        return { smi, dx };
    },
    
    // 4. Fuerza RM y Dinapenia
    brzycki: (weight, reps) => {
        if(reps === 1) return weight.toFixed(1);
        return (weight / (1.0278 - (0.0278 * reps))).toFixed(1);
    },
    dynapeniaCheck: (handgrip, gender) => {
        const cutoff = gender === 'M' ? 27 : 16;
        return handgrip < cutoff ? `Dinapenia (<${cutoff}kg)` : "Fuerza Normal";
    },
    
    // 5. Perfil Metabólico e Inflamación
    homaIR: (glucose, insulin) => {
        const homa = ((glucose * insulin) / 405).toFixed(1);
        let dx = "Normal";
        if (homa >= 2.9) dx = "Resistencia a la Insulina Significativa";
        else if (homa >= 1.9) dx = "Resistencia a la Insulina Temprana";
        return { value: homa, dx: dx };
    },
    inflammationCheck: (crp) => {
        if (crp < 1.0) return "Bajo Riesgo CV";
        if (crp <= 3.0) return "Riesgo CV Moderado";
        return "Inflamación Sistémica / Alto Riesgo CV";
    }
};


// --- DATA: CLÚSTERES DE PACIENTES ---
const patientClusters = [
    {
        id: "cluster_1",
        name: "Carlos Mendoza",
        age: 68,
        pathologies: "Obesidad, Artrosis severa de rodilla bilateral, Hipertensión arterial.",
        contraindications: "Me duelen muchísimo las rodillas si trato de saltar, correr o hacer sentadillas. Además, le tengo pánico severo al agua (no sé nadar).",
        vitalSigns: "PA 145/90 mmHg, FC 78 lpm.",
        clinicalData: {
            gender: 'M', heightM: 1.68, weightKg: 92, age: 68, walk6Meters: 350,
            cpet: { vo2peak: 15.2, vt1_percent: 55, vt2_percent: 85, rer: 1.12, ve_vco2: 34, hrMax: 135 },
            inbody: { fatMassPercent: 35, visceralFat: 15, alm: 18.5, waistCircumference: 112 },
            strength: { handgrip: 22, chestPressWeight: 35, chestPressReps: 8 },
            labs: { glucose: 115, insulin: 18, hsCrp: 6.5 }
        },
        sdoh: "Vivo en un barrio donde solo hay tiendas pequeñas, no hay donde comprar verdura fresca. A veces no me alcanza la pensión y dejo de comprar mis pastillas. Por eso, en trabajo social me anotaron los códigos Z59.4 (Falta de alimentos adecuados) y Z59.6 (Bajos ingresos).",
        cvrs: "Impacto Severo: La barrera financiera (Z59.6) y el entorno alimentario limitado (Z59.4) generan bajo apego terapéutico. Esto deteriora su calidad de vida relacionada con la salud (CVRS).",
        extendedSdoh: { ethnicity: 'Me considero mestizo, como la mayoría por aquí.', education: 'Llegué hasta tercero de primaria.', stratum: 'Vivo en estrato 1.', religion: 'Soy católico devoto, voy a misa cuando el dolor de rodillas me deja.', utilities: 'A veces nos cortan la luz o el agua porque no alcanzo a pagar.', tvTime: 'Paso unas 6 horas al día viendo televisión porque no me puedo mover mucho.', socialMedia: 'No sé usar redes sociales, a veces miro Facebook en el celular de mi nieto.', parks: 'Hay un parquecito, pero está lleno de monte y viciosos, no se puede salir.', security: 'Es muy peligroso, a las 6 pm ya toca estar encerrado.', physicalActivity: 'Antes me gustaba jugar tejo, ahora nada.', diet: 'Como mucho arroz, papa y yuca. Es lo que llena y es barato.', foodAccess: 'La carne está muy cara, casi no compramos verduras porque se dañan rápido.', alcohol: 'Me tomo unas 3 o 4 cervezas los fines de semana con los vecinos.', smoking: 'Ya le conté, fumo como media cajetilla al día.' },
        keywords: {
            "test_walk": "Logré 350 metros pero me tuve que parar porque me ardían las rodillas.",
            "test_ergo": "Mi consumo de oxígeno fue bajito y me marcaron unas zonas de entrenamiento.",
            "test_inbody": "Salí con obesidad y poca masa muscular.",
            "test_strength": "Apreté un aparato y levanté peso en una máquina para el pecho.",
            "social": "El dinero de la pensión a veces no me alcanza.",
            "family": "Vivo con mi esposa, pero ella también está muy enferma.",
            "transport": "Agarro un bus que me deja a dos cuadras.",
            "water": "¡Uy no! Le tengo pánico al agua.",
            "exercise": "Si corro o salto siento que me muero del dolor.",
            "medication": "Tomo pastillas para la presión (losartán)."
        }
    },
    {
        id: "cluster_2",
        name: "Marta Silva",
        age: 72,
        pathologies: "EPOC leve, Insuficiencia Cardíaca estadio B, Tabaquismo activo.",
        contraindications: "Me asfixio muy rápido. Tampoco tolero estar acostada boca arriba completamente plana porque siento que me ahogo.",
        vitalSigns: "PA 130/80 mmHg, FC 85 lpm, SatO2 93%.",
        clinicalData: {
            gender: 'F', heightM: 1.60, weightKg: 65, age: 72, walk6Meters: 280,
            cpet: { vo2peak: 12.5, vt1_percent: 60, vt2_percent: 90, rer: 1.08, ve_vco2: 38, hrMax: 128 },
            inbody: { fatMassPercent: 38, visceralFat: 12, alm: 12.5, waistCircumference: 98 },
            strength: { handgrip: 14, chestPressWeight: 15, chestPressReps: 10 },
            labs: { glucose: 98, insulin: 12, hsCrp: 8.2 }
        },
        sdoh: "Vivo sola en un 3er piso sin ascensor y casi no tengo quién me ayude. No tengo coche y el bus pasa muy lejos, me cuesta salir. Me dijeron que mis códigos son Z60.2 (Vivir solo) y Z59.82 (Problemas de transporte).",
        cvrs: "Impacto Moderado-Severo: El aislamiento social (Z60.2) y la barrera de transporte limitan su acceso a rehabilitación.",
        extendedSdoh: { ethnicity: 'Soy afrocolombiano, mis abuelos eran del Chocó.', education: 'Terminé el bachillerato pero no pude estudiar más.', stratum: 'Soy de estrato 2.', religion: 'Creo en Dios, rezo el rosario todas las noches.', utilities: 'Sí tengo servicios, pero el gas es de pipeta y a veces me quedo sin él.', tvTime: 'Veo novelas toda la tarde, unas 4 horas diarias.', socialMedia: 'Uso WhatsApp para hablar con mis familiares que viven lejos.', parks: 'No hay parques cerca, y el andén está roto, me da miedo caerme.', security: 'No es tan peligroso, pero hay muchos perros callejeros bravos.', physicalActivity: 'Me gustaba caminar, pero ahora me ahogo rápido.', diet: 'Como sopas, arepas y huevito. Todo muy suave.', foodAccess: 'Compro lo básico en la tienda de la esquina, me fían a veces.', alcohol: 'No tomo nada de alcohol, me hace daño.', smoking: 'Nunca he fumado en mi vida.' },
        keywords: {
            "test_walk": "Caminé 6 minutos pero solo aguanté 280 metros. Me faltaba mucho el aire.",
            "test_ergo": "Mis pulmones están muy cansados.",
            "test_inbody": "Tengo poca masa muscular y mucha grasa escondida.",
            "test_strength": "Apenas y tengo fuerza en las manos.",
            "social": "Económicamente me ayudan mis hijos un poco.",
            "family": "Vivo sola. Mis hijos están fuera del país.",
            "transport": "No tengo coche y la parada del autobús me queda a 6 cuadras.",
            "water": "El agua no me molesta, pero no sé nadar.",
            "exercise": "Solo con caminar rápido ya me falta el aire por los pulmones.",
            "medication": "Tomo inhaladores para el EPOC y pastillas para el corazón."
        }
    },
    {
        id: "cluster_3",
        name: "Roberto Gómez",
        age: 62,
        pathologies: "Diabetes Mellitus Tipo 2, Enfermedad Renal Crónica (ERC) Estadio 3a, Microalbuminuria.",
        contraindications: "El nefrólogo me prohibió hacer esfuerzos extremos donde me ponga rojo o aguante la respiración, porque mi presión se dispara y daño más mis riñones.",
        vitalSigns: "PA 142/88 mmHg, FC 74 lpm.",
        clinicalData: {
            gender: 'M', heightM: 1.70, weightKg: 85, age: 62, walk6Meters: 420,
            cpet: { vo2peak: 18.5, vt1_percent: 50, vt2_percent: 80, rer: 1.15, ve_vco2: 30, hrMax: 145 },
            inbody: { fatMassPercent: 30, visceralFat: 14, alm: 20.0, waistCircumference: 105 },
            strength: { handgrip: 30, chestPressWeight: 45, chestPressReps: 10 },
            labs: { glucose: 180, insulin: 22, hsCrp: 4.5 }
        },
        sdoh: "Trabajo todo el día sentado como chofer de bus. Como mucha comida de la calle porque no tengo tiempo de cocinar sano. Trabajo Social me diagnosticó Z56.3 (Ritmo de trabajo estresante) y Z59.4 (Falta de alimentos adecuados).",
        cvrs: "Riesgo microvascular acelerado por el sedentarismo laboral prolongado y la dieta hipercalórica de la calle.",
        extendedSdoh: { ethnicity: 'Mestizo, de familia campesina.', education: 'Hice un técnico en mecánica a medias.', stratum: 'Estrato 3, gracias a Dios.', religion: 'Soy evangélico, los domingos voy al culto si no estoy trabajando.', utilities: 'Tenemos todos los servicios al día.', tvTime: 'Llego tan cansado que veo 1 hora de noticias y me duermo.', socialMedia: 'Paso como 3 horas en TikTok o Instagram mientras espero pasajeros.', parks: 'Hay una cancha sintética, pero hay que pagar para usarla.', security: 'Regular, a veces atracan en las paradas de bus.', physicalActivity: 'No hago nada, solo muevo el timón del bus.', diet: 'Puro perro caliente, empanadas y gaseosa en la calle.', foodAccess: 'Puedo comprar buena comida, pero en la calle no hay opciones sanas.', alcohol: 'Los viernes me bajo media botella de aguardiente con los compañeros.', smoking: 'Fumo unos 5 cigarrillos al día para no dormirme manejando.' },
        keywords: {
            "test_walk": "Hice 420 metros. Me sentí bien, aunque se me duermen los pies un poquito.",
            "test_ergo": "Me dijeron que mi VO2 es de 18.5. Normalito.",
            "test_inbody": "Tengo grasa visceral alta por comer tanto en la calle.",
            "test_strength": "En el aparato de la mano apreté 30 kilos.",
            "social": "Como soy chofer, almuerzo en cualquier esquina rápido.",
            "family": "Mi esposa trabaja también, nos vemos poco.",
            "transport": "Paso 10 horas en el auto.",
            "water": "Me gusta nadar.",
            "exercise": "Quiero ejercitarme pero sin que se me suba la presión.",
            "medication": "Metformina y losartán."
        }
    },
    {
        id: "cluster_4",
        name: "Carmen Valdés",
        age: 48,
        pathologies: "Hígado Graso (MAFLD), Síndrome Metabólico, Obesidad Central.",
        contraindications: "No tengo dolores, pero me canso muchísimo si me ponen a correr rápido. El médico dijo que mi hígado está lleno de grasa.",
        vitalSigns: "PA 135/85 mmHg, FC 82 lpm.",
        clinicalData: {
            gender: 'F', heightM: 1.55, weightKg: 88, age: 48, walk6Meters: 390,
            cpet: { vo2peak: 16.0, vt1_percent: 55, vt2_percent: 85, rer: 1.10, ve_vco2: 32, hrMax: 155 },
            inbody: { fatMassPercent: 42, visceralFat: 18, alm: 16.5, waistCircumference: 110 },
            strength: { handgrip: 20, chestPressWeight: 20, chestPressReps: 10 },
            labs: { glucose: 105, insulin: 28, hsCrp: 7.2 }
        },
        sdoh: "Tengo muchísima ansiedad y estrés por las presiones de mi trabajo, a veces me da por comer dulces para calmarme. Mi psicólogo me puso el código Z56.6 (Otras dificultades en el trabajo) y Z73.3 (Estrés no clasificado).",
        cvrs: "Impacto Metabólico severo por hiperinsulinemia compensatoria y esteatosis hepática.",
        extendedSdoh: { ethnicity: 'Blanco, de ascendencia paisa.', education: 'Soy profesional, tengo una especialización.', stratum: 'Vivo en estrato 4.', religion: 'No soy muy religioso, la verdad me considero agnóstico.', utilities: 'Tengo todos los servicios e internet de alta velocidad.', tvTime: 'Casi no veo TV, prefiero ver series en Netflix el fin de semana.', socialMedia: 'Paso 4 horas diarias metido en Twitter y LinkedIn.', parks: 'Hay parques bonitos y seguros por mi conjunto residencial.', security: 'Es muy seguro, hay celaduría 24 horas.', physicalActivity: 'Me gustaría jugar tenis o ir al gimnasio, pero no tengo energía.', diet: 'Como muchos dulces y paquetes en la oficina por la ansiedad.', foodAccess: 'Pido domicilios de restaurantes buenos, pero nada saludable.', alcohol: 'Me tomo una copa de vino casi todas las noches para relajarme.', smoking: 'Fumo un paquete diario, es por el estrés del trabajo.' },
        keywords: {
            "test_walk": "Caminé 390 metros, me cansé bastante.",
            "test_ergo": "Me ahogué un poco con la mascarilla.",
            "test_inbody": "Tengo la grasa visceral muy alta (nivel 18).",
            "test_strength": "No tengo mucha fuerza en los brazos.",
            "social": "El trabajo me estresa y como muchos dulces.",
            "family": "Vivo con mis hijos, ellos comen mucha comida chatarra.",
            "transport": "Uso mi auto para todo.",
            "water": "Sí sé nadar.",
            "exercise": "Quiero quemar la grasa del hígado pero necesito empezar suave.",
            "medication": "No tomo medicinas, solo me mandaron dieta."
        }
    },
    {
        id: "cluster_5",
        name: "Javier Castro",
        age: 55,
        pathologies: "Falla Cardíaca con Fracción de Eyección Preservada (HFpEF), Fibrilación Auricular paroxística, Obesidad.",
        contraindications: "A veces el corazón me late desordenado (arritmia). Tomo betabloqueadores que me mantienen el pulso muy bajito.",
        vitalSigns: "PA 125/80 mmHg, FC 58 lpm (por betabloqueador).",
        clinicalData: {
            gender: 'M', heightM: 1.75, weightKg: 95, age: 55, walk6Meters: 360,
            cpet: { vo2peak: 14.5, vt1_percent: 55, vt2_percent: 80, rer: 1.09, ve_vco2: 35, hrMax: 115 },
            inbody: { fatMassPercent: 32, visceralFat: 16, alm: 22.0, waistCircumference: 108 },
            strength: { handgrip: 35, chestPressWeight: 50, chestPressReps: 10 },
            labs: { glucose: 95, insulin: 15, hsCrp: 5.0 }
        },
        sdoh: "Tengo un buen trabajo, pero desde el susto del corazón quedé muy deprimido, casi no salgo y me aíslo de la gente. Me han dicho que tengo el código Z60.4 (Exclusión social y rechazo) por mi aislamiento.",
        cvrs: "Ansiedad secundaria al diagnóstico cardíaco; la medicación bradicardizante limita su percepción de esfuerzo natural.",
        extendedSdoh: { ethnicity: 'Blanco, mi familia es de Bogotá.', education: 'Tengo maestría.', stratum: 'Estrato 5.', religion: 'Católico no practicante.', utilities: 'Todo perfecto en la casa.', tvTime: 'Últimamente paso 8 horas viendo series porque no quiero salir de la cama.', socialMedia: 'No miro redes, me deprime ver a los demás felices.', parks: 'Hay zonas verdes excelentes, pero ni me asomo por la ventana.', security: 'Muy seguro, barrio residencial privado.', physicalActivity: 'Antes nadaba, ahora no le encuentro sentido a nada.', diet: 'Como muy poco, a veces se me olvida almorzar.', foodAccess: 'Tengo el dinero para comprar lo mejor, pero pido pizza o no como.', alcohol: 'Estoy tomando mucho whisky solo en casa últimamente.', smoking: 'Fumo esporádicamente, cuando me da crisis de angustia.' },
        keywords: {
            "test_walk": "Caminé 360 metros. Me canso, pero mi corazón no late rápido por las pastillas.",
            "test_ergo": "Mi pulso máximo apenas llegó a 115 en la bicicleta.",
            "test_inbody": "Sobrepeso y grasa visceral alta.",
            "test_strength": "De fuerza ando bien.",
            "social": "Económicamente estoy bien.",
            "family": "Mi esposa me cuida mucho ahora.",
            "transport": "Conduzco mi auto.",
            "water": "Me gusta la piscina.",
            "exercise": "Me da miedo que me dé una arritmia si me esfuerzo.",
            "medication": "Metoprolol y anticoagulantes."
        }
    },
    {
        id: "cluster_6",
        name: "Rosa Jiménez",
        age: 66,
        pathologies: "Enfermedad Arterial Periférica (EAP), Tabaquismo, Dislipidemia.",
        contraindications: "Cuando camino unas dos cuadras, me da un calambre horrible en las pantorrillas y tengo que parar a descansar.",
        vitalSigns: "PA 130/80 mmHg, FC 80 lpm.",
        clinicalData: {
            gender: 'F', heightM: 1.58, weightKg: 68, age: 66, walk6Meters: 250,
            cpet: { vo2peak: 13.0, vt1_percent: 60, vt2_percent: 90, rer: 1.05, ve_vco2: 36, hrMax: 130 },
            inbody: { fatMassPercent: 33, visceralFat: 10, alm: 14.0, waistCircumference: 85 },
            strength: { handgrip: 18, chestPressWeight: 15, chestPressReps: 12 },
            labs: { glucose: 90, insulin: 10, hsCrp: 9.5 }
        },
        sdoh: "El dinero no me alcanza para pagar tratamientos para dejar de fumar, así que el cigarrillo es mi único escape. Me anotaron Z59.6 (Bajos ingresos) y Z72.0 (Problemas relacionados con el uso de tabaco).",
        cvrs: "La claudicación intermitente severa limita totalmente su movilidad y socialización comunitaria.",
        extendedSdoh: { ethnicity: 'Mestizo, no tengo claro mi origen exacto.', education: 'Solo hice la primaria.', stratum: 'Estrato 1.', religion: 'Creo en los santos y la virgen.', utilities: 'El agua llega día de por medio.', tvTime: 'La televisión es mi única compañía, la prendo todo el día.', socialMedia: 'No tengo internet en la casa.', parks: 'Puro tierrero por acá.', security: 'Es zona roja, mucha pandilla.', physicalActivity: 'Barrer la casa es lo único que hago.', diet: 'Mucha harina, plátano y agua de panela.', foodAccess: 'A veces hacemos una sola comida al día.', alcohol: 'Tomo chicha o cerveza cuando me invitan.', smoking: 'El cigarrillo es mi vida, me fumo paquete y medio.' },
        keywords: {
            "test_walk": "En la prueba a los 100 metros ya me dolían las piernas, paré varias veces. Hice 250m.",
            "test_ergo": "La pararon rápido porque me dolieron mucho las piernas en la bici.",
            "test_inbody": "Peso normal pero fumo mucho.",
            "test_strength": "Fuerza normal, creo.",
            "social": "Mi problema es el cigarro, no lo puedo dejar.",
            "family": "Vivo sola.",
            "transport": "Camino con dolor.",
            "water": "No voy a piscinas.",
            "exercise": "El dolor en las piernas no me deja hacer nada.",
            "medication": "Aspirina y estatinas."
        }
    },
    {
        id: "cluster_7",
        name: "Luis Fernández",
        age: 65,
        pathologies: "Post-Infarto Agudo de Miocardio (hace 3 meses), ERC Estadio 3b.",
        contraindications: "El cardiólogo me dijo que no haga fuerzas donde contenga el aire (Valsalva) porque me puede dar otro infarto.",
        vitalSigns: "PA 115/70 mmHg, FC 60 lpm.",
        clinicalData: {
            gender: 'M', heightM: 1.72, weightKg: 82, age: 65, walk6Meters: 380,
            cpet: { vo2peak: 17.0, vt1_percent: 55, vt2_percent: 85, rer: 1.10, ve_vco2: 33, hrMax: 125 },
            inbody: { fatMassPercent: 28, visceralFat: 12, alm: 21.0, waistCircumference: 95 },
            strength: { handgrip: 32, chestPressWeight: 40, chestPressReps: 8 },
            labs: { glucose: 100, insulin: 14, hsCrp: 8.0 }
        },
        sdoh: "Vivo muy lejos de la clínica y el transporte público acá es muy deficiente y peligroso. Me dijeron que esto corresponde a los códigos Z59.82 (Problemas de transporte) y Z59.5 (Pobreza extrema / barreras de acceso).",
        cvrs: "Ansiedad post-infarto, fatiga crónica leve por disfunción renal.",
        extendedSdoh: { ethnicity: 'Tengo raíces indígenas por parte de mi madre en el Cauca.', education: 'Bachiller.', stratum: 'Estrato 2, en un corregimiento a las afueras.', religion: 'Evangélica.', utilities: 'La luz se va a cada rato.', tvTime: 'Vemos TV en la noche en familia, 2 horas.', socialMedia: 'Uso WhatsApp con datos prepago.', parks: 'Todo es campo abierto por aquí.', security: 'Tranquilo, todos nos conocemos.', physicalActivity: 'Camino mucho para ir a coger el bus.', diet: 'Comemos sancocho, arroz, frijol.', foodAccess: 'Cultivamos algunas cosas, pero la carne es escasa.', alcohol: 'Cero alcohol por mi religión.', smoking: 'No fumo, nunca me gustó.' },
        keywords: {
            "test_walk": "Caminé 380 metros, me cuidé de no agitarme mucho por miedo al corazón.",
            "test_ergo": "Mi pulso no sube de 125 por las medicinas.",
            "test_inbody": "Me dijeron que mi composición es aceptable.",
            "test_strength": "Hago fuerza pero respiro continuo, no aguanto el aire.",
            "social": "Viajo 2 horas en bus para venir.",
            "family": "Mi familia está muy pendiente de mí.",
            "transport": "Transporte público.",
            "water": "Sí sé nadar.",
            "exercise": "Tengo mucho miedo de que me dé un infarto entrenando.",
            "medication": "Betabloqueadores, clopidogrel, estatinas."
        }
    },
    {
        id: "cluster_8",
        name: "Lucía Blanco",
        age: 28,
        pathologies: "Síndrome de Ovario Poliquístico (SOP), Obesidad Grado II, Resistencia a la Insulina.",
        contraindications: "Tengo mucho peso extra que me duele en los tobillos si salto. Me cuesta horrores bajar de peso.",
        vitalSigns: "PA 125/80 mmHg, FC 75 lpm.",
        clinicalData: {
            gender: 'F', heightM: 1.62, weightKg: 95, age: 28, walk6Meters: 400,
            cpet: { vo2peak: 20.0, vt1_percent: 60, vt2_percent: 85, rer: 1.15, ve_vco2: 28, hrMax: 180 },
            inbody: { fatMassPercent: 45, visceralFat: 15, alm: 20.0, waistCircumference: 110 },
            strength: { handgrip: 26, chestPressWeight: 25, chestPressReps: 12 },
            labs: { glucose: 95, insulin: 35, hsCrp: 4.0 } // HOMA-IR = 8.2 (Muy alto)
        },
        sdoh: "Paso sentada en una oficina de 8 a 8, el cansancio no me deja cocinar ni hacer ejercicio, solo pido comida rápida. Me diagnosticaron Z56.3 (Ritmo de trabajo agotador) y Z72.3 (Falta de ejercicio físico).",
        cvrs: "Baja autoestima por el peso y el hirsutismo. Estrés laboral alto.",
        extendedSdoh: { ethnicity: 'Mestizo, normal.', education: 'Profesional universitaria.', stratum: 'Estrato 3.', religion: 'Católica.', utilities: 'Servicios normales.', tvTime: 'No veo TV, me duermo apenas llego.', socialMedia: 'Unas 2 horas en Instagram antes de dormir.', parks: 'Hay un parque lineal cerca.', security: 'Seguro de día, peligroso de noche.', physicalActivity: 'Odio hacer ejercicio, me aburre.', diet: 'Mucha comida rápida por falta de tiempo.', foodAccess: 'Hay de todo, pero no tengo tiempo de ir al supermercado.', alcohol: 'Tomo cocteles los sábados con mis amigas.', smoking: 'Solo fumo socialmente, fines de semana.' },
        keywords: {
            "test_walk": "Caminé bien, 400 metros, pero me duelen los tobillos al final.",
            "test_ergo": "Llegué a 180 pulsaciones, me exigí bastante.",
            "test_inbody": "Tengo 45% de grasa, es frustrante.",
            "test_strength": "Tengo buena masa muscular escondida debajo de la grasa.",
            "social": "No cocino por falta de tiempo.",
            "family": "Vivo con amigas.",
            "transport": "Uber o bus.",
            "water": "Me gusta el agua.",
            "exercise": "He intentado cardio pero no bajo nada, dicen que necesito hacer pesas.",
            "medication": "Metformina y anticonceptivos."
        }
    },
    {
        id: "cluster_9",
        name: "Samuel Ortega",
        age: 50,
        pathologies: "Enfermedad Renal Terminal, en Hemodiálisis trisemanal, Hipertensión severa.",
        contraindications: "Tengo una fístula en el brazo izquierdo, no puedo hacer fuerza con ese brazo ni dejar que me tomen la presión ahí.",
        vitalSigns: "PA 150/95 mmHg, FC 82 lpm.",
        clinicalData: {
            gender: 'M', heightM: 1.65, weightKg: 65, age: 50, walk6Meters: 300,
            cpet: { vo2peak: 14.0, vt1_percent: 50, vt2_percent: 80, rer: 1.05, ve_vco2: 40, hrMax: 135 },
            inbody: { fatMassPercent: 20, visceralFat: 8, alm: 15.0, waistCircumference: 85 },
            strength: { handgrip: 25, chestPressWeight: 20, chestPressReps: 8 }, // Brazo derecho
            labs: { glucose: 90, insulin: 10, hsCrp: 12.0 } // CRP alto por diálisis
        },
        sdoh: "La diálisis me consume 3 días completos a la semana, así que nadie me da empleo estable. Vivo de los subsidios. Trabajo Social me clasificó con Z56.0 (Desempleo) y Z59.5 (Extrema pobreza).",
        cvrs: "Depresión moderada, fatiga post-diálisis extrema que limita la adherencia.",
        extendedSdoh: { ethnicity: 'Soy afrodescendiente, nací en la costa.', education: 'Hice hasta 5to bachillerato.', stratum: 'Estrato 1.', religion: 'Testigo de Jehová.', utilities: 'Dependemos de subsidios para pagar la luz.', tvTime: 'Paso 6 horas en la máquina de diálisis viendo el celular.', socialMedia: 'Miro muchos videos de YouTube.', parks: 'No salgo a parques, me canso.', security: 'Vivo en un barrio humilde y peligroso.', physicalActivity: 'Ninguna, la diálisis me deja exhausto.', diet: 'Tengo dieta estricta renal, muy desabrida.', foodAccess: 'Me dan un mercado de la alcaldía.', alcohol: 'No puedo tomar absolutamente nada de alcohol.', smoking: 'Dejé de fumar cuando me fallaron los riñones.' },
        keywords: {
            "test_walk": "Caminé 300 metros, la anemia me tiene muy cansado.",
            "test_ergo": "Me ahogué rápido en la bici.",
            "test_inbody": "Poca masa muscular.",
            "test_strength": "Solo hice fuerza con el brazo derecho por la fístula en el izquierdo.",
            "social": "No puedo trabajar.",
            "family": "Mi madre me cuida.",
            "transport": "Me llevan en ambulancia a la clínica.",
            "water": "No puedo meterme a piscinas por el catéter/fístula.",
            "exercise": "Los días de diálisis quedó destruido, solo podría hacer algo los días libres.",
            "medication": "Antihipertensivos y eritropoyetina."
        }
    },
    {
        id: "cluster_10",
        name: "Diego Navarro",
        age: 52,
        pathologies: "Apnea Obstructiva del Sueño (SAOS), Obesidad Grado III, HTA Resistente.",
        contraindications: "Si me acuesto boca arriba me ahogo y ronco muchísimo. Mi cuello es muy grueso y me asfixio.",
        vitalSigns: "PA 155/100 mmHg, FC 85 lpm.",
        clinicalData: {
            gender: 'M', heightM: 1.70, weightKg: 120, age: 52, walk6Meters: 320,
            cpet: { vo2peak: 16.5, vt1_percent: 55, vt2_percent: 80, rer: 1.12, ve_vco2: 32, hrMax: 150 },
            inbody: { fatMassPercent: 42, visceralFat: 22, alm: 26.0, waistCircumference: 125 },
            strength: { handgrip: 35, chestPressWeight: 50, chestPressReps: 10 },
            labs: { glucose: 110, insulin: 25, hsCrp: 6.8 }
        },
        sdoh: "Tengo un insomnio terrible y vivo con los nervios de punta por las deudas. Rindo mal en mi empleo. Mi doctora anotó Z73.4 (Falta de descanso y relajación) y Z59.8 (Otros problemas de economía).",
        cvrs: "Somnolencia diurna severa que limita la motivación para el ejercicio.",
        extendedSdoh: { ethnicity: 'Mestiza.', education: 'Tecnóloga.', stratum: 'Estrato 3.', religion: 'Creencias espirituales varias.', utilities: 'Servicios completos.', tvTime: 'Prendo el televisor toda la madrugada porque no puedo dormir.', socialMedia: 'Paso 5 horas en TikTok por la noche.', parks: 'Hay parque pero no me da la energía para ir.', security: 'Normal, un barrio promedio.', physicalActivity: 'Me gustaría hacer yoga.', diet: 'Tomo mucho café y bebidas energizantes.', foodAccess: 'Compro en el supermercado quincenalmente.', alcohol: 'A veces me tomo un trago para ver si me da sueño.', smoking: 'Fumo vaper todo el día por la ansiedad.' },
        keywords: {
            "test_walk": "320 metros, cargo con 120 kilos, es mucho peso para mis rodillas.",
            "test_ergo": "Buena fuerza en las piernas, pero el aire me falta por el peso del pecho.",
            "test_inbody": "Grasa visceral nivel 22, altísima.",
            "test_strength": "Tengo mucha fuerza bruta.",
            "social": "Estrés crónico.",
            "family": "Mi esposa no duerme por mis ronquidos.",
            "transport": "Auto.",
            "water": "Sí nado.",
            "exercise": "Boca arriba no me pongan porque me asfixio.",
            "medication": "Tomo 3 pastillas para la presión y no me baja."
        }
    },
    {
        id: "cluster_11",
        name: "Ana Martínez",
        age: 58,
        pathologies: "Riesgo de Pie Diabético, DM2 larga data, Neuropatía sensitiva.",
        contraindications: "No siento la planta de los pies. Si me corto o me sale una ampolla no me doy cuenta.",
        vitalSigns: "PA 130/80 mmHg, FC 75 lpm.",
        clinicalData: {
            gender: 'F', heightM: 1.55, weightKg: 75, age: 58, walk6Meters: 350,
            cpet: { vo2peak: 15.0, vt1_percent: 50, vt2_percent: 85, rer: 1.08, ve_vco2: 34, hrMax: 135 },
            inbody: { fatMassPercent: 38, visceralFat: 14, alm: 15.0, waistCircumference: 95 },
            strength: { handgrip: 20, chestPressWeight: 20, chestPressReps: 10 },
            labs: { glucose: 190, insulin: 20, hsCrp: 5.5 }
        },
        sdoh: "Me duelen mucho los pies, pero los zapatos especiales para diabéticos no los cubre mi seguro y son muy caros. Tengo el código Z59.6 (Bajos ingresos) y Z75.3 (Problemas para acceder a servicios de salud).",
        cvrs: "El déficit sensitivo en los pies le genera miedo a caminar grandes distancias.",
        extendedSdoh: { ethnicity: 'Mestizo.', education: 'Bachiller clásico.', stratum: 'Estrato 2.', religion: 'Católico.', utilities: 'Todo bien.', tvTime: 'Veo fútbol y noticias, unas 3 horas.', socialMedia: 'Miro Facebook una hora al día.', parks: 'Hay canchas de cemento.', security: 'Roban mucho si uno da papaya.', physicalActivity: 'Me encantaba jugar fútbol, ahora los pies no me dan.', diet: 'Sé que soy diabético pero peco con los postres y el pan.', foodAccess: 'Compramos en la plaza de mercado.', alcohol: 'Tomo cerveza viendo los partidos.', smoking: 'Me fumo un par de cigarrillos diarios.' },
        keywords: {
            "test_walk": "Caminé 350 metros, pero tengo que mirar el piso porque no siento bien los pies.",
            "test_ergo": "La bici me gustó más porque no apoyo tanto los pies.",
            "test_inbody": "Sobrepeso.",
            "test_strength": "Fuerza normal.",
            "social": "No tengo dinero para calzado especial.",
            "family": "Vivo con mi hija.",
            "transport": "Autobús.",
            "water": "Me gusta la piscina.",
            "exercise": "Tengo que cuidar mucho mis pies de no hacerles heridas o impacto fuerte.",
            "medication": "Insulina y gabapentina."
        }
    },
    {
        id: "cluster_12",
        name: "Silvia Cruz",
        age: 32,
        pathologies: "Hipercolesterolemia Familiar (HF), Aterosclerosis prematura.",
        contraindications: "Soy delgada, pero tengo el colesterol LDL en 300. El médico dice que mis arterias tienen placas de grasa y debo cuidarme como si pesara 100kg.",
        vitalSigns: "PA 125/80 mmHg, FC 70 lpm.",
        clinicalData: {
            gender: 'F', heightM: 1.65, weightKg: 60, age: 32, walk6Meters: 550,
            cpet: { vo2peak: 25.0, vt1_percent: 65, vt2_percent: 85, rer: 1.15, ve_vco2: 28, hrMax: 175 },
            inbody: { fatMassPercent: 22, visceralFat: 4, alm: 19.0, waistCircumference: 72 },
            strength: { handgrip: 28, chestPressWeight: 30, chestPressReps: 12 },
            labs: { glucose: 85, insulin: 8, hsCrp: 4.5 } // hsCrp elevada por inflamación de placa
        },
        sdoh: "Soy gerente de un banco y el estrés es brutal. Mi padre murió joven del corazón y me da terror que me pase lo mismo. Me diagnosticaron Z56.6 (Estrés laboral) y Z82.4 (Historia familiar de enfermedad isquémica).",
        cvrs: "Ansiedad extrema por riesgo genético de muerte súbita o infarto joven.",
        extendedSdoh: { ethnicity: 'Blanco, de familia tradicional.', education: 'Especialista en finanzas.', stratum: 'Estrato 5.', religion: 'Ateo.', utilities: 'Todo de lujo.', tvTime: 'No veo TV, leo noticias financieras.', socialMedia: 'Solo LinkedIn, unas 2 horas.', parks: 'Tengo un club campestre.', security: 'Tengo esquema de seguridad.', physicalActivity: 'Debería jugar golf pero nunca tengo tiempo.', diet: 'Cenas de negocios, muchos cortes de carne y comida gourmet.', foodAccess: 'Acceso ilimitado a cualquier alimento.', alcohol: 'Mucho vino y licores finos en reuniones.', smoking: 'Fumo habanos ocasionalmente.' },
        keywords: {
            "test_walk": "Caminé muchísimo, soy ágil.",
            "test_ergo": "Llegué a buen nivel, pero me asusta exigirme por mis arterias.",
            "test_inbody": "Soy delgada, grasa baja.",
            "test_strength": "Buena fuerza.",
            "social": "Estrés del banco.",
            "family": "Mi padre murió de infarto a los 40.",
            "transport": "Coche.",
            "water": "Nado bien.",
            "exercise": "Necesito saber a qué intensidad exacta puedo entrenar sin romper una placa de ateroma.",
            "medication": "Estatinas en dosis altas."
        }
    },
    {
        id: "cluster_13",
        name: "Fernando López",
        age: 60,
        pathologies: "Secuelas de ACV Isquémico, Hemiparesia derecha, Espasticidad leve.",
        contraindications: "Si me ponen a mover el brazo o pierna derecha muy rápido, el músculo se me traba y se pone duro (espasticidad).",
        vitalSigns: "PA 135/85 mmHg, FC 72 lpm.",
        clinicalData: {
            gender: 'M', heightM: 1.70, weightKg: 80, age: 60, walk6Meters: 220, // Camina lento por hemiparesia
            cpet: { vo2peak: 14.0, vt1_percent: 55, vt2_percent: 80, rer: 1.05, ve_vco2: 35, hrMax: 130 },
            inbody: { fatMassPercent: 28, visceralFat: 14, alm: 17.0, waistCircumference: 95 }, // Atrofia lado derecho
            strength: { handgrip: 12, chestPressWeight: 15, chestPressReps: 8 }, // Fuerza medida en lado derecho afectado
            labs: { glucose: 95, insulin: 12, hsCrp: 3.5 }
        },
        sdoh: "Quedé con media parálisis tras el derrame, así que ya no puedo trabajar. Dependo totalmente de una pequeña pensión. Mis barreras son Z56.2 (Amenaza de pérdida de empleo / Incapacidad) y Z59.6 (Bajos ingresos).",
        cvrs: "Baja autoestima por la discapacidad motora, miedo a las caídas.",
        extendedSdoh: { ethnicity: 'Afrocolombiano.', education: 'Técnico electricista.', stratum: 'Estrato 2.', religion: 'Cristiano.', utilities: 'Mi hijo me ayuda a pagarlos.', tvTime: 'Veo documentales 4 horas diarias.', socialMedia: 'Uso WhatsApp de voz porque me cuesta escribir.', parks: 'La silla de ruedas no rueda bien en las calles de mi barrio.', security: 'Peligroso, me pueden robar la silla.', physicalActivity: 'Solo la terapia física que me da el seguro.', diet: 'Como licuados y papillas por problemas para tragar.', foodAccess: 'Comemos lo que la pensión alcanza.', alcohol: 'Nada de alcohol.', smoking: 'Fumaba mucho antes del derrame, ya no.' },
        keywords: {
            "test_walk": "Caminé 220 metros, cojeo un poco de la pierna derecha.",
            "test_ergo": "La bici recumbente es mejor porque no pierdo el equilibrio.",
            "test_inbody": "Tengo el brazo y pierna derecha más delgados que el izquierdo.",
            "test_strength": "Con la mano derecha casi no aprieto, con la izquierda sí tengo fuerza.",
            "social": "Problemas de dinero por la invalidez.",
            "family": "Mi esposa me ayuda a vestirme a veces.",
            "transport": "Uso bastón.",
            "water": "Me da miedo resbalar en la piscina.",
            "exercise": "Los movimientos deben ser lentos, si trato de ir rápido el brazo se me encoge.",
            "medication": "Anticoagulantes y pastillas para la presión."
        }
    },
    {
        id: "cluster_14",
        name: "Carmen Suárez",
        age: 35,
        pathologies: "Diabetes Gestacional previa (hace 3 años), Obesidad Abdominal, Prediabetes.",
        contraindications: "No tengo dolores graves, pero tengo muy poco tiempo libre por el cuidado de mi hijo pequeño.",
        vitalSigns: "PA 120/80 mmHg, FC 76 lpm.",
        clinicalData: {
            gender: 'F', heightM: 1.60, weightKg: 80, age: 35, walk6Meters: 450,
            cpet: { vo2peak: 22.0, vt1_percent: 55, vt2_percent: 85, rer: 1.12, ve_vco2: 29, hrMax: 170 },
            inbody: { fatMassPercent: 36, visceralFat: 14, alm: 18.0, waistCircumference: 98 },
            strength: { handgrip: 24, chestPressWeight: 25, chestPressReps: 12 },
            labs: { glucose: 108, insulin: 22, hsCrp: 2.5 } // HOMA-IR alto = 5.8
        },
        sdoh: "Crío a mis tres hijos yo sola, apenas tengo tiempo para respirar, mucho menos para pagar o ir a un gimnasio. Me dijeron que tengo Z60.2 (Vivir solo / Apoyo familiar nulo) y Z59.6 (Problemas económicos).",
        cvrs: "Sobrecarga del cuidador. Si la prescripción demanda mucho tiempo, no tendrá adherencia.",
        extendedSdoh: { ethnicity: 'Mestiza, de acá de la región.', education: 'Bachiller.', stratum: 'Estrato 2.', religion: 'Católica practicante.', utilities: 'A veces debo recibos.', tvTime: 'No tengo tiempo ni de prenderlo.', socialMedia: 'Miro videos mientras voy en el bus, 2 horas.', parks: 'Llevo a mis hijos al parque los domingos.', security: 'Toca estar pendiente de los niños porque hay viciosos.', physicalActivity: 'Me gusta bailar zumba.', diet: 'Comemos muchos huevos y arroz porque es barato.', foodAccess: 'Hago mercado en las tiendas de descuento D1/Ara.', alcohol: 'No tomo, debo cuidar a mis hijos.', smoking: 'No fumo.' },
        keywords: {
            "test_walk": "Hice 450 metros sin problema.",
            "test_ergo": "Rendí bien, aunque cansada al final.",
            "test_inbody": "Me quedó grasa abdominal después del embarazo.",
            "test_strength": "Buena fuerza, de tanto cargar al niño.",
            "social": "No tengo dinero para pagar gimnasio o niñera.",
            "family": "Madre soltera, mi hijo tiene 3 años.",
            "transport": "Autobús.",
            "water": "No tengo tiempo para ir a piscinas.",
            "exercise": "Necesito rutinas muy cortas que pueda hacer en casa mientras el niño duerme.",
            "medication": "Ninguna por ahora."
        }
    },
    {
        id: "cluster_15",
        name: "Pedro Ramírez",
        age: 25,
        pathologies: "Diabetes Mellitus Tipo 1, Microalbuminuria inicial.",
        contraindications: "Me dan bajones de azúcar (hipoglucemia) si hago ejercicio y no me mido bien la glucosa.",
        vitalSigns: "PA 118/75 mmHg, FC 68 lpm.",
        clinicalData: {
            gender: 'M', heightM: 1.75, weightKg: 70, age: 25, walk6Meters: 580,
            cpet: { vo2peak: 35.0, vt1_percent: 65, vt2_percent: 90, rer: 1.18, ve_vco2: 26, hrMax: 185 },
            inbody: { fatMassPercent: 18, visceralFat: 4, alm: 25.0, waistCircumference: 78 },
            strength: { handgrip: 40, chestPressWeight: 60, chestPressReps: 10 },
            labs: { glucose: 140, insulin: 5, hsCrp: 1.5 } // Insulina exógena baja
        },
        sdoh: "Me recomendaron usar el sensor de glucosa en el brazo, pero la EPS no me lo da y es impagable para mí. Me anotaron Z59.6 (Bajos ingresos) y Z75.1 (Falta de tecnología médica).",
        cvrs: "Estrés constante por el miedo a la hipoglucemia nocturna post-ejercicio.",
        extendedSdoh: { ethnicity: 'Mestizo.', education: 'Universitario incompleto.', stratum: 'Estrato 3.', religion: 'Ninguna en particular.', utilities: 'Servicios normales.', tvTime: 'Veo series 2 horas al día.', socialMedia: 'Paso unas 3 horas en Instagram.', parks: 'Hay ciclovía cerca.', security: 'Relativamente seguro de día.', physicalActivity: 'Salgo a montar bicicleta los domingos.', diet: 'Intento comer sano, pero los productos integrales son caros.', foodAccess: 'Compro frutas pero a veces el presupuesto no da.', alcohol: 'Tomo cervezas artesanales de vez en cuando.', smoking: 'No fumo.' },
        keywords: {
            "test_walk": "580 metros volando, tengo buena condición.",
            "test_ergo": "Llegué a 35 de VO2.",
            "test_inbody": "Composición sana, soy delgado.",
            "test_strength": "Buena fuerza.",
            "social": "Las tirillas reactivas me cuestan mucho dinero.",
            "family": "Vivo con mis padres.",
            "transport": "Bicicleta.",
            "water": "Nado bien.",
            "exercise": "El problema es que si entreno fuerte por la tarde, en la madrugada me da hipoglucemia severa.",
            "medication": "Insulina glargina y lispro."
        }
    }
];

// --- GENERADOR DE REPORTE CLÍNICO (HTML) ---
function generateClinicalReport(p) {
    const d = p.clinicalData;
    
    // Caminata 6M
    const pred6m = ClinicalCalculators.troosters(d.age, d.heightM, d.weightKg, d.gender);
    const pctPred = ((d.walk6Meters / pred6m) * 100).toFixed(0);
    const vo2est = ClinicalCalculators.vo2peakCahalin(d.walk6Meters);
    const mets = ClinicalCalculators.mets(vo2est);
    
    // CPET
    const z = ClinicalCalculators.cpetZones(d.cpet.vo2peak, d.cpet.vt1_percent, d.cpet.vt2_percent, d.cpet.hrMax);
    
    // InBody
    const sarco = ClinicalCalculators.sarcopeniaCheck(d.inbody.alm, d.heightM, d.inbody.fatMassPercent, d.gender);
    const imc = (d.weightKg / (d.heightM * d.heightM)).toFixed(1);
    
    // Fuerza
    const rm1 = ClinicalCalculators.brzycki(d.strength.chestPressWeight, d.strength.chestPressReps);
    const relStr = (rm1 / d.weightKg).toFixed(2);
    const dyna = ClinicalCalculators.dynapeniaCheck(d.strength.handgrip, d.gender);
    
    // Laboratorios (Perfil Metabólico e Inflamatorio)
    const homa = ClinicalCalculators.homaIR(d.labs.glucose, d.labs.insulin);
    const crpRisk = ClinicalCalculators.inflammationCheck(d.labs.hsCrp);
    
    return `
    Mira, el médico me entregó esta hoja oficial con los cálculos de mis pruebas funcionales. Te la muestro tal cual:
    <div style="font-family: monospace; background: #0f172a; padding: 15px; border-radius: 8px; font-size: 0.9em; border: 1px solid var(--primary-color); margin-top: 10px; text-align: left;">
        <h3 style="color: var(--primary-color); margin-top: 0; margin-bottom: 15px; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 10px;">REPORTE FISIOLÓGICO INTEGRADO</h3>
        
        <strong style="color: #38bdf8;">1. Test de Caminata 6 Minutos (6MWT)</strong><br>
        - Distancia real: ${d.walk6Meters} m<br>
        - Predicho (Troosters): ${pred6m} m (${pctPred}%)<br>
        - VO2pico estimado: ${vo2est} ml/kg/min<br>
        - Capacidad Funcional: ${mets} METs<br><br>

        <strong style="color: #38bdf8;">2. Ergoespirometría (CPET) y Zonas</strong><br>
        - VO2pico directo: ${d.cpet.vo2peak} ml/kg/min<br>
        - RER Máx: ${d.cpet.rer} | VE/VCO2: ${d.cpet.ve_vco2}<br>
        - Umbral Aeróbico (VT1): ${z.vt1_vo2} ml/kg/min<br>
        - Umbral Anaeróbico (VT2): ${z.vt2_vo2} ml/kg/min<br>
        - <em>Z1 (Recuperación base): ${z.z1}</em><br>
        - <em>Z2 (Transición Ae/An): ${z.z2}</em><br>
        - <em>Z3 (Alta Intensidad): ${z.z3}</em><br><br>

        <strong style="color: #38bdf8;">3. Composición Corporal (InBody)</strong><br>
        - Talla: ${d.heightM}m | Peso: ${d.weightKg}kg | IMC: ${imc}<br>
        - Perímetro Cintura: ${d.inbody.waistCircumference} cm<br>
        - Grasa Corp.: ${d.inbody.fatMassPercent}% | Visceral: Nivel ${d.inbody.visceralFat}<br>
        - Masa Magra Apendicular: ${d.inbody.alm} kg<br>
        - Índice M. Esquelética (SMI): ${sarco.smi} kg/m²<br>
        - <em>Dx Clínico: <span style="color:var(--danger-color);">${sarco.dx}</span></em><br><br>

        <strong style="color: #38bdf8;">4. Fuerza y Función Muscular</strong><br>
        - Dinamometría (Handgrip): ${d.strength.handgrip} kg <em>(${dyna})</em><br>
        - Submáx. Sup: ${d.strength.chestPressWeight}kg x ${d.strength.chestPressReps} reps<br>
        - 1RM Estimado (Brzycki): ${rm1} kg<br>
        - Fuerza Relativa (1RM/Peso): ${relStr}<br><br>

        <strong style="color: #38bdf8;">5. Perfil Metabólico e Inflamatorio</strong><br>
        - Glucosa basal: ${d.labs.glucose} mg/dL | Insulina basal: ${d.labs.insulin} µU/mL<br>
        - Índice HOMA-IR: ${homa.value} <em>(<span style="color:var(--danger-color);">${homa.dx}</span>)</em><br>
        - PCR ultrasensible (hs-CRP): ${d.labs.hsCrp} mg/L <em>(${crpRisk})</em><br><br>

        <strong style="color: #38bdf8;">6. Contexto Biosicosocial y SDOH</strong><br>
        - Determinantes (Cód. Z): ${p.sdoh}<br>
        - <em>Impacto en CVRS: <span style="color:var(--warning-color);">${p.cvrs}</span></em>
    </div>
    `;
}

// --- ESTADO Y UI ---
let currentPatient = null;
const chatMessagesEl = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatForm = document.getElementById('chat-form');
const chatPatientName = document.getElementById('chat-patient-name');
const phase1Chat = document.getElementById('phase1-chat');
const phase2Report = document.getElementById('phase2-report');
const phase3Periodization = document.getElementById('phase3-periodization');
const badgePhase1 = document.getElementById('badge-phase1');
const badgePhase2 = document.getElementById('badge-phase2');
const badgePhase3 = document.getElementById('badge-phase3');
const btnNextPhase = document.getElementById('btn-next-phase');
const btnBackChat = document.getElementById('btn-back-chat');
const btnBackPhase2 = document.getElementById('btn-back-phase2');
const prescriptionForm = document.getElementById('prescription-form');
const periodizationForm = document.getElementById('periodization-form');
const btnNewPatient = document.getElementById('btn-new-patient');
const successModal = document.getElementById('success-modal');
const btnRestart = document.getElementById('btn-restart');
const fallbacks = [
    "Discúlpeme doctor/a, me perdí un poco. ¿Podría repetirme la pregunta de otra forma?",
    "No estoy seguro de haberle entendido bien. ¿Se refiere a mis síntomas o a los exámenes que me hicieron?",
    "Perdone, mi memoria a veces falla. ¿Qué fue exactamente lo que me preguntó?",
    "No le comprendo del todo. Si quiere le cuento un poco sobre mi enfermedad o le entrego mi hoja de laboratorios."
];
let fallbackCount = 0;

// --- FUNCIONES CORE ---
function initApp() {
    loadRandomPatient();
    chatForm.addEventListener('submit', handleChatSubmit);
    btnNextPhase.addEventListener('click', goToPhase2);
    btnBackChat.addEventListener('click', goToPhase1);
    btnBackPhase2.addEventListener('click', goToPhase2);
    prescriptionForm.addEventListener('submit', handlePrescriptionSubmit);
    periodizationForm.addEventListener('submit', handlePeriodizationSubmit);
    
    document.querySelectorAll('.guide-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            
            if (targetId === 'guide-macro') {
                targetEl.innerHTML = `<strong>💡 Guía Macrociclo para ${currentPatient.name}:</strong><br> ${getPatientGuide('macro')}`;
            } else if (targetId === 'guide-meso') {
                targetEl.innerHTML = `<strong>💡 Guía Mesociclos para ${currentPatient.name}:</strong><br> ${getPatientGuide('meso')}`;
            } else if (targetId === 'guide-micro') {
                targetEl.innerHTML = `<strong>💡 Guía Microciclo para ${currentPatient.name}:</strong><br> ${getPatientGuide('micro')}`;
            }
            
            targetEl.classList.toggle('hidden');
            targetEl.style.display = targetEl.classList.contains('hidden') ? 'none' : 'block';
        });
    });

    btnNewPatient.addEventListener('click', () => {
        chatMessagesEl.innerHTML = '';
        loadRandomPatient();
    });
    btnRestart.addEventListener('click', () => {
        successModal.classList.add('hidden');
        goToPhase1();
        chatMessagesEl.innerHTML = '';
        prescriptionForm.reset();
        loadRandomPatient();
    });
    document.getElementById('btn-download').addEventListener('click', downloadReport);
    
    // Start with empty form
    btnNewPatient.click();
}

function loadRandomPatient() {
    const randomIndex = Math.floor(Math.random() * patientClusters.length);
    currentPatient = patientClusters[randomIndex];
    chatPatientName.textContent = currentPatient.name;
    
    // Cambiar el avatar dinámicamente según edad y género
    const avatarIcon = document.getElementById('patient-avatar-icon');
    if (avatarIcon && currentPatient.clinicalData) {
        const gender = currentPatient.clinicalData.gender;
        const age = currentPatient.clinicalData.age;
        let iconClass = 'fa-solid fa-user';
        if (gender === 'F') {
            // Utilizamos iconos representativos de la edad
            iconClass = age > 60 ? 'fa-solid fa-person-dress' : 'fa-solid fa-user-nurse';
        } else {
            iconClass = age > 60 ? 'fa-solid fa-person-cane' : 'fa-solid fa-user-tie';
        }
        avatarIcon.className = iconClass;
        // Cambiar el color del avatar para darle vida
        avatarIcon.style.color = 'var(--success-color)';
    }
    
    addMessage("Hola, soy el paciente del caso clínico. Estoy en tu consulta, ¿por dónde empezamos a evaluar mi riesgo cardiometabólico?", 'bot');
}

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgDiv.innerHTML = `${text} <span class="message-time">${timeString}</span>`;
    chatMessagesEl.appendChild(msgDiv);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Simulador NLP Multi-Intención Fluido
function getSimulatedResponse(userText) {
    const text = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?.,]/g, ""); 
    
    const intents = {
        greeting: /\b(hola|buenos|buenas|saludos|tardes|dias|noches|que tal)\b/i.test(text),
        smalltalk: /\b(ok|bueno|entendido|perfecto|claro|bien|gracias|comprendo|vale|listo|de acuerdo)\b/i.test(text),
        name: /\b(llama|llamas|nombre|quien eres|identidad)\b/i.test(text),
        age: /\b(edad|anos|nacimiento|fecha de nacimiento|cuantos anos)\b/i.test(text),
        gender: /\b(sexo|genero|hombre|mujer|masculino|femenino)\b/i.test(text),
        vitals: /\b(peso|pesa|kilos|estatura|mide|alto|altura|presion|tension|signos|vitales|cardiaca|frecuencia|saturacion)\b/i.test(text),
        disease: /\b(enfermo|enfermedad|enfermedades|sufre|padece|antecedentes|diagnostico|patologia|historia clinica|diabetico|hipertenso)\b/i.test(text),
        reason: /\b(motivo|siente|ayudar|pasa|consulta|aqui|hoy|ayudo|ocurre)\b/i.test(text),
        pain: /\b(duele|dolor|dolores|molesta|molestia|sintomas|limitacion|miedo|fobia|siente mal)\b/i.test(text),
        family: /\b(familia|vive|solo|sola|casado|hijos|esposa|pareja|acompana|estado civil|quien|red de apoyo|apoyo)\b/i.test(text),
        social: /\b(come|dieta|alimentacion|dinero|paga|trabaja|economia|comida|economica|pension|alimentos|estrato|ingresos|ocupacion|educacion|estudios|verduras|frutas|vivienda|casa|apoyo)\b/i.test(text),
        transport: /\b(transporte|bus|carro|llega|moviliza|viaja|caminar|distancia|caminando|llego|parques|barrio|seguro|bicicleta|escenarios|cerca)\b/i.test(text),
        barriers: /\b(barrera|barreras|social|sociales|determinante|determinantes|codigo|codigos|z)\b/i.test(text),
        edu_stratum: /\b(educacion|estrato|colegio|universidad|nivel socioeconomico|estudios|graduo|escolaridad)\b/i.test(text),
        religion: /\b(religion|dios|iglesia|creencias|fe|culto|espiritual)\b/i.test(text),
        utilities: /\b(servicios|agua|luz|internet|electricidad|gas)\b/i.test(text),
        screens: /\b(pantalla|televisor|tv|redes|facebook|instagram|celular|computador|tiktok|whatsapp)\b/i.test(text),
        parks_safety: /\b(parque|parques|seguridad|peligroso|barrio|robos|ladrones|salir|calle)\b/i.test(text),
        diet_access: /\b(dieta|comida|alimentos|acceso|supermercado|come|frutas|verduras|mercado|hambre)\b/i.test(text),
        preferences: /\b(gusta|preferencia|actividad fisica|deporte favorito|hobbies|pasatiempo|gusta hacer)\b/i.test(text),
        alcohol_intent: /\b(alcohol|licor|cerveza|trago|vino|bebe|toma|borracho)\b/i.test(text),
        smoking_intent: /\b(fuma|fumar|cigarrillo|tabaco|vaper|cuantos fuma)\b/i.test(text),
        ethnicity: /\b(etnia|raza|indigena|afro|afrodescendiente|blanco|mestizo|color de piel|origen|raices)\b/i.test(text),

        exercise: /\b(ejercicio|deporte|actividad fisica|camina|corre|saltar|entrena|gimnasio)\b/i.test(text),
        test_walk: /\b(caminata|seis|6 minutos|pasillo|prueba de marcha)\b/i.test(text),
        test_ergo: /\b(esfuerzo|bicicleta|ergoespirometria|oxigeno|mascarilla|cicloergometro|ergo)\b/i.test(text),
        test_strength: /\b(fuerza|apretar|mano|levantar|silla|dinamometria|musculo|sentarse)\b/i.test(text),
        test_inbody: /\b(inbody|impedancia|composicion|grasa|masa|agua|muscular|visceral)\b/i.test(text),
        test_general: /\b(pruebas|prueba|examenes|examen|resultados|estudios|evaluacion|evaluaciones|laboratorio|laboratorios|funcionales|hoja|informe|informes|reporte)\b/i.test(text),
        water: /\b(agua|piscina|nadar|hidroterapia|acuatico)\b/i.test(text),
        medication: /\b(pastillas|medicinas|medicamentos|drogas|toma|tratamiento|farmacos)\b/i.test(text),
        habits: /\b(fuma|fumar|cigarrillo|cigarrillos|tabaco|alcohol|toma|bebe|habitos|vicios|cuantos|frecuencia|diario)\b/i.test(text)
    };

    let responses = []; 

    if (intents.greeting) responses.push("Buenos días doctor/a.");
    if (intents.smalltalk) responses.push("Entiendo doctor/a. ¿Tiene alguna otra pregunta sobre mis exámenes o mis síntomas?");
    if (intents.reason) responses.push(`Vengo porque me mandaron a evaluar mi riesgo del corazón y a ver qué ejercicio me conviene, pero la verdad es que con mis problemas de salud me es difícil hacer cosas.`);
    if (intents.name) responses.push(`Me llamo ${currentPatient.name}.`);
    if (intents.age) responses.push(`Tengo ${currentPatient.age} años cumplidos.`);
    if (intents.gender) {
        const genero = currentPatient.name.endsWith('a') && !currentPatient.name.includes('Mendoza') ? 'mujer' : 'hombre';
        responses.push(`Soy ${genero}.`);
    }
    if (intents.disease) responses.push(`Respecto a mis antecedentes, me han diagnosticado: ${currentPatient.pathologies}.`);
    if (intents.habits) {
        if (currentPatient.pathologies.includes("Tabaquismo")) {
            responses.push("La verdad es que sí fumo. Me fumo como media cajetilla o más al día. Sé que está mal pero me cuesta dejarlo, es mi desestrés.");
        } else {
            responses.push("No fumo ni tomo alcohol de forma habitual, doctor.");
        }
    }
    if (intents.vitals) responses.push(`Las enfermeras me anotaron esto: ${currentPatient.vitalSigns} Y peso ${currentPatient.clinicalData.weightKg}kg midiendo ${currentPatient.clinicalData.heightM}m.`);
    if (intents.pain) responses.push(`Sobre mis limitaciones físicas le cuento que ${currentPatient.contraindications}`);
    if (intents.medication) responses.push(currentPatient.keywords.medication);

    // Si preguntan por exámenes en general y no por uno específico, calculamos TODO al vuelo.
    if (intents.test_general && !intents.test_walk && !intents.test_ergo && !intents.test_inbody && !intents.test_strength) {
        responses.push(generateClinicalReport(currentPatient));
    } else {
        if (intents.test_walk) responses.push(currentPatient.keywords.test_walk);
        if (intents.test_ergo) responses.push(currentPatient.keywords.test_ergo);
        if (intents.test_inbody) responses.push(currentPatient.keywords.test_inbody);
        if (intents.test_strength) responses.push(`${currentPatient.keywords.test_strength} Mi fuerza de prensión (handgrip) fue de ${currentPatient.clinicalData.strength.handgrip} kg.`);
    }
    
    if (intents.water) responses.push(currentPatient.keywords?.water || "La verdad no sé nadar muy bien y me da un poco de miedo el agua profunda.");
    if (intents.exercise) responses.push(currentPatient.keywords?.exercise || "Trato de moverme, pero mi cuerpo a veces no da para mucho ejercicio fuerte.");
    

    if (intents.edu_stratum) responses.push(`Sobre mis estudios y estrato: ${currentPatient.extendedSdoh.education} Además, ${currentPatient.extendedSdoh.stratum}`);
    if (intents.religion) responses.push(`En cuanto a mis creencias: ${currentPatient.extendedSdoh.religion}`);
    if (intents.utilities) responses.push(`Respecto a mis servicios públicos: ${currentPatient.extendedSdoh.utilities}`);
    if (intents.screens) responses.push(`Si le soy sincero, ${currentPatient.extendedSdoh.tvTime} Y en el celular o redes, ${currentPatient.extendedSdoh.socialMedia}`);
    if (intents.parks_safety) responses.push(`Sobre mi entorno: ${currentPatient.extendedSdoh.parks} En cuanto a la seguridad, ${currentPatient.extendedSdoh.security}`);
    if (intents.preferences) responses.push(`Sobre mis preferencias de actividad: ${currentPatient.extendedSdoh.physicalActivity}`);
    if (intents.diet_access) responses.push(`El tema de la alimentación es así: ${currentPatient.extendedSdoh.diet} La verdad es que ${currentPatient.extendedSdoh.foodAccess}`);
    if (intents.alcohol_intent) responses.push(`Sobre el consumo de alcohol: ${currentPatient.extendedSdoh.alcohol}`);
    if (intents.smoking_intent) responses.push(`Sobre el cigarrillo: ${currentPatient.extendedSdoh.smoking}`);
    if (intents.ethnicity) responses.push(`En cuanto a mi origen étnico: ${currentPatient.extendedSdoh.ethnicity}`);

    if (intents.social || intents.family || intents.transport || intents.barriers) {
        responses.push(`En cuanto a mi red de apoyo y hogar: ${currentPatient.keywords.family} Y sobre mis determinantes sociales en general, le cuento que: ${currentPatient.sdoh}`);
    }


    if (responses.length > 0) return responses.join(" ");

    // Aprendizaje Reflejo (Eliza Style)
    const ignoredWords = ['usted','doctor','doctora','porque','cuando','donde','quien','como','cual','cuales','tiene','tienen','sobre','mucho','poco','este','esta','para','pero'];
    const words = userText.split(" ").filter(w => w.length > 4 && !ignoredWords.includes(w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
    if (words.length > 0) {
        const keyword = words[Math.floor(Math.random() * words.length)].toLowerCase();
        return `Nunca me habían preguntado directamente sobre "${keyword}", pero con mi situación económica y de salud, es un tema complejo. ¿Por qué cree usted que eso afecta mi riesgo cardiovascular, doctor?`;
    }

    let f = fallbacks[fallbackCount % fallbacks.length];

    fallbackCount++;
    return f;
}

function handleChatSubmit(e) {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;

    addMessage(userText, 'user');
    chatInput.value = '';

    const typingMsg = document.createElement('div');
    typingMsg.classList.add('message', 'bot', 'typing');
    typingMsg.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatMessagesEl.appendChild(typingMsg);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

    setTimeout(() => {
        const botResponse = getSimulatedResponse(userText);
        chatMessagesEl.removeChild(typingMsg);
        addMessage(botResponse, 'bot');
    }, 1000 + Math.random() * 1500); 
}

// Transiciones de Fase
function goToPhase2() {
    phase1Chat.classList.add('hidden');
    phase3Periodization.classList.add('hidden');
    phase2Report.classList.remove('hidden');
    badgePhase1.classList.remove('active');
    badgePhase3.classList.remove('active');
    badgePhase2.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPhase1() {
    phase2Report.classList.add('hidden');
    phase3Periodization.classList.add('hidden');
    phase1Chat.classList.remove('hidden');
    badgePhase2.classList.remove('active');
    badgePhase3.classList.remove('active');
    badgePhase1.classList.add('active');
}

function goToPhase3() {
    phase2Report.classList.add('hidden');
    phase3Periodization.classList.remove('hidden');
    badgePhase2.classList.remove('active');
    badgePhase3.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getPatientGuide(type) {
    if (!currentPatient) return "Sin datos.";
    const id = currentPatient.id;
    if (type === 'macro') {
        if (id === 'cluster_4' || id === 'cluster_8') return "Su objetivo primario metabólico debe ser sensibilizar la insulina a largo plazo y reducir tejido adiposo visceral, apuntando a un alto gasto calórico al final del macrociclo.";
        if (id === 'cluster_1' || id === 'cluster_9') return "Debe enfocarse primero en adaptaciones funcionales locales y protección articular/vascular antes de pensar en rendimiento cardiorrespiratorio.";
        return "El macrociclo debe iniciar con un acondicionamiento general (fuerza de base y tolerancia aeróbica) para progresar gradualmente las cargas y disminuir el riesgo cardiometabólico global.";
    }
    if (type === 'meso') {
        if (id === 'cluster_1' || id === 'cluster_6' || id === 'cluster_13') return "Progrese la intensidad y volumen MUY lentamente. Mes 1: 100-150 min. Mes 3: máximo 200 min si tolera el dolor neuro-vascular/articular.";
        return "Aplique la regla de sobrecarga progresiva. Si el Mes 1 es de 150 min, el Mes 3 debería estar cerca de los 250-300 min (o incrementar la intensidad si el tiempo es limitante).";
    }
    if (type === 'micro') {
        if (id === 'cluster_15' || id === 'cluster_2') return "Evite días consecutivos de muy alta demanda. Es preferible frecuencias altas (5-6 días) pero con sesiones cortas de 30 minutos (Snacks de ejercicio).";
        if (id === 'cluster_8') return "Priorice al menos 3 días de entrenamiento de sobrecarga (Fuerza). Es innegociable para el control glucémico y la sensibilidad de los receptores GLUT-4.";
        return "Intercale días aeróbicos con días de fuerza. Al menos 2 días a la semana deben enfocarse en fuerza muscular de grandes grupos. ¡No concentre todo el volumen el fin de semana!";
    }
}

function handlePrescriptionSubmit(e) {
    e.preventDefault();
    // Override alert locally to track errors
    const originalAlert = window.alert;
    const alert = (msg) => {
        originalAlert(msg);
        window.errorLog.push({
            time: new Date().toLocaleTimeString(),
            patient: currentPatient.name,
            error: msg
        });
    };

    
    // Recolectar todos los textos para análisis
    const fields = [
        document.getElementById('medical-clearance').value,
        document.getElementById('fitness-testing').value,
        document.getElementById('fitt-f').value,
        document.getElementById('intensity-zone').value,
        document.getElementById('intensity-borg').value,
        document.getElementById('intensity-hr').value,
        document.getElementById('intensity-metric').value,
        document.getElementById('intensity-justification').value,
        document.getElementById('fitt-t').value,
        document.getElementById('fitt-ty').value,
        document.getElementById('fitt-v').value,
        document.getElementById('session-warmup').value,
        document.getElementById('session-cooldown').value,
        document.getElementById('functional-exercises').value,
        document.getElementById('molecular-just').value,
        document.getElementById('pharma-interactions').value,
        document.getElementById('intra-session-alarms').value,
        document.getElementById('safety-alarms').value,
        document.getElementById('clinical-goals').value,
        document.getElementById('ckm-justification').value
    ];
    
    const textToCheck = fields.join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Filtro de Lenguaje Estigmatizante
    if (textToCheck.includes("obeso") || textToCheck.includes("gordo") || textToCheck.includes("diabetico")) {
        alert("⚠️ ATENCIÓN: El sistema detectó posible lenguaje estigmatizante (ej. usar 'obeso' o 'diabético' como sustantivo/adjetivo). Por favor, corrija usando lenguaje centrado en la persona ('persona con obesidad', 'persona con diabetes') antes de enviar.");
        return;
    }

    // 2. Motor de Retroalimentación Clínica (Feedback Inmediato)
    
    // Carlos Mendoza (Artrosis)
    if (currentPatient.id === "cluster_1") {
        if (/(correr|trotar|saltar|pliometria|sentadillas|sentadilla)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nEl paciente reportó artrosis severa de rodilla con dolor agudo. Ha prescrito ejercicios de impacto (ej. correr, saltar, sentadillas). Modifique la modalidad para evitar daño articular.");
            return;
        }
        if (/(nadar|piscina|hidroterapia|agua)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nEl paciente reportó pánico severo al agua (trauma). La prescripción de medio acuático romperá la adherencia terapéutica de inmediato. Cambie la modalidad.");
            return;
        }
    } 
    // Marta Silva (EPOC/IC)
    else if (currentPatient.id === "cluster_2") {
        if (/(supino|acostado|plancha)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nLa paciente padece Insuficiencia Cardíaca y reportó ortopnea (se asfixia al estar acostada plana). Prescribir ejercicios en decúbito supino es peligroso. Cambie a posición sedente o bipedestación.");
            return;
        }
        if (/(z3|hit|hiit|alta intensidad|vigorosa)/.test(textToCheck) && !textToCheck.includes("intervalo")) {
            alert("⚠️ ALERTA DE SEGURIDAD:\nPara una paciente con EPOC e IC descompensada, la intensidad vigorosa continua está contraindicada en primeras fases. Si usa alta intensidad, asegúrese de especificar que es un modelo interválico muy corto.");
            return;
        }
    }
    // Roberto (Nefropatia / Presion)
    else if (currentPatient.id === "cluster_3") {
        if (/(valsalva|aguantar|vigorosa|z3)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO:\nRiesgo de daño glomerular por picos hipertensivos. Evite maniobras de Valsalva e intensidades vigorosas sostenidas en este paciente con ERC 3a.");
            return;
        }
    }
    // Carmen (Sindrome Metabolico - Volumen)
    else if (currentPatient.id === "cluster_4") {
        if (/(bajo|suave|15 min|20 min|1 dia|2 dias)/.test(textToCheck) && !textToCheck.includes("progresar")) {
            alert("⚠️ ALERTA METABÓLICA:\nEsta paciente requiere un alto gasto calórico para revertir la esteatosis hepática y la obesidad central. La dosis prescrita parece muy baja. Asegúrese de programar una progresión hacia volúmenes altos (>250 min/sem).");
            return;
        }
    }
    // Javier (Betabloqueadores)
    else if (currentPatient.id === "cluster_5") {
        if (/(frecuencia cardiaca|fc|lpm|pulsaciones)/.test(textToCheck) && !/(borg|rpe|percibido)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nEl paciente toma Betabloqueadores (metoprolol) por su HFpEF/FA. La respuesta de la FC está atenuada. NO debe prescribir usando FC como indicador principal, debe usar la escala de esfuerzo percibido (Borg/RPE).");
            return;
        }
    }
    // Rosa (EAP)
    else if (currentPatient.id === "cluster_6") {
        if (/(evitar el dolor|sin dolor|antes de que duela)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nEn la Enfermedad Arterial Periférica, el paciente DEBE caminar hasta alcanzar dolor isquémico moderado (claudicación) para estimular la angiogénesis. Evitar el dolor anula el efecto terapéutico.");
            return;
        }
    }
    // Luis (Post IAM)
    else if (currentPatient.id === "cluster_7") {
        if (/(valsalva|aguantar la respiracion)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nAbsolutamente contraindicada la maniobra de Valsalva en pacientes Post-IAM reciente. Riesgo de arritmia letal.");
            return;
        }
    }
    // Lucia Blanco (SOP)
    else if (currentPatient.id === "cluster_8") {
        if (!/(fuerza|pesas|sobrecarga|hipertrofia)/.test(textToCheck)) {
            alert("⚠️ ALERTA DE PRESCRIPCIÓN:\nEn pacientes con SOP y resistencia a la insulina severa, el entrenamiento de fuerza es indispensable para sensibilizar los receptores GLUT-4 del músculo. ¡Incluya fuerza en la prescripción!");
            return;
        }
    }
    // Samuel (Fistula)
    else if (currentPatient.id === "cluster_9") {
        if (/(fuerza maxima|rm|brazos|superior)/.test(textToCheck) && !/(fistula|cuidado|evitar brazo)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nEl paciente está en hemodiálisis y tiene una fístula arteriovenosa en el brazo izquierdo. Su prescripción de fuerza no menciona la protección de este brazo. Riesgo de ruptura de fístula.");
            return;
        }
    }
    // Diego (Apnea)
    else if (currentPatient.id === "cluster_10") {
        if (/(supino|acostado|boca arriba)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nEl paciente tiene Apnea Obstructiva del Sueño severa y cuello grueso. Prescribir ejercicios en decúbito supino provocará colapso de la vía aérea. Modifique a sedestación o bipedestación.");
            return;
        }
    }
    // Ana (Pie Diabetico)
    else if (currentPatient.id === "cluster_11") {
        if (/(saltar|correr|impacto|trotar)/.test(textToCheck) || !/(calzado|inspeccion|pies)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nPaciente con neuropatía sensitiva severa. El impacto está contraindicado y es OBLIGATORIO mencionar la revisión del calzado/pies en las alarmas de seguridad para evitar úlceras.");
            return;
        }
    }
    // Silvia (Aterosclerosis)
    else if (currentPatient.id === "cluster_12") {
        if (/(alta intensidad|hit|hiit|vigorosa)/.test(textToCheck) && !/(prueba de esfuerzo|ecg|monitoreo)/.test(textToCheck)) {
            alert("⚠️ ALERTA DE SEGURIDAD:\nTiene Hipercolesterolemia Familiar y aterosclerosis prematura confirmada. Prescribir alta intensidad sin exigir una prueba de esfuerzo máxima previa es altísimo riesgo de ruptura de placa e infarto.");
            return;
        }
    }
    // Fernando (ACV)
    else if (currentPatient.id === "cluster_13") {
        if (/(rapido|velocidad|explosivo|balistico)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nPaciente con secuela de ACV y espasticidad. Los movimientos a alta velocidad desencadenan el reflejo miotático y empeoran la espasticidad. Deben ser movimientos lentos y controlados.");
            return;
        }
    }
    // Carmen Suarez (Gestacional)
    else if (currentPatient.id === "cluster_14") {
        if (/(60 min|90 min|2 horas)/.test(textToCheck) && !/(fraccionado|casa)/.test(textToCheck)) {
            alert("⚠️ ALERTA BIOSICOSOCIAL:\nLa paciente reportó no tener tiempo por cuidar a su hijo (SDOH). Prescribir sesiones largas continuas garantizará el fracaso por falta de adherencia. Adapte la dosis a sesiones cortas (snacks de ejercicio) o en casa.");
            return;
        }
    }
    // Pedro (DM1)
    else if (currentPatient.id === "cluster_15") {
        if (!/(glucosa|monitoreo|azucar|carbohidratos|medirse)/.test(textToCheck)) {
            alert("❌ ERROR CLÍNICO GRAVE:\nPaciente con DM1. Es imperativo incluir en las medidas de seguridad el monitoreo de glucosa pre y post ejercicio, y el manejo de carbohidratos para prevenir hipoglucemia nocturna letal.");
            return;
        }
    }

    // Si pasa todas las validaciones de Fase 2
    goToPhase3();
}

function handlePeriodizationSubmit(e) {
    e.preventDefault();
    const vol1 = parseInt(document.getElementById('meso1-vol').value) || 0;
    const vol3 = parseInt(document.getElementById('meso3-vol').value) || 0;
    
    if (vol1 > 0 && vol3 > 0 && vol1 >= vol3) {
        alert("⚠️ RAZONAMIENTO CLÍNICO:\\nNo se evidencia progresión de cargas entre el Mes 1 y el Mes 3. El principio de sobrecarga progresiva no se está cumpliendo. Debe estructurar un incremento en el volumen (min/sem) o en la intensidad.");
        return;
    }
    
    successModal.classList.remove('hidden');
}

// 3. Generación y Descarga del Reporte
function downloadReport() {
    const zcodes = Array.from(document.querySelectorAll('input[name="zcode"]:checked')).map(cb => cb.parentNode.textContent.trim()).join("<br>") || "Ninguno seleccionado";
    const envSocial = Array.from(document.querySelectorAll('input[name="env-social"]:checked')).map(cb => cb.value).join("<br>") || "Ninguno seleccionado";
    const envAmbiental = Array.from(document.querySelectorAll('input[name="env-ambiental"]:checked')).map(cb => cb.value).join("<br>") || "Ninguno seleccionado";
    const exerciseOpts = Array.from(document.querySelectorAll('input[name="exercise-opt"]:checked')).map(cb => cb.value).join(", ") || "Ninguno seleccionado";
    const safetyOpts = Array.from(document.querySelectorAll('input[name="safety-opt"]:checked')).map(cb => cb.value).join("<br>") || "Ninguna precaución seleccionada";
    const estrato = document.getElementById('sdoh-estrato');
    const estratoText = estrato.options[estrato.selectedIndex].text;

    const reportHTML = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte de Prescripción CKM - ${currentPatient.name}</title>
            <style>
                body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; }
                h1 { color: #0f172a; border-bottom: 2px solid #38bdf8; padding-bottom: 10px; }
                h2, h3 { color: #0284c7; margin-top: 30px; }
                .box { border: 1px solid #cbd5e1; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: #f8fafc; }
                .label { font-weight: bold; color: #475569; }
                p { margin: 8px 0; }
            </style>
        </head>
        <body>
            <h1>Reporte Oficial de Prescripción CKM</h1>
            <p><strong>Paciente Evaluado:</strong> ${currentPatient.name} (${currentPatient.age} años)</p>
            <p><strong>Patologías Base:</strong> ${currentPatient.pathologies}</p>
            
            <h2>Resumen de Historia Clínica y Evaluaciones</h2>
            <div class="box">
                <p><span class="label">Limitaciones Físicas y Ortopédicas:</span> ${currentPatient.contraindications}</p>
                <p><span class="label">Signos Vitales y Antropometría:</span> ${currentPatient.vitalSigns} | Peso: ${currentPatient.clinicalData.weightKg} kg | Talla: ${currentPatient.clinicalData.heightM} m</p>
                <p><span class="label">Laboratorios:</span> Glucosa: ${currentPatient.clinicalData.labs.glucose} mg/dL | Insulina: ${currentPatient.clinicalData.labs.insulin} uU/mL | PCR-as: ${currentPatient.clinicalData.labs.hsCrp} mg/L</p>
                <p><span class="label">Capacidad Aeróbica (CPET/TC6M):</span> VO2peak: ${currentPatient.clinicalData.cpet.vo2peak} ml/kg/min | FC Máxima: ${currentPatient.clinicalData.cpet.hrMax} lpm | Distancia Caminata: ${currentPatient.clinicalData.walk6Meters} m</p>
                <p><span class="label">Composición Corporal (InBody):</span> Grasa Corporal: ${currentPatient.clinicalData.inbody.fatMassPercent}% | Grasa Visceral: Nivel ${currentPatient.clinicalData.inbody.visceralFat} | Perímetro Abdominal: ${currentPatient.clinicalData.inbody.waistCircumference} cm</p>
            </div>
            
            <h2>1. Estratificación y Riesgo</h2>
            <div class="box">
                <p><span class="label">Estadio CKM:</span> ${document.getElementById('ckm-stage').options[document.getElementById('ckm-stage').selectedIndex].text}</p>
                <p><span class="label">Justificación Clínica:</span><br> ${document.getElementById('ckm-justification').value}</p>
            </div>

            <h2>1.5. Triaje Clínico y Pruebas Físicas</h2>
            <div class="box">
                <p><span class="label">Triaje (Pre-participación):</span> ${document.getElementById('medical-clearance').value}</p>
                <p><span class="label">Pruebas Físicas a Aplicar:</span><br> ${document.getElementById('fitness-testing').value}</p>
            </div>

            <h2>1.8. Determinantes Sociales de la Salud (SDOH)</h2>
            <div class="box">
                <p><span class="label">Estrato:</span> ${estratoText} | <span class="label">Género:</span> ${document.getElementById('sdoh-genero').value} | <span class="label">Etnia:</span> ${document.getElementById('sdoh-etnia').value}</p>
                <p><span class="label">Nivel Educativo:</span> ${document.getElementById('sdoh-educacion').value}</p>
                <p><span class="label">Ingresos:</span> ${document.getElementById('sdoh-ingresos').value} | <span class="label">Ocupación:</span> ${document.getElementById('sdoh-ocupacion').value}</p>
                <hr style="border:0; border-top:1px solid #e2e8f0; margin:15px 0;">
                <p><span class="label">Entorno Social:</span><br> ${envSocial}</p>
                <p><span class="label">Entorno Ambiental:</span><br> ${envAmbiental}</p>
                <p><span class="label">Códigos Z (Barreras):</span><br> ${zcodes}</p>
                <p><span class="label">Análisis de Barreras y Plan:</span><br> ${document.getElementById('sdoh-notes').value}</p>
            </div>

            <h2>2. Prescripción FITT-VP</h2>
            <div class="box">
                <p><span class="label">Frecuencia:</span> ${document.getElementById('fitt-f').value}</p>
                <p><span class="label">Tipo (Modalidad):</span> ${document.getElementById('fitt-ty').value}</p>
                <p><span class="label">Tiempo:</span> ${document.getElementById('fitt-t').value}</p>
                <p><span class="label">Volumen/Progresión:</span><br> ${document.getElementById('fitt-v').value}</p>
                <hr style="border:0; border-top:1px solid #e2e8f0; margin:15px 0;">
                <p><span class="label">Zona de Entrenamiento:</span> ${document.getElementById('intensity-zone').value}</p>
                <p><span class="label">Escala de Borg (RPE):</span> ${document.getElementById('intensity-borg').value}</p>
                <p><span class="label">Métrica de Intensidad:</span> ${document.getElementById('intensity-metric').value}</p>
                <p><span class="label">FC Máxima Esperada:</span> ${document.getElementById('intensity-hr').value}</p>
                <p><span class="label">Justificación de la Intensidad:</span><br> ${document.getElementById('intensity-justification').value}</p>
            </div>

            <h2>3. Estructura y Ejercicios Funcionales</h2>
            <div class="box">
                <p><span class="label">Calentamiento:</span> ${document.getElementById('session-warmup').value}</p>
                <p><span class="label">Opciones Seleccionadas:</span> ${exerciseOpts}</p>
                <p><span class="label">Detalle de Ejercicios y Sobrecarga:</span><br> ${document.getElementById('functional-exercises').value}</p>
                <p><span class="label">Vuelta a la Calma:</span> ${document.getElementById('session-cooldown').value}</p>
            </div>

            <h2>4. Farmacología, Seguridad y Terapia Molecular</h2>
            <div class="box">
                <p><span class="label">Terapia Molecular:</span><br> ${document.getElementById('molecular-just').value}</p>
                <hr style="border:0; border-top:1px solid #e2e8f0; margin:15px 0;">
                <p><span class="label">Interacciones Fármaco-Ejercicio:</span><br> ${document.getElementById('pharma-interactions').value}</p>
                <p><span class="label">Criterios de Suspensión (Alarma Intra-sesión):</span><br> ${document.getElementById('intra-session-alarms').value}</p>
                <p><span class="label">Precauciones Globales:</span><br> ${safetyOpts}</p>
                <p><span class="label">Otras Contraindicaciones Clínicas:</span><br> ${document.getElementById('safety-alarms').value}</p>
            </div>

            <h2>5. Metas Clínicas a 12 Semanas</h2>
            <div class="box">
                <p><span class="label">Indicadores de Éxito:</span><br> ${document.getElementById('clinical-goals').value}</p>
            </div>
            
            <h2>6. Periodización del Ejercicio (Fase 3)</h2>
            <div class="box">
                <h3>A. Macrociclo</h3>
                <p><span class="label">Objetivo Global:</span><br> ${document.getElementById('macro-goal').value}</p>
                
                <h3 style="margin-top: 15px;">B. Mesociclos</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <tr>
                        <th style="border: 1px solid #cbd5e1; padding: 8px; background: #e0f2fe;">Mesociclo</th>
                        <th style="border: 1px solid #cbd5e1; padding: 8px; background: #e0f2fe;">Volumen (min/sem)</th>
                        <th style="border: 1px solid #cbd5e1; padding: 8px; background: #e0f2fe;">Intensidad</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">1 (Adaptación)</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${document.getElementById('meso1-vol').value}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${document.getElementById('meso1-int').value}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">2 (Sobrecarga)</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${document.getElementById('meso2-vol').value}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${document.getElementById('meso2-int').value}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">3 (Mejora)</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${document.getElementById('meso3-vol').value}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${document.getElementById('meso3-int').value}</td>
                    </tr>
                </table>

                ${(() => {
                    const v1 = parseInt(document.getElementById('meso1-vol').value) || 0;
                    const v2 = parseInt(document.getElementById('meso2-vol').value) || 0;
                    const v3 = parseInt(document.getElementById('meso3-vol').value) || 0;
                    if (v1===0 && v2===0 && v3===0) return '';
                    
                    let maxV = Math.max(v1, v2, v3, 100);
                    const scale = 80 / maxV; // Max height 80px
                    
                    const y1 = 110 - (v1 * scale);
                    const y2 = 110 - (v2 * scale);
                    const y3 = 110 - (v3 * scale);
                    
                    return `
                    <div style="text-align: center; margin: 25px 0;">
                        <h4 style="color: #475569; margin-bottom: 10px;">Curva de Sobrecarga Progresiva (Volumen min/sem)</h4>
                        <svg width="400" height="150" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            <!-- Grid -->
                            <line x1="40" y1="30" x2="380" y2="30" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
                            <line x1="40" y1="70" x2="380" y2="70" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
                            <line x1="40" y1="110" x2="380" y2="110" stroke="#94a3b8" stroke-width="1"/>
                            
                            <!-- Y Labels -->
                            <text x="35" y="34" font-size="10" fill="#64748b" text-anchor="end">${maxV}</text>
                            <text x="35" y="74" font-size="10" fill="#64748b" text-anchor="end">${Math.round(maxV/2)}</text>
                            <text x="35" y="114" font-size="10" fill="#64748b" text-anchor="end">0</text>
                            
                            <!-- X Labels -->
                            <text x="100" y="135" font-size="12" fill="#475569" text-anchor="middle">Mes 1</text>
                            <text x="220" y="135" font-size="12" fill="#475569" text-anchor="middle">Mes 2</text>
                            <text x="340" y="135" font-size="12" fill="#475569" text-anchor="middle">Mes 3</text>
                            
                            <!-- Area -->
                            <polygon points="100,110 100,${y1} 220,${y2} 340,${y3} 340,110" fill="#bae6fd" opacity="0.4"/>
                            <!-- Line -->
                            <polyline points="100,${y1} 220,${y2} 340,${y3}" fill="none" stroke="#0284c7" stroke-width="3"/>
                            <!-- Dots -->
                            <circle cx="100" cy="${y1}" r="4" fill="#0369a1"/>
                            <circle cx="220" cy="${y2}" r="4" fill="#0369a1"/>
                            <circle cx="340" cy="${y3}" r="4" fill="#0369a1"/>
                            <!-- Data Labels -->
                            <text x="100" y="${y1 - 10}" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">${v1}</text>
                            <text x="220" y="${y2 - 10}" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">${v2}</text>
                            <text x="340" y="${y3 - 10}" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">${v3}</text>
                        </svg>
                    </div>`;
                })()}

                <h3>C. Microciclo (Semana Tipo)</h3>
                <ul style="list-style-type: none; padding-left: 0;">
                    <li><span class="label">Lunes:</span> ${document.getElementById('micro-lu').value}</li>
                    <li><span class="label">Martes:</span> ${document.getElementById('micro-ma').value}</li>
                    <li><span class="label">Miércoles:</span> ${document.getElementById('micro-mi').value}</li>
                    <li><span class="label">Jueves:</span> ${document.getElementById('micro-ju').value}</li>
                    <li><span class="label">Viernes:</span> ${document.getElementById('micro-vi').value}</li>
                    <li><span class="label">Sábado:</span> ${document.getElementById('micro-sa').value}</li>
                    <li><span class="label">Domingo:</span> ${document.getElementById('micro-do').value}</li>
                </ul>
            </div>
            
            ${window.errorLog && window.errorLog.length > 0 ? `
            <div class="section">
                <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Registro de Errores Clínicos (Log de Simulación)</h2>
                <p>El simulador registró las siguientes alertas de seguridad durante el diseño de la prescripción. El estudiante debió corregirlas para poder avanzar:</p>
                <ul>
                    ${window.errorLog.map(err => `<li><strong>[${err.time}]</strong>: ${err.error.replace(/\n/g, "<br>")}</li>`).join("")}
                </ul>
            </div>` : ""}

            <p style="text-align: center; color: #94a3b8; margin-top: 40px; font-size: 0.9em;">Generado por SimulAI: Prescripción del Ejercicio - Maestría de Mirary Mantilla-Morrón</p>
        </body>
        </html>
    `;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescripcion_CKM_${currentPatient.name.replace(" ", "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', initApp);
