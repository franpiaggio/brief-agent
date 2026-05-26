# Cuestionario de onboarding

> Guía oficial que el equipo de EasyDocking usa para **conducir la reunión de onboarding** con un nuevo cliente. Define el orden, los bloques temáticos y las preguntas que se hacen "sí o sí" en toda llamada.
>
> Es la **fuente de verdad** sobre la que se construye el brief: cada respuesta del cliente mapea a uno de estos 10 bloques.

---

## 🟦 Contexto

**Objetivo de la reunión:** Relevar cómo opera actualmente el cliente para configurar EasyDocking sobre un modelo estándar. Esta guía se usa para conducir la reunión de onboarding con un nuevo cliente.

Es importante **seguir el orden** del cuestionario y completar cada bloque para entender el proceso actual y cómo adaptarlo a EasyDocking.

Recordar agregar a **Read.AI** a la reunión — estará tomando notas para el armado del documento de onboarding mediante un agente de IA.

### ⚠️ Importante

- Evitar soluciones a medida fuera del estándar.
- Entender el proceso **real** (no el ideal).
- Dejar todo documentado en las notas.

### 📌 Output esperado

- Workflow definido (Carga / Descarga / Retira Cliente / Agro / Otro).
- Configuración base clara para QA.
- Actores y comunicaciones identificadas.
- Configuración de agenda definida (si aplica).
- Sin dudas críticas abiertas.

---

## 🟦 1. Datos generales

🔹 **Contexto:** Entender quién es el cliente, dónde opera y quiénes son los responsables.

❓ **Preguntas guía**

- ¿Es una planta industrial, centro de distribución, almacén u otro tipo de sitio?
- ¿De qué industria es?
- ¿En qué país operan?
- ¿En qué ciudad?
- ¿Quién es el contacto principal del proyecto?
- ¿Quién será el contacto operativo diario?
- ¿Cuál es el objetivo principal de implementar EasyDocking? (más orientado a Turnos, YMS o ambos?)
- ¿Cuál es la fecha objetivo para salir en vivo?

---

## 🟦 2. Clasificación

🔹 **Contexto:** Definir qué procesos va a cubrir EasyDocking.

❓ **Preguntas guía**

- ¿Qué tipos de operaciones se gestionarán? (Descarga / Carga / Retira Cliente / Interplantas / Otro)
- ¿Hoy utilizan turnos o planificación en alguno de los procesos? ¿Lo están gestionando con un Excel?
- ¿Utilizan algún Excel con el detalle de Órdenes/Pedidos o bien para coordinar los turnos y el ingreso de camiones? *(Pedir que nos compartan estos archivos.)*
- ¿Qué módulos se van a implementar? (YMS / Dock Scheduling / Inducción / Control Documental)

---

## 🟦 3. Workflow

🔹 **Contexto:** Seleccionar el workflow del main tenant y validar si requiere ajustes.

❓ **Preguntas guía**

- ¿Cuál es el workflow que aplica para cada operación a implementar?
- ¿Se requieren modificaciones sobre los workflows originales?
- ¿Hay etapas adicionales o faltantes?

---

## 🟦 4. Actores del proceso

🔹 **Contexto:** Identificar los actores que participan en la operación.

❓ **Preguntas guía**

- ¿Quién crea los turnos?
- ¿Quién realiza el check-in del camión?
- ¿Quién asigna el dock?
- ¿Quién completa checklists?
- ¿Quién supervisa la operación?
- ¿Hay usuarios externos? (de Proveedores, Empresas de Transporte, Clientes, otros) ¿Qué tareas realizan?
- ¿Quién valida la documentación? (si aplica)

---

## 🟦 5. Agenda / Docks / Warehouse

🔹 **Contexto:** Definir agenda, simultaneidad y duración de turnos.

❓ **Preguntas guía**

