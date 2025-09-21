// import { StrictMode } from 'react'
import { Fragment } from "react";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/effect-fade'
import './assets/scss/Xerxez.scss'
import './assets/scss/custom.scss'
import './assets/scss/rtl.scss'
import './assets/scss/customizer.scss'
 
import './assets/custom/custom.scss'
import './assets/css/radiology-sidebar-enhancement.css'
import './assets/vendor/font-awesome/css/font-awesome.min.css'
import './assets/vendor/remixicon/fonts/remixicon.css'
import './assets/vendor/phosphor-icons/Fonts/regular/style.css'
import './assets/vendor/phosphor-icons/Fonts/duotone/style.css'
import './assets/vendor/phosphor-icons/Fonts/fill/style.css' 

//router
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// page
import { LayoutsRoute } from "./router/layout-router";

// store
import { store } from "./store/index";
import { Provider } from "react-redux";
import { setupInterceptors } from './services/api';

// Auth Context
import AuthProvider from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';

setupInterceptors(store);

const router = createBrowserRouter([...LayoutsRoute], { basename: import.meta.env.BASE_URL });

createRoot(document.getElementById('root')).render(
  <Fragment>
    <Provider store={store}>
      <AuthProvider>
        <PermissionProvider>
          <App>
            <RouterProvider router={router}></RouterProvider>
          </App>
        </PermissionProvider>
      </AuthProvider>
    </Provider>
  </Fragment>
)