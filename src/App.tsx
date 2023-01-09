import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen/HomeScreen";

function App () {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomeScreen/>
        }
    ]);

    return (
        <RouterProvider router={router}/>
    )
}


export default App
