# BACKEND MULT

## **MAIN URL**

<aside>
💡

backendmult-production.up.railway.app

</aside>

---

## ENDPOINTS API - USERS

### 1. Obtener todos los usuarios

**GET** `/api/users`

- **Descripción:** Retorna la lista de usuarios registrados.
- **Respuesta:**
    
    ```json
    [
      {
        "user_id": 1,
        "full_name": "Juan Pérez",
        "user": "juanp",
        "level_training": "Básico",
        "role_id": 2,
        "working_day_id": 1
      }
    ]
    ```
    
- **Códigos de estado:**
    - `200 OK` - Lista obtenida correctamente.
    - `500 Internal Server Error` - Error en el servidor.
    

---

### 2. Obtener un usuario por ID

**GET** `/api/users/:id`

- **Descripción:** Retorna la información de un usuario específico.
- **Parámetros:**
    - `id` (number) - ID del usuario.
- **Códigos de estado:**
    - `200 OK` - Usuario encontrado.
    - `404 Not Found` - Usuario no encontrado.
    - `500 Internal Server Error` - Error en el servidor.
    

---

### 3. Obtener usuarios por rol

**GET** `/api/users/role/:role_id`

- **Descripción:** Retorna la lista de usuarios con un rol específico.
- **Parámetros:**
    - `role_id` (number) - ID del rol.
- **Códigos de estado:**
    - `200 OK` - Usuarios obtenidos correctamente.
    - `404 Not Found` - No hay usuarios con ese rol.
    - `500 Internal Server Error` - Error en el servidor.
    

---

### 4. Crear un usuario

**POST** `/api/users`

- **Descripción:** Crea un nuevo usuario en el sistema.
- **Body:**
    
    ```json
    {
      "full_name": "Juan Pérez",
      "user": "juanp",
      "password": "password123",
      "level_training": "Básico",
      "role_id": 2,
      "working_day_id": 1
    }
    ```
    
- **Códigos de estado:**
    - `201 Created` - Usuario creado correctamente.
    - `400 Bad Request` - Datos inválidos en la solicitud.
    - `500 Internal Server Error` - Error en el servidor.
- **NOTAS:**
    - TODOS TIENEN QUE ESTAR EN EL BODY. Con null por lo menos

---

### 5. Actualizar un usuario

**PUT** `/api/users/:id`

- **Descripción:** Modifica la información de un usuario.
- **Parámetros:**
    - `id` (number) - ID del usuario.
- **Body:** *(Igual al de creación de usuario)*
- **Códigos de estado:**
    - `200 OK` - Usuario actualizado.
    - `400 Bad Request` - Datos inválidos.
    - `500 Internal Server Error` - Error en el servidor.
    

---

### 6. Eliminar un usuario

**DELETE** `/api/users/:id`

- **Descripción:** Elimina un usuario del sistema.
- **Parámetros:**
    - `id` (number) - ID del usuario.
- **Códigos de estado:**
    - `200 OK` - Usuario eliminado.
    - `404 Not Found` - Usuario no encontrado.
    - `500 Internal Server Error` - Error en el servidor.
    

---

### 7. Iniciar sesión

**POST** `/api/users/login`

- **Descripción:** Verifica las credenciales del usuario y devuelve si tiene una sesión activa.
- **Body:**
    
    ```json
    {
      "user": "juanp",
      "password": "password123"
    }
    ```
    
- **Respuesta:**
    
    ```json
    {
    	"active_session": true,
    	"msg": "You have an active session",
    	"data": {
            "refresh_token_id": 4,
            "user_id": 8,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc0MTA2Njc5OSwiZXhwIjoxNzQxNjcxNTk5fQ.8h4jc7BYhSG8yVeZ1uPj_O2guUP4mh-SQjS4Dfuk-5Y",
            "created_at": "2025-03-04T00:00:00.000Z"
        }
    }
    ```
    
- **Códigos de estado:**
    - `200 OK` - Credenciales correctas, token generado.
    - `401 Unauthorized` - Credenciales incorrectas.
    - `500 Internal Server Error` - Error en el servidor.
    

---

### 8. Refrescar token de acceso

**POST** `/api/users/refresh`

- **Descripción:** Genera un nuevo token de acceso a partir de un token de actualización.
- **Headers:**
    
    ```json
    {
      "Authorization": "Bearer {token}",
      "Content-Type": "application/json"
    }
    ```
    
- **Respuesta:**
    
    ```json
    {
    	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc0MTA2Njc5OSwiZXhwIjoxNzQxNjcxNTk5fQ.8h4jc7BYhSG8yVeZ1uPj_O2guUP4mh-SQjS4Dfuk-5Y",
    }
    ```
    

- **Códigos de estado:**
    - `200 OK` - Nuevo token generado.
    - `403 Forbidden` - Token inválido o expirado.

---

### 9. Generar tokens

**POST** `/api/users/createTokens`

- **Descripción:** Genera tokens para un usuario específico. Se envía desde el headers el token de la sesión abierta, si la tiene, para cerrarla.
- **Headers:**
    
    ```json
    {
      "Authorization": "Bearer {token}",
      "Content-Type": "application/json"
    }
    ```
    
- **Body:**
    
    ```json
    {
      "user_id": 1
    }
    ```
    
- **Respuesta:**
    
    ```json
    {
    	"msg":"Sign in successfully",
    	"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc0MTA2NjE2OCwiZXhwIjoxNzQxMDY5NzY4fQ.KVr31J8CKLptDufjkk-OfTHh28j2j1tc6_CC_SdEtGk",
    	"refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc0MTA2NjE2OCwiZXhwIjoxNzQxNjcwOTY4fQ.1q84wQm1RoY2WTmZkRk14HE6dcALQPHQv0SXZSH4BYw"
    }
    ```
    
- **Códigos de estado:**
    - `200 OK` - Tokens generados correctamente.
    - `403 Forbidden` - Token inválido.

---

### Notas

- Todas las respuestas del servidor están en formato JSON.
- Asegúrate de incluir los headers requeridos en las rutas que los necesiten.
- Los códigos de estado proporcionan información sobre el resultado de la solicitud.