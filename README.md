# 🔐 Aplicación de Autenticación con 2FA

Sistema de autenticación de dos factores (2FA) usando **Next.js 14** (frontend) y **NestJS** (backend) con Google Authenticator.

## 📋 Requisitos Previos

- Node.js 20 o superior
- MySQL instalado y corriendo
- Google Authenticator en tu móvil ([iOS](https://apps.apple.com/app/google-authenticator/id388497605) | [Android](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2))

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Vania-0731/PC4_DSN.git
cd PC4_DSN
```

### 2. Crear la base de datos

Abre **MySQL Workbench** o tu cliente MySQL y ejecuta:

```sql
CREATE DATABASE authdb;
```

### 3. Configurar variables de entorno

Edita el archivo `backend/.env` con tus credenciales de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password_mysql
DB_NAME=authdb
JWT_SECRET=69a02001dd58f42ea2ca6415ba3427c9
PORT=3000
```

**Importante**: Cambia `DB_PASS` por tu contraseña de MySQL.

### 4. Instalar dependencias y ejecutar

#### Backend (Terminal 1)

```bash
cd backend
npm install
npm run start:dev
```

Espera a ver: `Backend running on port 3000`

#### Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

### 5. Acceder a la aplicación

Abre tu navegador en: **http://localhost:3001**

## 🔐 Flujo de Autenticación

1. **Registro**: Crea una cuenta con email y contraseña
2. **Escanear QR**: Usa Google Authenticator para escanear el código QR
3. **Login**: Ingresa email y contraseña
4. **Verificación 2FA**: Ingresa el código de 6 dígitos de Google Authenticator
5. **Dashboard**: Accede a tu panel protegido

## 🗄️ Conexión a AWS RDS (Producción)

### 1. Configurar Base de Datos
Edita `backend/.env`:

```env
DB_HOST=tu-instancia.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASS=tu_password_rds
DB_NAME=authdb
```

### 2. Configurar CORS para Producción
Edita `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: ['https://tu-dominio.com', 'https://www.tu-dominio.com'],
  credentials: true,
});
```

### 3. Actualizar URL del Frontend
Edita `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
```

## 🐳 Ejecutar con Docker (Opcional)

```bash
docker-compose up --build
```

Esto levantará:
- MySQL en puerto 3306
- Backend en puerto 3000
- Frontend en puerto 3001

## 📡 API Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Registrar usuario y obtener QR | No |
| POST | `/auth/login` | Login con email y password | No |
| POST | `/auth/2fa/verify` | Verificar código 2FA | No |
| GET | `/users/me` | Obtener perfil del usuario | **Sí (JWT)** |

### Ejemplo de Petición con JWT

```bash
# Obtener perfil (ruta protegida)
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

En el frontend, el JWT se envía automáticamente desde `localStorage`:
```typescript
const token = localStorage.getItem('token');
axios.get(`${API_URL}/users/me`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## 🛠️ Tecnologías

- **Backend**: NestJS, TypeORM, MySQL, JWT, bcrypt, otplib
- **Frontend**: Next.js 14, React, TypeScript, Axios
- **2FA**: Google Authenticator (TOTP)

## 📝 Estructura del Proyecto

```
project/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── auth/    # Autenticación y 2FA
│   │   └── user/    # Gestión de usuarios
│   └── .env         # Variables de entorno
├── frontend/        # App Next.js
│   └── app/         # Páginas (register, login, 2fa, dashboard)
└── docker-compose.yml
```

## 🔧 Archivos Importantes

### Conexión con Google Authenticator
**`backend/src/auth/auth.service.ts`**
- **Línea 4**: Importación de `otplib` → `import { authenticator } from 'otplib';`
- **Método `register()`**: Genera el secreto TOTP y el QR
- **Método `verify2FA()`**: Valida el código de 6 dígitos

### Configuración de CORS
**`backend/src/main.ts`** (líneas 8-11)
```typescript
app.enableCors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
});
```
Permite peticiones desde el frontend. Para producción, cambia las URLs por tu dominio.

### Rutas Protegidas con JWT
**`backend/src/user/user.controller.ts`**
```typescript
@UseGuards(JwtAuthGuard)
@Get('me')
async getProfile(@Request() req) {
  // Solo accesible con JWT válido
}
```

**`backend/src/auth/guards/jwt-auth.guard.ts`** - Guard que valida el JWT
**`backend/src/auth/strategies/jwt.strategy.ts`** - Estrategia de validación JWT

## ❌ Solución de Problemas

### Error: "Access denied for user 'root'@'localhost'"
→ Verifica tu contraseña en `backend/.env`

### Error: "Unknown database 'authdb'"
→ Crea la base de datos: `CREATE DATABASE authdb;`

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
→ Inicia MySQL: `net start MySQL80` (Windows)

