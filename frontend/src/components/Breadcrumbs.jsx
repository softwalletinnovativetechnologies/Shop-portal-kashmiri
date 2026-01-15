import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>

      {paths.map((path, index) => {
        const routeTo = "/" + paths.slice(0, index + 1).join("/");
        const isLast = index === paths.length - 1;

        return (
          <span key={index}>
            <span className="separator">›</span>
            {isLast ? (
              <span className="active">{decodeURIComponent(path)}</span>
            ) : (
              <Link to={routeTo}>{decodeURIComponent(path)}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
