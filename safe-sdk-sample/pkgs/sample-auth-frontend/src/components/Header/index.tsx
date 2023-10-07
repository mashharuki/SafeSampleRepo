/**
 * Header component
 */
const Header = (props: any) => {

  const {
    login,
    logout,
    isLoggedIn
  } = props;

  return(
    <header className="bg-black text-white p-4 flex justify-between">
      <div className="text-xl flex items-center">
        Sample Safe Core SDK & Auth Kit Dapp
      </div>
      { isLoggedIn ? (
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={logout}
        >
          Logout
        </button>
      ) : (
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={login}
        >
          Login
        </button>
      )}
      
    </header>
  );
};

export default Header;