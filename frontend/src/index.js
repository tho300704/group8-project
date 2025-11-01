import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// <<< BƯỚC 1: IMPORT `store` TỪ FILE BẠN ĐÃ TẠO >>>
// `store` chính là kho chứa state toàn cục của ứng dụng.
import { store } from './app/store';

// <<< BƯỚC 2: IMPORT `Provider` TỪ `react-redux` >>>
// `Provider` là component đặc biệt giúp kết nối React với Redux.
import { Provider } from 'react-redux';

// Lấy phần tử gốc trong file HTML của bạn
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render ứng dụng của bạn ra DOM
root.render(
  <React.StrictMode>
    {/* 
      <<< BƯỚC 3: BỌC TOÀN BỘ <App /> TRONG <Provider> >>>
      - Component <Provider> nhận một prop là `store`.
      - Bằng cách này, mọi component con cháu của App (ví dụ: Navigation, Login, Profile...)
        đều có khả năng truy cập vào Redux store thông qua các hook như `useSelector` và `useDispatch`.
    */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();