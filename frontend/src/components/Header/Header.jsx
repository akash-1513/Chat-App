import { Link } from "react-router-dom"
export default function Header() {
    return (
        <>
            <div>
                <Link to = "/">Home</Link>
                <Link to = "/about">About</Link>
                <Link to = "/profile">Profile</Link>
            </div>
        </>
    )
}