import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from '../components/Home'
import Sign from '../components/Sign'

export default function Router() {
    const HOST = window.location.host.startsWith("localhost") ? "http://localhost:8282" : "https://neras-sta.com"
    return (
        <div>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Routes>
                    <Route path='/' element={<Home host={HOST} />}></Route>
                    <Route path='/sign' element={<Sign host={HOST} />}></Route>
                </Routes>
            </BrowserRouter>
        </div >
    )
}
