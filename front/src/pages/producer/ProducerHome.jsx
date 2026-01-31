
import { useEffect, useState } from "react";
import { updateCurrentUser } from "../../api/users";
import instance from "../../api/config";

export default function ProducerHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    instance.get("/users/me")
      .then(res => {
        setUser(res.data);
        setForm(res.data);
        setLoading(false);
      })
      .catch(e => {
        setError("Error retrieving user data");
        setLoading(false);
      });
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  function handleEditChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSuccess(null);
    try {
      const toSend = { ...form };
      delete toSend.email;
      delete toSend.role;
      const res = await updateCurrentUser(toSend);
      setUser(res.data);
      setEditMode(false);
      setSuccess("Profile updated successfully.");
      if (res.data.first_name) localStorage.setItem("username", res.data.first_name);
    } catch (err) {
      setError("Error updating profile");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome Producer {user.first_name} {user.last_name}</h1>
      <h2 className="text-xl mb-2">Your personal information</h2>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {editMode ? (
        <form onSubmit={handleSave} className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          <label>First name<input name="first_name" value={form.first_name || ""} onChange={handleEditChange} required /></label>
          <label>Last name<input name="last_name" value={form.last_name || ""} onChange={handleEditChange} required /></label>
          <label>Phone<input name="phone" value={form.phone || ""} onChange={handleEditChange} /></label>
          <label>Mobile<input name="mobile" value={form.mobile || ""} onChange={handleEditChange} /></label>
          <label>Birth date<input name="birth_date" type="date" value={form.birth_date ? form.birth_date.substring(0,10) : ""} onChange={handleEditChange} /></label>
          <label>Street<input name="street" value={form.street || ""} onChange={handleEditChange} /></label>
          <label>Postal code<input name="postal_code" value={form.postal_code || ""} onChange={handleEditChange} /></label>
          <label>City<input name="city" value={form.city || ""} onChange={handleEditChange} /></label>
          <label>Country<input name="country" value={form.country || ""} onChange={handleEditChange} /></label>
          <label>Biography<textarea name="biography" value={form.biography || ""} onChange={handleEditChange} /></label>
          <label>Job
            <select name="job" value={form.job || ""} onChange={handleEditChange}>
              <option value="">-</option>
              <option value="PRODUCER">Producer</option>
              <option value="ACTOR">Actor</option>
              <option value="DIRECTOR">Director</option>
              <option value="WRITER">Writer</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label>Portfolio<input name="portfolio" value={form.portfolio || ""} onChange={handleEditChange} /></label>
          <label>YouTube<input name="youtube" value={form.youtube || ""} onChange={handleEditChange} /></label>
          <label>Instagram<input name="instagram" value={form.instagram || ""} onChange={handleEditChange} /></label>
          <label>LinkedIn<input name="linkedin" value={form.linkedin || ""} onChange={handleEditChange} /></label>
          <label>Facebook<input name="facebook" value={form.facebook || ""} onChange={handleEditChange} /></label>
          <label>TikTok<input name="tiktok" value={form.tiktok || ""} onChange={handleEditChange} /></label>
          <label>Known by MarsAI
            <select name="known_by_mars_ai" value={form.known_by_mars_ai || ""} onChange={handleEditChange}>
              <option value="">-</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </label>
          <label>Password (change only if needed)<input name="password" type="password" value={form.password || ""} onChange={handleEditChange} autoComplete="new-password" /></label>
          <div className="col-span-2 flex gap-2 mt-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Save</button>
            <button type="button" className="bg-gray-300 px-4 py-1 rounded" onClick={() => { setEditMode(false); setForm(user); setSuccess(null); }}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <ul className="mb-4">
            <li><b>Email:</b> {user.email}</li>
            <li><b>Phone:</b> {user.phone || "-"}</li>
            <li><b>Mobile:</b> {user.mobile || "-"}</li>
            <li><b>Birth date:</b> {user.birth_date ? user.birth_date.substring(0,10) : "-"}</li>
            <li><b>Address:</b> {user.street || "-"}, {user.postal_code || "-"} {user.city || "-"}, {user.country || "-"}</li>
            <li><b>Biography:</b> {user.biography || "-"}</li>
            <li><b>Job:</b> {user.job || "-"}</li>
            <li><b>Portfolio:</b> {user.portfolio || "-"}</li>
            <li><b>YouTube:</b> {user.youtube || "-"}</li>
            <li><b>Instagram:</b> {user.instagram || "-"}</li>
            <li><b>LinkedIn:</b> {user.linkedin || "-"}</li>
            <li><b>Facebook:</b> {user.facebook || "-"}</li>
            <li><b>TikTok:</b> {user.tiktok || "-"}</li>
            <li><b>Known by MarsAI:</b> {user.known_by_mars_ai || "-"}</li>
          </ul>
          <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={() => setEditMode(true)}>Edit profile</button>
        </>
      )}
    </div>
  );
}
