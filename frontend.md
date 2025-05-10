# 门户系统后端API文档

本文档提供了门户系统后端API的详细信息，供前端开发人员参考。

## 基本信息

- **后端服务URL**: http://localhost:4567
- **认证方式**: Bearer Token (JWT)
- **内容类型**: application/json

## 认证API

### 1. 获取访问令牌

从Casdoor获取授权码后，使用此API获取访问令牌。

- **URL**: `/api/auth/callback`
- **方法**: GET
- **参数**: 
  - `code`: 从Casdoor获取的授权码
- **响应**:
  ```json
  {
    "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlcnQtYnVpbHQtaW4iLCJ0eXAiOiJKV1QifQ...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
  ```
- **错误响应**:
  ```json
  {
    "error": "Authentication failed"
  }
  ```

### 2. 获取当前用户信息

获取当前已认证用户的详细信息。

- **URL**: `/api/auth/user`
- **方法**: GET
- **认证**: Bearer Token
- **响应**:
  ```json
  {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.png",
    "roles": ["user"]
  }
  ```
- **错误响应**:
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```
  或
  ```json
  {
    "error": "Invalid token."
  }
  ```

## 门户API

### 1. 获取所有服务

获取所有可用的服务列表。

- **URL**: `/api/portal/services`
- **方法**: GET
- **认证**: 不需要
- **响应**:
  ```json
  [
    {
      "id": "lobechat",
      "name": "LobeChat",
      "description": "LobeChat AI聊天服务",
      "url": "https://lobe.ethan02.com",
      "icon": "chat-icon"
    },
    {
      "id": "newapi",
      "name": "NewAPI",
      "description": "NewAPI服务",
      "url": "https://api.ethan02.com",
      "icon": "api-icon"
    }
  ]
  ```
- **错误响应**:
  ```json
  {
    "error": "Failed to get services"
  }
  ```

### 2. 添加新服务

添加一个新的服务到门户系统。

- **URL**: `/api/portal/services`
- **方法**: POST
- **认证**: Bearer Token
- **请求体**:
  ```json
  {
    "id": "service-id",
    "name": "Service Name",
    "description": "Service Description",
    "url": "https://service-url.com",
    "icon": "service-icon"
  }
  ```
- **响应**:
  ```json
  {
    "id": "service-id",
    "name": "Service Name",
    "description": "Service Description",
    "url": "https://service-url.com",
    "icon": "service-icon"
  }
  ```
- **错误响应**:
  ```json
  {
    "error": "ID, name, and URL are required"
  }
  ```
  或
  ```json
  {
    "error": "Service with ID service-id already exists"
  }
  ```

### 3. 更新服务

更新现有服务的信息。

- **URL**: `/api/portal/services/:id`
- **方法**: PUT
- **认证**: Bearer Token
- **参数**:
  - `id`: 服务ID (路径参数)
- **请求体**:
  ```json
  {
    "name": "Updated Service Name",
    "description": "Updated Service Description",
    "url": "https://updated-url.com",
    "icon": "updated-icon"
  }
  ```
- **响应**:
  ```json
  {
    "id": "service-id",
    "name": "Updated Service Name",
    "description": "Updated Service Description",
    "url": "https://updated-url.com",
    "icon": "updated-icon"
  }
  ```
- **错误响应**:
  ```json
  {
    "error": "Service with ID service-id not found"
  }
  ```

### 4. 删除服务

从门户系统中删除一个服务。

- **URL**: `/api/portal/services/:id`
- **方法**: DELETE
- **认证**: Bearer Token
- **参数**:
  - `id`: 服务ID (路径参数)
- **响应**:
  ```json
  {
    "id": "service-id",
    "deleted": true
  }
  ```
- **错误响应**:
  ```json
  {
    "error": "Service with ID service-id not found"
  }
  ```

## Casdoor认证流程

### 1. 前端重定向到Casdoor登录页面

```
https://auth.ethan02.com/login/oauth/authorize?client_id=69f866072b876995219e&response_type=code&redirect_uri=http://localhost:4567/api/auth/callback&scope=read&state=some-random-state
```

参数说明:
- `client_id`: Casdoor应用的客户端ID
- `response_type`: 固定为"code"
- `redirect_uri`: 认证成功后的回调URL
- `scope`: 请求的权限范围
- `state`: 随机字符串，用于防止CSRF攻击

### 2. 用户在Casdoor完成登录

用户在Casdoor页面上输入用户名和密码进行登录。

### 3. Casdoor重定向回应用的回调URL

```
http://localhost:4567/api/auth/callback?code=authorization-code&state=some-random-state
```

### 4. 前端获取授权码，然后调用后端API获取访问令牌

```
GET /api/auth/callback?code=authorization-code
```

### 5. 后端返回访问令牌，前端存储令牌并用于后续请求

在后续的API请求中，添加Authorization头:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlcnQtYnVpbHQtaW4iLCJ0eXAiOiJKV1QifQ...
```

## 前端开发注意事项

1. **存储令牌**: 
   - 将访问令牌存储在安全的地方，如localStorage或sessionStorage
   - 考虑加密存储令牌以增加安全性

2. **添加认证头**: 
   - 对需要认证的API请求添加Authorization头
   - 可以创建一个拦截器自动为请求添加认证头

3. **处理令牌过期**: 
   - 当令牌过期时(401响应)，重定向用户到登录页面
   - 可以实现自动刷新令牌的机制

4. **CORS**: 
   - 后端已配置CORS允许所有来源的请求
   - 在生产环境中应限制为特定域名

5. **错误处理**: 
   - 实现全局错误处理，特别是对401和403错误的处理
   - 为用户提供友好的错误提示

6. **路由保护**:
   - 实现路由保护，确保只有已认证的用户才能访问受保护的页面
   - 根据用户角色实现不同级别的访问控制

7. **用户体验**:
   - 实现加载状态指示器
   - 提供清晰的成功/错误反馈
   - 考虑实现"记住我"功能

## 示例代码

### 登录流程示例 (React)

```jsx
// 重定向到Casdoor登录页面
const redirectToCasdoor = () => {
  const state = generateRandomString();
  localStorage.setItem('auth_state', state);
  
  const authUrl = `https://auth.ethan02.com/login/oauth/authorize?client_id=69f866072b876995219e&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:4567/api/auth/callback')}&scope=read&state=${state}`;
  
  window.location.href = authUrl;
};

// 处理回调
const handleCallback = async (code) => {
  try {
    const response = await fetch(`http://localhost:4567/api/auth/callback?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      // 获取用户信息
      await fetchUserInfo();
      // 重定向到首页
      navigate('/');
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // 显示错误消息
    setError('Authentication failed. Please try again.');
  }
};

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:4567/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    const userInfo = await response.json();
    // 存储用户信息
    setUser(userInfo);
    return userInfo;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};
```

### API请求拦截器示例 (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4567',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除本地存储的令牌
      localStorage.removeItem('access_token');
      // 重定向到登录页面
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 联系方式

如有任何问题或需要进一步的帮助，请联系后端开发团队。
