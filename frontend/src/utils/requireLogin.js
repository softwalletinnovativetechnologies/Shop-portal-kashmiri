export const requireLogin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Please login first");
    window.location.href = "/login";
    return false;
  }
  return true;
};
