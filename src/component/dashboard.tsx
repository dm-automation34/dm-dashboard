import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Progress } from "antd";

// const messageSocket = io("http://localhost:3003");

// const messageSocket = io("wss://scada.alveskablo.com/socket.io", {
//   transports: ["websocket"], // Enforce WebSocket transport
// });

const ProgressBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 1vh 0;
  background-color: white;
  z-index: 1;
`;

const kayan = keyframes`
  0% {
    transform: translateX(100vw);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const flash = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

const KayanYaziContainer = styled.div<{ textHeight: number }>`
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 1vh 0;
  border-top: 0.5vh solid black;
  background-color: lightblue;
  z-index: 1;
  border-left: 0.5vh solid;
  border-bottom: 0.5vh solid;
  border-right: 0.5vh solid;
`;

const KayanYaziText = styled.p<{ duration: number }>`
  display: inline-block;
  animation: ${kayan} ${({ duration }) => duration}s linear infinite;
  font-size: calc(1.2rem + 1vw);
  font-weight: bold;
  color: black;
  margin: 0;
  z-index: 1;
`;

const FixedText = styled.div`
  font-size: calc(1.2rem + 1vw);
  font-weight: bold;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5vh;
  background-color: lightblue;
  border-top: 0.5vh solid black;
  padding: 1vh 0;
  z-index: 10;
`;

const FlashingText = styled.div`
  font-size: calc(1.2rem + 1vw);
  font-weight: bold;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5vh;
  background-color: lightblue;
  border-top: 0.5vh solid black;
  padding: 1vh 0;
  z-index: 10;
  animation: ${flash} 1.5s infinite;
`;

const Popup = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 30vh;
  background-color: blue;
  color: white;
  border-radius: 1vh;
  font-size: calc(5rem + 1vw);
  font-weight: bold;
  padding: 1vh;
  text-align: center;
  animation: ${flash} 1.5s infinite;
  z-index: 20;
`;

const Container = styled.div<{ textHeight: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  border: 0.5vh solid black;
  box-sizing: border-box;
  z-index: 0;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: calc(3rem + 1vw);
  font-weight: bold;
  z-index: 100;
  text-align: center;
  padding: 2vh;
  border: 0.5vh solid white;
  border-radius: 1vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-left: 0.5vh solid;
  border-top: 0.5vh solid;
  border-right: 0.5vh solid;
`;

const HeaderText = styled.div`
  flex: 1;
  text-align: center;
  font-size: calc(4rem + 1vw); /* Responsive yazı boyutu */
  font-weight: bold;
  color: black;
  border-right: 0.5vh solid black;
  &:last-child {
    border-right: none;
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 100vw;
`;

const Column = styled.div<{ bgColor: string }>`
  flex: 1;
  background-color: ${(props) => props.bgColor};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: black;
  font-size: calc(2rem + 1vw); /* Responsive yazı boyutu */
  font-weight: bold;
  padding: 2vh;
  z-index: 0;
  border-right: 0.5vh solid;
  position: relative;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2%;
`;

const LeftSpan = styled.span`
  text-align: left;
  flex: 1;
  font-size: calc(8rem + 2vw); /* Responsive yazı boyutu */
`;

const RightSpan = styled.span`
  text-align: right;
  flex: 1;
  font-size: calc(8rem + 2vw); /* Responsive yazı boyutu */
`;

interface MachineDataType {
  name: string;
  targetSpeed?: string;
  averageSpeed?: string;
  actualSpeed?: string;
  idle?: string;
  message?: string;
  efficiency: string;
  color: string;
  orderValue: string;
  actualValue: string;
}

const defaultMachineData: MachineDataType = {
  name: "",
  targetSpeed: undefined,
  averageSpeed: undefined,
  actualSpeed: undefined,
  efficiency: "-",
  idle: "",
  message: "",
  color: "#cccccc",
  orderValue: "",
  actualValue: "",
};

const KayanYazi: React.FC = () => {
  const token = "alves123";
  const textRef = useRef<HTMLParagraphElement>(null);
  const [textHeight, setTextHeight] = useState(0);
  const [machine1Data, setMachine1Data] = useState<MachineDataType | null>(
    null
  );
  const [machine2Data, setMachine2Data] = useState<MachineDataType | null>(
    null
  );
  const eventSource = useRef<EventSource>();
  const [messages, setMessages] = useState<any[]>([]);
  const [activeMessage, setActiveMessage] = useState<any | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [scrollingSpeed, setScrollingSpeed] = useState<
    "slow" | "normal" | "fast"
  >("normal");
  const [progressPercent, setProgressPercent] = useState<number>(35);

  // const baseURL = process.env.TV_SOCKET_URL;
  const baseURL = "https://scada.alveskablo.com/api";

  const { machine1, machine2 } = useParams<{
    machine1: string;
    machine2?: string;
  }>();

  useEffect(() => {
    let socket: WebSocket | null = null;

    const connectToSocket = () => {
      socket = new WebSocket(`ws//scada.alveskablo.com:8081?token=${token}`);

      socket.onopen = () => {
        console.log("WebSocket bağlantısı kuruldu");
        setSocketError(null);
        const request = machine2
          ? { machine1Id: machine1, machine2Id: machine2 }
          : { machine1Id: machine1 };
        socket!.send(JSON.stringify(request));
      };

      socket.onmessage = (event) => {
        const { machineId, data } = JSON.parse(event.data);
        debugger;
        const machineData = {
          name: data.itemName,
          targetSpeed: convertValue(data.targetSpeed),
          averageSpeed: convertValue(data.averageSpeed),
          actualSpeed: convertValue(data.actualSpeed),
          orderValue: data.orderValue || "0",
          actualValue: data.actualValue || "0",
          message: data.message || "",
          idle: data.idle || "0",
          efficiency: (() => {
            const actualSpeed = parseFloat(data.actualSpeed || "0");
            const targetSpeed = parseFloat(data.targetSpeed || "0");

            // Eğer targetSpeed 0 ise veya actualSpeed 0 ise, efficiency 0 olsun
            if (isNaN(actualSpeed) || isNaN(targetSpeed) || targetSpeed === 0) {
              return "0"; // Varsayılan değer olarak '0'
            }

            return convertValue(((actualSpeed / targetSpeed) * 100).toString());
          })(),
          color: (() => {
            const actualSpeed = parseFloat(data.actualSpeed || "0");
            const targetSpeed = parseFloat(data.targetSpeed || "0");

            // Aynı şekilde color için de NaN ve 0 kontrolü
            if (isNaN(actualSpeed) || isNaN(targetSpeed) || targetSpeed === 0) {
              return renderColor("0");
            }

            return renderColor(((actualSpeed / targetSpeed) * 100).toString());
          })(),
        };

        if (machineId === machine1) {
          setMachine1Data(machineData);
        } else if (machine2 && machineId === machine2) {
          setMachine2Data(machineData);
        }
      };

      socket.onclose = () => {
        console.log(
          "WebSocket bağlantısı kapatıldı, yeniden bağlanmayı deniyor..."
        );
        setSocketError("Sinyal kesildi. Tekrar bağlanılıyor...");
        setTimeout(connectToSocket, 5000);
      };

      socket.onerror = (error) => {
        console.log("WebSocket hatası:", error);
        setSocketError("WebSocket bağlantısı başarısız oldu.");
      };
    };

    connectToSocket();

    return () => {
      if (socket) socket.close();
    };
  }, [machine1, machine2]);

  // useEffect(() => {
  //   messageSocket.on("connect", () => {
  //     console.log("Socket bağlantısı kuruldu.");
  //     setSocketError(null);
  //   });

  //   messageSocket.on("message", (message: any[]) => {
  //     console.log("Yeni mesaj alındı:", message);
  //     setMessages(message);
  //   });

  //   return () => {
  //     messageSocket.off("message");
  //   };
  // }, []);

  useEffect(() => {
    eventSource!.current = new EventSource(
      `${baseURL}/dashboard-news/events/d261e37c-35c5-4b2b-898d-ac92239b355a`
    );
    eventSource.current.onmessage = ({ data }) => {
      const payload = JSON.parse(data);
      debugger;
      setMessages(payload);
    };

    return () => {
      eventSource.current!.close();
    };
  }, []);

  const checkMessage = () => {
    const now = new Date();
    const active = messages?.find((msg: any) => {
      setScrollingSpeed(msg.scrollingSpeed);
      const startDate = new Date(msg.startDate);
      const endDate = new Date(msg.endDate);
      return now >= startDate && now < endDate;
    });

    if (active) {
      setActiveMessage(active);
    } else {
      setActiveMessage(null);
    }
  };

  const getNextMinuteInterval = () => {
    const now = new Date();
    return (60 - now.getSeconds()) * 1000;
  };

  useEffect(() => {
    if (textRef.current) {
      const height = textRef.current.getBoundingClientRect().height;
      setTextHeight(height);
    }

    checkMessage();
    const timeout = setTimeout(() => {
      checkMessage();
      const interval = setInterval(checkMessage, 60000);
      return () => clearInterval(interval);
    }, getNextMinuteInterval());

    return () => clearTimeout(timeout);
  }, [messages]);

  const renderColor = (value: string): string => {
    if (value === "0") {
      return "#DC143C";
    } else if (parseInt(value) < 75) {
      return "#FFFF00";
    } else if (parseInt(value) >= 75) {
      return "#228B22";
    }
    return "white";
  };

  const convertValue = (value: any): string => {
    // Null veya undefined kontrolü
    if (value === undefined || value === null) {
      return "";
    }

    // Eğer değer bir sayı ise string'e çevir
    if (typeof value === "number") {
      return value.toString();
    }

    // Eğer değer bir string ise ve nokta içeriyorsa, noktayla böl ve ilk kısmı al
    if (typeof value === "string" && value.includes(".")) {
      return value.split(".")[0];
    }

    // Diğer durumda olduğu gibi geri döndür
    return value;
  };

  const getPopupMessage = (machineData: MachineDataType | null) => {
    if (!machineData || machineData.actualSpeed === undefined) {
      return renderPopupMessage(true, "Sinyal Yok");
    }

    const actualSpeed = parseFloat(machineData.actualSpeed || "0");
    const efficiency = parseFloat(machineData.efficiency || "0");

    if (actualSpeed === 0) {
      return renderPopupMessage(true, machineData.idle || "Sinyal Yok");
    } else if (efficiency < 75 && machineData.message) {
      return renderPopupMessage(true, machineData.message || "Düşük Verim");
    } else {
      return renderPopupMessage(false, "");
    }
  };

  const renderPopupMessage = (isVisible: boolean, message: string) => {
    return <Popup isVisible={isVisible}>{message}</Popup>;
  };

  const getScrollSpeedDuration = () => {
    switch (scrollingSpeed) {
      case "slow":
        return 20;
      case "fast":
        return 5;
      case "normal":
      default:
        return 10;
    }
  };

  const renderProgressBar = () => {
    if (machine2) {
      return (
        <>
          <ProgressBarContainer>
            <div style={{ width: "50%", float: "left" }}>
              <Progress
                percent={calculateMachine1ProcessBar()}
                showInfo={true}
                strokeWidth={40}
                status="active"
              />
            </div>
            <div style={{ width: "50%", float: "right" }}>
              <Progress
                percent={calculateMachine2ProcessBar()}
                showInfo={true}
                strokeWidth={40}
                status="active"
              />
            </div>
          </ProgressBarContainer>
        </>
      );
    } else {
      // Sadece bir makine varsa tüm ekran boyunca progress bar
      return (
        <ProgressBarContainer>
          <Progress
            percent={calculateMachine1ProcessBar()}
            showInfo={true}
            strokeWidth={40}
            status="active"
          />
        </ProgressBarContainer>
      );
    }
  };

  const calculateMachine1ProcessBar = () => {
    return Math.round(
      ((Math.round(parseFloat(machine1Data?.actualValue!)) || 0) /
        (Math.round(parseFloat(machine1Data?.orderValue!)) || 0)) *
        100
    );
  };

  const calculateMachine2ProcessBar = () => {
    return Math.round(
      ((Math.round(parseFloat(machine2Data?.actualValue!)) || 0) /
        (Math.round(parseFloat(machine2Data?.orderValue!)) || 0)) *
        100
    );
  };

  return (
    <>
      {socketError && <LoadingOverlay>{socketError}</LoadingOverlay>}

      <Header>
        {machine2 ? (
          <>
            <HeaderText>{machine1Data?.name || "Yükleniyor..."}</HeaderText>
            <HeaderText>{machine2Data?.name || "Yükleniyor..."}</HeaderText>
          </>
        ) : (
          <HeaderText>{machine1Data?.name || "Yükleniyor..."}</HeaderText>
        )}
      </Header>

      <Container textHeight={textHeight}>
        <Content>
          {machine2 ? (
            <>
              <Column bgColor={machine1Data?.color || "#000"}>
                <Row>
                  <LeftSpan>HEDEF</LeftSpan>
                  <RightSpan>
                    {machine1Data?.targetSpeed
                      ? machine1Data.targetSpeed + " m/s"
                      : "N/A"}
                  </RightSpan>
                </Row>
                <Row>
                  <LeftSpan>ORT</LeftSpan>
                  <RightSpan>
                    {machine1Data?.averageSpeed
                      ? machine1Data.averageSpeed + " m/s"
                      : "N/A"}
                  </RightSpan>
                </Row>
                <Row>
                  <LeftSpan>ANLIK</LeftSpan>
                  <RightSpan>
                    {machine1Data?.actualSpeed
                      ? machine1Data.actualSpeed + " m/s"
                      : "N/A"}
                  </RightSpan>
                </Row>
                <Row>
                  <LeftSpan>VERİM</LeftSpan>
                  <RightSpan>
                    {machine1Data?.efficiency
                      ? "% " + machine1Data.efficiency || 0
                      : "N/A"}
                  </RightSpan>
                </Row>
                {getPopupMessage(machine1Data)}
              </Column>

              <Column bgColor={machine2Data?.color || "#000"}>
                <Row>
                  <LeftSpan>HEDEF</LeftSpan>
                  <RightSpan>
                    {machine2Data?.targetSpeed
                      ? machine2Data.targetSpeed + " m/s"
                      : "N/A"}
                  </RightSpan>
                </Row>
                <Row>
                  <LeftSpan>ORT</LeftSpan>
                  <RightSpan>
                    {machine2Data?.averageSpeed
                      ? machine2Data.averageSpeed + " m/s"
                      : "N/A"}
                  </RightSpan>
                </Row>
                <Row>
                  <LeftSpan>ANLIK</LeftSpan>
                  <RightSpan>
                    {machine2Data?.actualSpeed
                      ? machine2Data.actualSpeed + " m/s"
                      : "N/A"}
                  </RightSpan>
                </Row>
                <Row>
                  <LeftSpan>VERİM</LeftSpan>
                  <RightSpan>
                    {machine2Data?.efficiency
                      ? "% " + machine2Data.efficiency || 0
                      : "N/A"}
                  </RightSpan>
                </Row>
                {getPopupMessage(machine2Data)}
              </Column>
            </>
          ) : (
            <Column bgColor={machine1Data?.color || "#000"}>
              <Row>
                <LeftSpan>HEDEF</LeftSpan>
                <RightSpan>
                  {machine1Data?.targetSpeed
                    ? machine1Data.targetSpeed + " m/s"
                    : "N/A"}
                </RightSpan>
              </Row>
              <Row>
                <LeftSpan>ORT</LeftSpan>
                <RightSpan>
                  {machine1Data?.averageSpeed
                    ? machine1Data.averageSpeed + " m/s"
                    : "N/A"}
                </RightSpan>
              </Row>
              <Row>
                <LeftSpan>ANLIK</LeftSpan>
                <RightSpan>
                  {machine1Data?.actualSpeed
                    ? machine1Data.actualSpeed + " m/s"
                    : "N/A"}
                </RightSpan>
              </Row>
              <Row>
                <LeftSpan>VERİM</LeftSpan>
                <RightSpan>
                  {machine1Data?.efficiency
                    ? "% " + machine1Data.efficiency || 0
                    : "N/A"}
                </RightSpan>
              </Row>
              {getPopupMessage(machine1Data)}
            </Column>
          )}
        </Content>
      </Container>

      {socketError && <LoadingOverlay>{socketError}</LoadingOverlay>}
      {activeMessage ? (
        <>
          {activeMessage.type === "scrolling" && (
            <KayanYaziContainer textHeight={textHeight}>
              <KayanYaziText duration={getScrollSpeedDuration()}>
                {activeMessage.message}
              </KayanYaziText>
            </KayanYaziContainer>
          )}

          {activeMessage.type === "fixed" && (
            <FixedText>{activeMessage.message}</FixedText>
          )}

          {activeMessage.type === "blinking" && (
            <FlashingText>{activeMessage.message}</FlashingText>
          )}
        </>
      ) : (
        renderProgressBar()
      )}
    </>
  );
};

export default KayanYazi;
