
import { useTranslation } from 'react-i18next';
import logo from '../assets/loginlogo.png';
function NotFound() {
    const { t } = useTranslation();


  return (
    <div className="container mt-4 text-center">
  <img src={logo} alt="WorkGuard HR" className="  mb-3 logo" style={{ width: '20rem', height: '8rem', paddingTop:'30px'}} />
    <h2>{t("common.notfoundPageH")}</h2>
          <p>{t("common.notfoundpageP")}</p>

  
  
  </div>
    


  );
}

export default NotFound;