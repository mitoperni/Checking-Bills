# 🏠 Checking Bills - Gestor de Facturas de Casa

Una aplicación web moderna para gestionar y dividir facturas entre roommates de manera proporcional según los días de permanencia en la casa.

## ✨ Características

- 📊 **Gestión de facturas** - Añade, visualiza y elimina facturas por categorías
- 💰 **División proporcional** - Calcula automáticamente cuánto debe pagar cada persona según sus días de estancia
- 📈 **Resumen visual** - Ve los totales por categoría y el gran total de gastos
- 📋 **Exportación CSV** - Descarga un reporte detallado de todos los cálculos
- 💾 **Persistencia local** - Los datos se guardan automáticamente en el navegador
- 🎨 **Interfaz moderna** - Diseño limpio y fácil de usar

## 🚀 Tecnologías

- **React 18** - Biblioteca para la interfaz de usuario
- **Vite** - Herramienta de build moderna y rápida
- **CSS moderno** - Estilos responsive y limpios
- **LocalStorage** - Persistencia de datos en el cliente

## 🏗️ Estructura del Proyecto

```
src/
├── App.jsx          # Componente principal con toda la lógica
├── config.js        # Configuración de residentes, periodo y tipos de facturas
├── utils.js         # Utilidades para cálculos y exportación CSV
├── App.css          # Estilos de la aplicación
├── index.css        # Estilos globales
└── main.jsx         # Punto de entrada de React
```

## ⚙️ Configuración

Edita el archivo `src/config.js` para personalizar:

### Residentes y Fechas
```javascript
export const RESIDENTS = {
  Miguel: { start: '2025-03-15', end: '2025-08-24' },
  Nico: { start: '2025-03-15', end: '2025-09-06' },
  // ... más residentes
};
```

### Periodo de la Casa
```javascript
export const HOUSE_PERIOD = {
  start: '2025-03-15',
  end: '2025-09-06'
};
```

### Tipos de Facturas
```javascript
export const BILL_TYPES = ['gas', 'electricidad', 'basuras', 'internet'];
```

## 🔧 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación
```bash
# Clona el repositorio
git clone https://github.com/mitoperni/Checking-Bills.git
cd Checking-Bills

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la app para producción
npm run preview      # Vista previa de la build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint para revisar el código
```

## 📖 Cómo Usar la Aplicación

### 1. Configuración Inicial
- Edita `src/config.js` con los datos de tus roommates
- Define el periodo de la casa y los tipos de facturas

### 2. Añadir Facturas
- Haz clic en "**+ Añadir Factura**"
- Selecciona el tipo de factura (gas, electricidad, etc.)
- Introduce el importe y una descripción opcional
- La factura se añadirá automáticamente

### 3. Ver Resultados
- **Resumen**: Ve los totales por categoría
- **Facturas**: Lista de todas las facturas añadidas
- **División**: Cuánto debe pagar cada persona

### 4. Exportar Datos
- Haz clic en "**📊 Descargar CSV**" para obtener un reporte detallado

## 🧮 Cómo Funciona el Cálculo

La aplicación calcula la división de gastos de forma proporcional:

1. **Calcula los días** que cada persona estuvo en la casa
2. **Suma los gastos** por categoría
3. **Distribuye proporcionalmente** según los días de cada persona
4. **Genera el total** que debe pagar cada roommate

### Ejemplo
- Casa alquilada 100 días
- Ana estuvo 50 días (50%)
- Ben estuvo 30 días (30%) 
- Carla estuvo 20 días (20%)

Si la factura de electricidad es €120:
- Ana paga: €60 (50% de €120)
- Ben paga: €36 (30% de €120)
- Carla paga: €24 (20% de €120)

## 📁 Almacenamiento de Datos

Los datos se guardan automáticamente en el **localStorage** del navegador:
- ✅ No se pierde información al cerrar la pestaña
- ✅ Los datos persisten entre sesiones
- ⚠️ Los datos son específicos del navegador y dispositivo

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## 👤 Autor

**Miguel Toperni** - [@mitoperni](https://github.com/mitoperni)

---

¿Necesitas ayuda? [Abre un issue](https://github.com/mitoperni/Checking-Bills/issues) 🚀