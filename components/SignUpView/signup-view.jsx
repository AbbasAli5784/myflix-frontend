import React, { useState } from "react";

export const SignUpView = ({onSignUp}) => {
  const [username, setUsername] =useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday

    }
    fetch("https://morning-badlands-99587.herokuapp.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("User registered:",data)
      onSignUp()
    })
    .catch((error) => console.error("Error during registration:" , error))
  }
  return (
    <form onSubmit={handleSubmit}>
<label>
  Username:
  <input
  type= "text"
  value= {username}
  onChange={(e) => setUsername(e.target.value) } />
</label>
<label>
  Password:
  <input
  type = "password"
  value={password}
  onChange={(e) => setPassword(e.target.value)} />
</label>
<label>
  Email 
  <input
  type ="email"
  value= {email}
  onChange={(e) => setEmail(e.target.value)} />
</label>

<label>
  Birthday
  <input
  type="date"
  value={birthday}
  onChange={(e) => setBirthday(e.target.value)} />
</label>
<button type="submit">Submit</button>
    </form>
  )
}