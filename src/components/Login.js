import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';

const Login = (props) => {
    const URL = " https://i-notebook-backend-3dil.onrender.com/api/authentication";
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.email || !credentials.password) {
            props.showAlert("Please enter email and password", "danger");
            return;
        }

        try {
            const response = await fetch(`${URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const text = await response.text();
            let json;
            try {
                json = JSON.parse(text);
            } catch {
                props.showAlert("Server error", "danger");
                return;
            }

            console.log(json);
            if (json && json.success && json.authtoken) {
                localStorage.setItem("token", json.authtoken);
                navigate("/");
                props.showAlert("Logged in successfully", "success");
            } else {
                props.showAlert("Invalid credentials", "danger");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            props.showAlert("Server not reachable", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit} className=' container card' style={{ width: 300, height: 360 }}>
                <div className="mb-3">
                    <h2 className='text-center my-2'>Login</h2>
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        value={credentials.email}
                        onChange={onChange}
                        id="email"
                        name="email"
                        required
                        aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className="form-text">
                        We'll never share your email with anyone else.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={credentials.password}
                        onChange={onChange}
                        name="password"
                        id="password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                 <p className="text-center mt-3">
                          don't have an account? <Link to="/signup">Signup</Link>
                        </p>
            </form>
        </div>
    );
}

export default Login;