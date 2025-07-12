import HomePage from './pages/HomePage'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import ChangePassword from './components/auth/ChangePassword'
import GoogleLoginPage from './components/auth/GoogleLoginPage'
import GoogleSuccessPage from './components/auth/GoogleSuccessPage'
import ProtectedPage from './pages/ProtectedPage'
import PrivateRoute from './components/routing/PrivateRoute'
import ViaggiPage from './pages/ViaggiPage'
import DettaglioViaggioPage from './pages/DettaglioViaggioPage'
import RichiestaPage from './pages/RichiestaPage'
import ChatPage from './pages/ChatPage'
import AdminViaggiPage from './pages/admin/AdminViaggiPage'
import AdminRichiestePage from './pages/admin/AdminRichiestePage'
import ConfermaEmailPage from './pages/ConfermaEmailPage';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
  { path: '/change-password', component: ChangePassword },
  { path: '/google-login', component: GoogleLoginPage },
  { path: '/oauth-success', component: GoogleSuccessPage },
  { path: '/protected', component: () => <PrivateRoute><ProtectedPage /></PrivateRoute> },
  { path: '/viaggi', component: ViaggiPage },
  { path: '/viaggi/:id', component: DettaglioViaggioPage },
  { path: '/richiesta', component: () => <PrivateRoute><RichiestaPage /></PrivateRoute> },
  { path: '/chat/:richiestaId', component: () => <PrivateRoute><ChatPage /></PrivateRoute> },
  { path: '/admin/viaggi', component: () => <PrivateRoute roles={['ADMIN']}><AdminViaggiPage /></PrivateRoute> },
  { path: '/confirm', component: ConfermaEmailPage },
  { path: '/admin/richieste', component: () => <PrivateRoute roles={['ADMIN']}><AdminRichiestePage /></PrivateRoute> }
]

export default routes;