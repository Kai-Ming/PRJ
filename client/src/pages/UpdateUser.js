import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToken } from "../authentication/useToken";
var md5 = require("md5");
    

export default function UpdateUser() {
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useToken();
  const [user, setUser] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/user/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setUser(res.data);
        setNameValue(res.data.name);
      });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    let data = {};
    if (nameValue !== user.name) data.name = nameValue;
    if (passwordValue !== "") data.password = passwordValue;

    if (Object.keys(data).length === 0) {
      navigate("/dashboard");
      return;
    }

    try {
      const response = await axios.patch("/api/user", data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response.status === 200) navigate("/dashboard");
    } catch (err) {
      console.log(err.response.data);
      setErrorMessage(err.response.data.error);
    }
  };

  return (
    <div className="div-inputForm">
      <section className="inputForm">
        <h2 className="inputFormTitle">Edit Profile Details</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <fieldset className="inputFormFields">
          <form>
            <div className="inputFormInputBox">
              <input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder="Name"
                required
              />
              <input
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Enter a new password, otherwise leave blank"
                required
              />
            </div>
            <button className="inputFormButton" onClick={onSubmit}>
              Confirm
            </button>
          </form>
        </fieldset>
      </section>
    </div>
  );
}