// // ========== client/src/components/Layout/ProfileIcon.jsx ==========
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// const ProfileIcon = () => {
//   const { user } = useAuth();

//   return (
//     <Link to="/profile" className="profile-icon">
//       <div className="avatar">
//         {user?.name?.charAt(0) || 'U'}
//       </div>
//     </Link>
//   );
// };

// export default ProfileIcon;



// ========== client/src/components/Layout/ProfileIcon.jsx ==========
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// const ProfileIcon = () => {
//   const { user } = useAuth();

//   return (
//     <Link to="/profile" className="profile-icon">
//       <div className="avatar">
//         {user?.name?.charAt(0) || 'U'}
//       </div>
//     </Link>
//   );
// };

// export default ProfileIcon;





// ========== client/src/components/Layout/ProfileIcon.jsx (FIXED) ==========
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const ProfileIcon = () => {
  const { user } = useAuth();

  return (
    <Link to="/profile" className="profile-icon-link">
      <div className="profile-icon">
        {user?.userName ? (
          <div className="avatar">
            {user.userName.charAt(0).toUpperCase()}
          </div>
        ) : (
          <FaUserCircle size={40} color="var(--primary-color)" />
        )}
      </div>
    </Link>
  );
};

export default ProfileIcon;







