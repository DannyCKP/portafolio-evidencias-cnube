(function () {
  "use strict";

  // Cada vez que termines una actividad nueva del curso, agrega un objeto
  // más a este arreglo (copia uno existente como plantilla). El sitio se
  // actualiza solo, no hay que tocar el HTML.
  //
  // draft: true  -> la reflexión es un borrador sugerido, revísala y
  //                  cámbiala por tus propias palabras antes de entregar.
  // draft: false -> ya la revisaste y es definitiva.

  window.__EVIDENCIAS__ = [
    {
      id: "1.4",
      titulo: "Elige la nube adecuada",
      fecha: "09/2026",
      tipo: "Actividad práctica",
      objetivo: "Distinguir los tres modelos de servicio en la nube (IaaS, PaaS y SaaS) aplicándolos a cinco escenarios de negocio distintos.",
      descripcion: "Se analizaron cinco casos de empresas con necesidades diferentes (una startup sin programadores, una empresa que no quiere administrar servidores, un banco que necesita control total del sistema operativo, una universidad con correo y documentos colaborativos, y una empresa que combina varios modelos). Para cada caso se eligió el modelo de servicio más adecuado (IaaS, PaaS o SaaS) y se describió qué administra el proveedor, qué administra el cliente, y las ventajas y desventajas de esa elección.",
      resultados: [
        "Caso A (tienda en línea sin programadores) → SaaS.",
        "Caso B (aplicación propia, sin administrar servidores) → PaaS.",
        "Caso C (banco, control total del sistema operativo) → IaaS.",
        "Caso D (universidad, correo y documentos colaborativos) → SaaS.",
        "Caso E (servidores personalizados + desarrollo + ofimática) → combinación de IaaS, PaaS y SaaS."
      ],
      reflexion: "Esta actividad me ayudó a dejar de ver IaaS, PaaS y SaaS como conceptos abstractos y entenderlos como una decisión de negocio: cuánto control necesito frente a cuánto quiero que el proveedor administre por mí. Resolver los cinco casos me hizo notar que casi nunca hay una única respuesta correcta — el modelo adecuado depende del expertise técnico del equipo, del nivel de personalización que necesita el negocio y de qué tanto riesgo está dispuesto a asumir con la infraestructura.",
      draft: true,
      anexo: { archivo: "anexos/A1.4-JDOR.pdf", etiqueta: "Ver actividad completa (PDF)" }
    },
    {
      id: "1.5",
      titulo: "Modelos de implementación de los servicios de cómputo en la nube",
      fecha: "09/2026",
      tipo: "Investigación",
      objetivo: "Conocer las diferentes modalidades de implementación de los servicios del cómputo en la nube (pública, privada, comunitaria e híbrida) de acuerdo al tipo de negocio que las implementa.",
      descripcion: "Se investigaron ocho empresas reales y se identificó qué modelo de nube utiliza cada una y por qué: Netflix y Sony Group (pública, para escalar según demanda de millones de usuarios o proyectos de IA), Bloomberg y GE Healthcare (privada, por sensibilidad de la información y control centralizado), Bank of America y BMW (comunitaria, por compartir regulación y estándares con su misma industria), y Crediclub y Walmart (híbrida, para combinar infraestructura propia con la nube pública).",
      resultados: [
        "Pública: Netflix (streaming, escalamiento con AWS) y Sony Group (IA y modernización tecnológica).",
        "Privada: Bloomberg (información financiera sensible) y GE Healthcare (migración centralizada de aplicaciones).",
        "Comunitaria: Bank of America (nube del sector financiero, regulación compartida) y BMW (Catena-X, colaboración entre automotrices).",
        "Híbrida: Crediclub (sistemas locales + Microsoft Azure) y Walmart (infraestructura propia + nube pública)."
      ],
      reflexion: "Investigar casos reales en lugar de definiciones de libro me dejó más claro que la elección del modelo de nube casi siempre responde a una razón de negocio muy concreta — regulación, escala, colaboración entre competidores o necesidad de control — y no a una preferencia técnica aislada. Ver el mismo patrón repetirse en industrias distintas (bancos usando privada o comunitaria por seguridad, empresas de entretenimiento usando pública por escala) ayudó a fijar el concepto mucho mejor que memorizar las cuatro definiciones.",
      draft: true,
      anexo: { archivo: "anexos/A1.5-JDOR.pdf", etiqueta: "Ver actividad completa (PDF)" }
    },
    {
      id: "2.3",
      titulo: "Explorar la plataforma de cómputo en la nube Microsoft Azure",
      fecha: "09/2026",
      tipo: "Investigación + práctica en plataforma",
      objetivo: "Explorar la plataforma Microsoft Azure mediante la identificación de sus principales servicios, para comprender su modelo de funcionamiento, costos y ventajas para las organizaciones.",
      descripcion: "Investigación guiada en 8 partes sobre Microsoft Azure: qué es y quién lo desarrolló, su posición en el mercado (2° lugar global en IaaS/PaaS, detrás de AWS), cómo implementa IaaS/PaaS/SaaS, su organización global en geografías → regiones → zonas de disponibilidad → puntos de presencia, tipos de cuenta (Free, Student, Enterprise), y exploración práctica del portal (portal.azure.com): dashboard, grupos de recursos, máquinas virtuales, cuentas de almacenamiento, redes virtuales, App Services, Azure SQL y Microsoft Defender for Cloud. También se investigaron costos reales (máquina virtual básica, storage, base de datos SQL) usando la calculadora de precios oficial, y mecanismos de seguridad (Microsoft Entra ID, NSG, cifrado, Azure Backup).",
      resultados: [
        "Cuenta de estudiante creada/explorada: 100 USD en créditos, 55+ servicios gratuitos, sin tarjeta de crédito.",
        "Capturas del dashboard de Azure, del panel de creación de recursos y de la calculadora de precios (incluidas en el PDF anexo).",
        "Costo estimado de una VM básica (D2 v3, 2 vCPU / 8 GB RAM): ≈ $70 USD/mes en pago por uso.",
        "Costo estimado de 1 TB de almacenamiento en capa caliente: ≈ $20 USD/mes.",
        "Al menos 5 ventajas documentadas (escalabilidad, disponibilidad global, reducción de CapEx a OpEx, integración con productos Microsoft, seguridad Zero Trust) y 4 riesgos (dependencia del proveedor, costos mal administrados, dependencia de internet, complejidad de configuración)."
      ],
      reflexion: "Lo que más se me quedó de esta actividad fue la calculadora de precios: leer sobre pago-por-uso es una cosa, pero ver que una sola máquina virtual con licencias puede pasar de $70 a más de $1,000 USD al mes según cómo la configures hace mucho más real el riesgo de \"costos mal administrados\" que menciono en las desventajas. También me sirvió para entender la jerarquía geografía → región → zona de disponibilidad, que antes de esta actividad no tenía clara.",
      draft: true,
      anexo: { archivo: "anexos/2.3-Azure-JDOR.pdf", etiqueta: "Ver reporte completo con capturas de pantalla (PDF)" }
    }
  ];
})();
