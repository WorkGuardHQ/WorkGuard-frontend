// import { useTranslation } from 'react-i18next';

// function UserSearch({ 
//   searchQuery, 
//   handleSearchUsers, 
//   users, 
//   isSearching, 
//   onSelectUser,
//   selectedUsers = [],
//   multiSelect = false,
//   disabled = false
// }) {
//   const { t } = useTranslation();

//   return (
//     <div className="search-box">
//       <div className="position-relative">
//         <input
//           type="text"
//           className="form-control form-control-lg"
//           placeholder={t('searchEmployees')}
//           value={searchQuery}
//           onChange={(e) => handleSearchUsers(e.target.value)}
//           disabled={disabled}
//         />
//         <span className="search-icon">
//           <i className="fas fa-search"></i>
//         </span>
//       </div>

//       {/* Search Results Dropdown */}
//       {users.length > 0 && (
//         <div className="search-results">
//           {users.map(user => {
//             const isSelected = multiSelect && selectedUsers.find(u => u._id === user._id);
            
//             return (
//               <div
//                 key={user._id}
//                 className={`search-result-item ${isSelected ? 'selected' : ''}`}
//                 onClick={() => onSelectUser(user)}
//               >
//                 <div className="d-flex align-items-center justify-content-between">
//                   <div>
//                     <div className="fw-semibold">{user.name}</div>
//                     <div className="text-muted small">{user.email}</div>
//                   </div>
//                   {isSelected && (
//                     <i className="fas fa-check-circle text-primary"></i>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Loading State */}
//       {isSearching && (
//         <div className="text-center py-3 text-muted">
//           <div className="spinner-border spinner-border-sm me-2" role="status">
//             <span className="visually-hidden">{t('loading')}</span>
//           </div>
//           {t('searching')}
//         </div>
//       )}

//       {/* No Results */}
//       {searchQuery.length >= 2 && users.length === 0 && !isSearching && (
//         <div className="text-center py-3 text-muted small">
//           <i className="fas fa-search me-2"></i>
//           {t('noResultsFound')}
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserSearch;



import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function UserSearch({ 
  searchQuery, 
  handleSearchUsers, 
  users, 
  isSearching, 
  onSelectUser,
  selectedUsers = [],
  multiSelect = false,
  disabled = false
}) {
  const { t } = useTranslation();

  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);

  // 🔹 Debounce (من غير ما نغير parent)
  const handleChange = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      handleSearchUsers(value);
    }, 350);
  };

  // 🔹 إظهار/إخفاء dropdown
  useEffect(() => {
    if (searchQuery.length >= 2 && users.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [users, searchQuery]);

  // 🔹 Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 limit results (performance + UX)
  const visibleUsers = useMemo(() => {
    return users.slice(0, 8);
  }, [users]);

  return (
    <div className="search-box" ref={containerRef}>
      
      {/* Input */}
      <div className="position-relative">
        <input
          type="text"
          className="form-control"
          placeholder={t('REMOTE_PERMISSION.searchEmployees')}
          value={searchQuery}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
        />

        <span className="search-icon">
          <i className="fas fa-search"></i>
        </span>
      </div>

      {/* 🔹 Dropdown */}
      {showDropdown && (
        <div className="search-results shadow-sm border rounded mt-1">

          {visibleUsers.map(user => {
            const isSelected =
              multiSelect &&
              selectedUsers.some(u => u._id === user._id);

            return (
              <div
                key={user._id}
                className={`search-result-item px-3 py-2 ${
                  isSelected ? 'bg-light' : ''
                }`}
                onClick={() => {
                  onSelectUser(user);
                  setShowDropdown(false); // UX أفضل
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  
                  <div>
                    <div className="fw-semibold small">
                      {user.name}
                    </div>

                    <div className="text-muted small">
                      {user.email}
                    </div>
                  </div>

                  {isSelected && (
                    <i className="fas fa-check text-primary"></i>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* 🔹 Loading */}
      {isSearching && (
        <div className="text-center py-2 text-muted small">
          <span className="spinner-border spinner-border-sm me-2" />
          {t('searching')}
        </div>
      )}

      {/* 🔹 No results */}
      {searchQuery.length >= 2 && users.length === 0 && !isSearching && (
        <div className="text-center py-2 text-muted small">
          {t('noResultsFound')}
        </div>
      )}
    </div>
  );
}

export default UserSearch;