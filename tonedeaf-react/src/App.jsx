import { Tonedeaf } from '~/features/Tonedeaf';
import './styles/main.less';
import './styles/mobile.less';
import { TonedeafQueryClientProvider } from '~/contexts/TonedeafQueryClientProvider';

const App = () => {
    return (
        <TonedeafQueryClientProvider>
            <Tonedeaf />
        </TonedeafQueryClientProvider>
    );
};

export default App;
