# 后端修改说明

为了支持前端应用中的认证流程，我们对后端代码进行了以下修改：

## 1. 修改概述

1. **CORS配置更新**：允许前端域名的跨域请求
2. **认证流程优化**：增强了回调处理功能，添加了更详细的日志记录
3. **新增前端回调API**：专门用于处理前端应用的认证回调
4. **错误处理改进**：提供更详细的错误信息，便于调试

## 2. 详细修改

### 2.1 CORS配置更新

修改了`src/index.js`中的CORS配置，允许前端域名的跨域请求：

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8654"], // 添加您的前端域名
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // 允许发送cookies
  })
);
```

### 2.2 认证流程优化

1. 修改了`src/controllers/authController.js`，增加了内部方法`handleCallbackInternal`，用于处理认证回调：

```javascript
const handleCallbackInternal = async (code) => {
  if (!code) {
    throw new Error('Authorization code is required');
  }
  
  console.log(`Processing authorization code internally: ${code.substring(0, 5)}...`);
  
  // 从Casdoor获取令牌
  const response = await casdoorService.getAuthToken(code);
  
  return { 
    access_token: response.access_token,
    token_type: response.token_type,
    expires_in: response.expires_in
  };
};
```

2. 修改了`src/services/casdoorService.js`，增加了更详细的日志记录：

```javascript
getAuthToken: async (code) => {
  try {
    console.log(`Attempting to get auth token with code: ${code.substring(0, 5)}...`);
    console.log(`Using Casdoor config: endpoint=${casdoorConfig.endpoint}, clientId=${casdoorConfig.clientId}, orgName=${casdoorConfig.orgName}`);
    
    const response = await sdk.getAuthToken(code);
    
    console.log('Successfully obtained auth token');
    return response;
  } catch (error) {
    console.error('Error getting auth token:', error);
    console.error('Error details:', error.response?.data || 'No response data');
    throw error;
  }
}
```

### 2.3 新增前端回调API

1. 创建了新的路由文件`src/routes/frontendCallbackRoutes.js`，专门用于处理前端应用的认证回调：

```javascript
// POST方法处理前端回调
router.post("/process", async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }
    
    console.log(`Processing frontend callback with code: ${code.substring(0, 5)}...`);
    
    // 使用内部方法获取令牌
    const response = await authController.handleCallbackInternal(code);
    
    // 返回令牌给前端
    return res.json(response);
  } catch (error) {
    console.error("Error in frontend callback handler:", error);
    return res.status(500).json({
      error: "Authentication failed",
      message: error.message,
      details: error.response?.data,
    });
  }
});

// GET方法处理前端回调（备用）
router.get("/process", async (req, res) => {
  // 类似的处理逻辑
});
```

2. 在`src/index.js`中注册了新的路由：

```javascript
app.use("/api/frontend-auth", frontendCallbackRoutes);
```

### 2.4 错误处理改进

在所有相关的控制器和服务中，增加了更详细的错误信息，便于调试：

```javascript
return res.status(500).json({
  error: "Authentication failed",
  message: error.message,
  details: error.response?.data,
});
```

## 3. 前端需要做的更改

为了适配后端的修改，前端需要做以下更改：

### 3.1 Casdoor配置

在Casdoor管理界面中，将回调URL设置为前端应用的URL，例如：

或者您的实际前端域名：

```
http://localhost:8654/auth/callback
```

### 3.2 前端认证流程

1. **创建回调处理页面**：

在前端应用中创建一个回调处理页面（例如：`/auth/callback`），用于处理Casdoor的回调：

```jsx
// pages/auth/callback.js 或 app/auth/callback/page.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // 或 'next/navigation'

export default function AuthCallback() {
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 从URL获取授权码
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (!code) {
      setError('未收到授权码');
      return;
    }

    // 将授权码发送到后端API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/frontend-auth/process?code=${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('认证失败');
        }
        return response.json();
      })
      .then(data => {
        // 存储访问令牌
        localStorage.setItem('access_token', data.access_token);
        
        // 重定向到首页或仪表板
        router.push('/dashboard');
      })
      .catch(err => {
        console.error('认证错误:', err);
        setError('认证过程中发生错误，请重试');
      });
  }, [router]);

  if (error) {
    return <div>错误: {error}</div>;
  }

  return <div>正在处理认证，请稍候...</div>;
}
```

2. **修改登录函数**：

修改登录函数，将用户重定向到Casdoor登录页面，并使用前端应用的回调URL：

```jsx
const redirectToCasdoor = () => {
  const state = generateRandomString();
  localStorage.setItem('auth_state', state);
  
  // 使用前端应用的回调URL
  const callbackUrl = `${window.location.origin}/auth/callback`;
  
  const authUrl = `https://auth.ethan02.com/login/oauth/authorize?client_id=69f866072b876995219e&response_type=code&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=read&state=${state}`;
  
  window.location.href = authUrl;
};
```

3. **API请求拦截器**：

确保API请求拦截器正确添加认证头：

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

### 3.3 环境变量

确保前端应用有正确的环境变量：

```
NEXT_PUBLIC_API_URL=http://localhost:4567
NEXT_PUBLIC_CASDOOR_ISSUER=https://auth.ethan02.com
NEXT_PUBLIC_CASDOOR_CLIENT_ID=69f866072b876995219e
```

## 4. 测试认证流程

1. 启动后端服务：`npm run dev`
2. 启动前端应用
3. 点击登录按钮，重定向到Casdoor登录页面
4. 在Casdoor完成登录后，Casdoor将重定向回前端应用的回调URL
5. 前端应用处理回调，获取访问令牌，并重定向到首页或仪表板

## 5. 常见问题排查

1. **CORS错误**：确保后端的CORS配置正确，允许前端域名的请求
2. **回调URL错误**：确保Casdoor中配置的回调URL与前端应用的回调URL一致
3. **令牌获取失败**：检查后端日志，查看详细的错误信息
4. **重定向循环**：确保前端应用正确处理回调，避免重定向循环

如有任何问题，请联系后端开发团队。
