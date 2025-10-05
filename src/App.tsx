import {TanStackProvider} from "@modules/shared/tanstack";
import {Button} from "@/components/ui/button.tsx";

function App() {

    return (
        <TanStackProvider>
            <Button>hello world</Button>
        </TanStackProvider>
    )
}

export default App
