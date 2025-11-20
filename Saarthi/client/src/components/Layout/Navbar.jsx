// // ========== client/src/components/Layout/Navbar.jsx ==========
// import { Link } from 'react-router-dom';
// import { useTranslation } from '../../hooks/useTranslation';
// import { useAuth } from '../../contexts/AuthContext';
// import LanguageToggle from './LanguageToggle';
// import ProfileIcon from './ProfileIcon';

// const Navbar = () => {
//   const { t } = useTranslation();
//   const { logout } = useAuth();

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <Link to="/dashboard" className="logo">
//           {t('common.appName')}
//         </Link>

//         <div className="navbar-links">
//           <Link to="/dashboard">{t('navigation.home')}</Link>
//           <Link to="/history">{t('navigation.history')}</Link>
//           <Link to="/faq">{t('navigation.faq')}</Link>
//         </div>

//         <div className="navbar-actions">
//           <LanguageToggle />
//           <ProfileIcon />
//           <button onClick={logout} className="btn-logout">
//             {t('auth.logout')}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };


// export default Navbar;





// ========== client/src/components/Layout/Navbar.jsx ==========
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import ProfileIcon from './ProfileIcon';

const Navbar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="logo">
          {t('common.appName')}
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard">{t('navigation.home')}</Link>
          <Link to="/history">{t('navigation.history')}</Link>
          <Link to="/reminders">Reminders</Link>
          <Link to="/faq">{t('navigation.faq')}</Link>
        </div>

        <div className="navbar-actions">
          <LanguageToggle />
          <ProfileIcon />
          <button onClick={logout} className="btn-logout">
            {t('auth.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