- ¿Cuántos warehouses participan?
- ¿Cuántos docks hay por warehouse? (simultaneidad)
- ¿Qué operaciones/workflows se realizan en cada dock?
- ¿Cuál es la duración del turno?
- ¿Días y horarios habilitados?
- ¿Existen restricciones horarias?

---

## 🟦 6. Módulo Órdenes (opcional)

🔹 **Contexto:** Decidir si el cliente necesita el módulo de Órdenes o alcanza con campos de referencia en el formulario de turno.

### Opción 1 — Sin módulo de Órdenes

Usar cuando:

- el cliente solo necesita pedir algunos datos al crear el turno,
- la referencia de OC/pedido/remito es informativa,
- no hay precarga ni asignación previa.

**Implementación:** campo/s en formulario de turno.

### Opción 2 — Con módulo de Órdenes

Usar cuando:

- el cliente necesita administrar pedidos/OC antes del turno,
- quiere asignarlos a terceros,
- quiere importar/integrar órdenes,
- una cita depende de una orden ya creada,
- necesita detalle o trazabilidad de lo que se va a cargar/descargar.

**Implementación:** ABM / importación / integración de órdenes + vínculo con agenda.

❓ **Preguntas guía**

- ¿La orden tiene que ser solo una referencia para identificar el turno, o tiene que ser una entidad gestionada antes de agendar?
- ¿La orden necesita existir dentro de EasyDocking antes de sacar el turno?
- ¿Se puede operar sin órdenes precargadas en EasyDocking o es necesario?
- ¿Una cita puede incluir una o varias órdenes?
- ¿Utilizan un Excel para gestionar las órdenes que deben ser recibidas/entregadas? *(Pedirlo.)*
- ¿Necesitan asignar la orden a proveedor, carrier o cliente retira antes de agendar?
- ¿Dónde se gestionan actualmente? (XLS, ERP, otro)
- ¿Cómo se cargarán en EasyDocking? (Manual / XLS / Integración)
- ¿Qué campos deben tener las órdenes? ¿Hay que hacer modificaciones sobre los campos de Órdenes del main tenant?
- ¿Hoy el turno se coordina sobre una orden/pedido previamente existente, o se coordina "a demanda" sin precarga?
- ¿Necesitan detalle de mercadería? ¿Solo cabecera o también SKU/cantidades?
- ¿La duración del turno depende de datos de la orden, como pallets, tipo de carga, unidades o SKU?

---

## 🟦 7. Campos y formularios

🔹 **Contexto:** Validar formularios existentes y definir ajustes necesarios. Repasar **cada formulario** y mencionar todos los campos para que valide el cliente.

❓ **Preguntas guía**

Revisar formularios de:

- Planificación / Turnos
- Confirmación de turno
- Check-in
- Checklists
- Asignación de dock / llamado

Para cada formulario:

- ¿Los campos obligatorios y opcionales son correctos según el estado?
- ¿Qué modificaciones hay que hacer?
- ¿Se deben agregar o eliminar campos?

---

## 🟦 8. Mensajes y notificaciones

🔹 **Contexto:** Validar comunicación automática del sistema.

❓ **Preguntas guía**

- ¿Las plantillas de mail aplican o requieren ajustes?
- ¿Las plantillas de WhatsApp aplican o requieren ajustes?
- ¿Falta algún mensaje clave en el proceso?

---

## 🟦 9. Excepciones e integraciones

🔹 **Contexto:** Detectar necesidades fuera del estándar.

❓ **Preguntas guía**

- ¿Hay algo fuera del estándar?
- ¿Se requieren integraciones para operar?
- ¿Se necesita importar información inicial?

---

## 🟦 10. Cierre

🔹 **Contexto:** Consolidar definiciones y próximos pasos.

❓ **Preguntas guía**

- ¿Qué quedó definido en la reunión?
- ¿Qué puntos quedan pendientes?
- ¿Qué debe enviar el cliente?
- ¿Cuál es el próximo paso?
