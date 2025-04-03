import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        const url = isLogin ? "http://127.0.0.1:5000/login" : "http://127.0.0.1:5000/register";

        const requestBody = isLogin
            ? { email, password }
            : { first_name: firstName, last_name: lastName, email, password };

        console.log("Sending request to:", url, "with data:", requestBody); // Debugging

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log("Response from server:", data); // Debugging

        if (response.ok) {
            if (isLogin) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else {
                alert("Registration successful! Please login.");
                setIsLogin(true);
            }
        } else {
            alert(data.error || "Something went wrong!");
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleAuth}>
                {!isLogin && (
                    <>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "No account? Register here!" : "Already have an account? Login here!"}
            </p>
        </div>
    );
};

export default Auth;
