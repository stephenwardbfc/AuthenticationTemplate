import useAuthStore from "../store/useAuthStore"
export default function HomePage() {
  const { logout } = useAuthStore();
  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
      // Optionally redirect or show success message
    } catch (error: any) {
      console.error("Logout failed:", error);
      // Handle error (e.g., show a notification)
    }
  }
  return (
    <div>
      Home Page
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>


    </div>
  )
}
