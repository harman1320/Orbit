import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserRepo() {
  const [repos, setRepos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/repo/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setRepos(res.data.repositories);
      } catch (err) {
        console.error("Error while fetching repositories : ", err);
      }
    };

    fetchRepos();
  }, []);

  const handleClick = (id) => {
    navigate(`/repo/${id}`);
  };

  return (
    <div>
      {repos.map((r) => {
        return (
          <div key={r._id}>
            {r.name}
            <button onClick={() => handleClick(r._id)}>See</button>
          </div>
        );
      })}
    </div>
  );
}
