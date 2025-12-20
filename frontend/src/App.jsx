import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import { jobsRoutes } from './routes/routes';
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {jobsRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children?.map((child, index) => (
                <Route key={index} index={child.index} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}