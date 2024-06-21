import { useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"


const EventsDetectorPage: React.FC = () => {
    const [audio] = useState(new Audio('./beep.mp3'))
    const [playing, setPlaying] = useState<boolean>(false)

    const [subMetering1Used, setSubMetering1Used] = useState<boolean>(false)
    const [subMetering2Used, setSubMetering2Used] = useState<boolean>(false)
    const [subMetering3Used, setSubMetering3Used] = useState<boolean>(false)
    const [numOfWarnings, setNumOfWarnings] = useState<number>(0)
    const [warning, setWarning] = useState<boolean>(false)

    const [connectionOpen, setConnectionOpen] = useState<boolean>(false)
    const [socketUrl, setSocketUrl] = useState('http://localhost:7722/event')
    // const [socketUrl, setSocketUrl] = useState('http://command:7722/event')

    const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 30,
        reconnectInterval: 5000
    }, connectionOpen);

    useEffect(() => {
        if (playing) {
            audio.play().catch(error => {
                console.error("Audio play failed:", error);
            });
        } else {
            audio.pause();
        }
    }, [playing, audio]);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
            const temp: string = lastMessage.data.toString();
            console.log(temp)
            if (temp.includes('ekuiperAnalytics:subMetering1')) {
                const value = temp.replace('ekuiperAnalytics:subMetering1', '')
                if (value === '0') {
                    setSubMetering1Used(false)
                } else {
                    setSubMetering1Used(true)
                }
            } else if (temp.includes('ekuiperAnalytics:subMetering2')) {
                const value = temp.replace('ekuiperAnalytics:subMetering2', '')
                if (value === '0') {
                    setSubMetering2Used(false)
                } else {
                    setSubMetering2Used(true)
                }
            } else if (temp.includes('ekuiperAnalytics:subMetering3')) {
                const value = temp.replace('ekuiperAnalytics:subMetering3', '')
                if (value === '0') {
                    setSubMetering3Used(false)
                } else {
                    setSubMetering3Used(true)
                }
            } else {
                setNumOfWarnings(prevWarnings => prevWarnings + 1)
                setWarning(true)
            }

        }
    }, [lastMessage]);

    useEffect(() => {
        if (warning === true) {
            setPlaying(true)
            setTimeout(() => {
                setPlaying(false)
                setWarning(false)
            }, 1500)
        }
    }, [warning])


    const handleConnect = async () => {
        if (connectionOpen) {
            await setConnectionOpen(false)
        }
        setConnectionOpen(true)
    }


    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: "60%", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", borderRightStyle: "solid", borderRightColor: "black", borderBottomColor: "black", borderBottomStyle: "solid", borderLeftStyle: "solid", borderLeftColor: "black", borderWidth: "2px", width: "50%" }}>
                    <div style={{ margin: "20px",  animation: warning ? 'centerToEdge 0.4s ease-in 0s forwards' : '', height: "90%", borderColor: "black", borderStyle: "solid", borderRadius: "10px" }}>

                    </div>
                    <div style={{ alignSelf: "center", paddingBottom: '5px' }}>{numOfWarnings}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", flexGrow: 1, borderWidth: "2px", borderBottomColor: "black", borderBottomStyle: "solid" }}>

                    <div style={{ margin: "20px", flex: 1, flexGrow: 1, borderRadius: "10px", }}>
                        <div style={{ backgroundColor: subMetering1Used ? 'red' : 'green', height: "85%", borderRadius: "10px" }}>
                        </div>
                        <div style={{ display: "flex", height: "15%", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
                            Kuhinja
                        </div>
                    </div>
                    <div style={{ margin: "20px", flex: 1, flexGrow: 1, borderRadius: "10px", }}>
                        <div style={{ backgroundColor: subMetering2Used ? 'red' : 'green', height: "85%", borderRadius: "10px" }}>
                        </div>
                        <div style={{ display: "flex", height: "15%", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
                            Kupatilo
                        </div>
                    </div>
                    <div style={{ margin: "20px", flex: 1, flexGrow: 1, borderRadius: "10px" }}>
                        <div style={{ backgroundColor: subMetering3Used ? 'red' : 'green', height: "85%", borderRadius: "10px" }}>
                        </div>
                        <div style={{ display: "flex", height: "15%", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
                            Bojler
                        </div>
                    </div>

                </div>
            </div>
            <div style={{ width: "100%", height: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <button style={{ minWidth: "80px", width: "10%", minHeight: "50px", height: "10%" }} onClick={e => {
                    handleConnect()
                }}>
                    Connect
                </button>
            </div>
        </div >
    )
}

export default EventsDetectorPage;