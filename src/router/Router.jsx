import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from '../components/Home'

export default function Router() {
    return (
        <div>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                </Routes>
            </BrowserRouter>
        </div >
    )
}
