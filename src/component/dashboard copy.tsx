import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useParams } from "react-router-dom";

// Animasyonlar
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

// Stil Bileşenleri
const KayanYaziContainer = styled.div<{ textHeight: number }>`
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 10px 0;
  border-top: 5px solid black;
  background-color: lightblue;
  z-index: 1;
  border-left: 10px solid;
  border-bottom: 10px solid;
  border-right: 10px solid;
`;

const KayanYaziText = styled.p`
  display: inline-block;
  animation: ${kayan} 10s linear infinite;
  font-size: calc(20px + 1vw);
  font-weight: bold;
  color: black;
  margin: 0;
  z-index: 1;
`;

const FixedText = styled.div`
  font-size: calc(20px + 1vw);
  font-weight: bold;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: lightblue;
  border-top: 5px solid black;
  padding: 10px 0;
  z-index: 10;
`;

const FlashingText = styled.div`
  font-size: calc(20px + 1vw);
  font-weight: bold;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: lightblue;
  border-top: 5px solid black;
  padding: 10px 0;
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
  width: calc(250px + 1vw);
  height: calc(150px + 1vw);
  background-color: blue;
  color: white;
  border-radius: 10px;
  font-size: calc(24px + 1vw);
  font-weight: bold;
  padding: 10px;
  text-align: center;
  animation: ${flash} 1.5s infinite;
  z-index: 20;
`;

const Container = styled.div<{ textHeight: number }>`
  display: flex;
  flex-direction: column;
  height: calc(90vh - ${(props) => props.textHeight + 20}px);
  width: 100%;
  max-width: 100vw;
  border: 10px solid black;
  box-sizing: border-box;
  z-index: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 3px solid black;
  height: 50px;
  border-left: 10px solid;
  border-top: 10px solid;
  border-right: 10px solid;
`;

const HeaderText = styled.div`
  flex: 1;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  border-right: 1px solid black;
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

const LeftColumn = styled.div<{ bgColor: string }>`
  flex: 1;
  background-color: ${(props) => props.bgColor};
  display: flex;
  justify-content: center;
  align-items: normal;
  color: black;
  font-size: calc(4rem + 2vw);
  font-weight: bold;
  padding: 20px;
  z-index: 0;
  border-right: 10px solid;
  position: relative;

  table {
    width: 100%;
    td {
      text-align: left;
      padding: 25px;
    }
    tr {
      margin-bottom: 25px;
    }
  }
`;

const RightColumn = styled.div<{ bgColor: string }>`
  flex: 1;
  background-color: ${(props) => props.bgColor};
  display: flex;
  justify-content: center;
  align-items: normal;
  color: black;
  font-size: calc(4rem + 2vw);
  font-weight: bold;
  padding: 20px;
  z-index: 0;
  position: relative;

  table {
    width: 100%;
    td {
      text-align: left;
      padding: 25px;
    }
    tr {
      margin-bottom: 25px;
    }
  }
`;

interface MachineDataType {
  name: string;
  target?: string;
  average?: string;
  current?: string;
  message?: string;
  efficiency: string;
  color: string;
}

const defaultMachineData: MachineDataType = {
  name: "",
  target: undefined,
  average: undefined,
  current: undefined,
  efficiency: "-",
  color: "#cccccc",
};

interface MessageType {
  type: "scrolling" | "fixed" | "blinking";
  message: string;
  start: string;
  end: string;
}

const KayanYazi: React.FC = () => {
  const token = "alves123";
  const textRef = useRef<HTMLParagraphElement>(null);
  const [textHeight, setTextHeight] = useState(0);
  const [machine1Data, setMachine1Data] =
    useState<MachineDataType>(defaultMachineData);
  const [machine2Data, setMachine2Data] =
    useState<MachineDataType>(defaultMachineData);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [activeMessage, setActiveMessage] = useState<MessageType | null>(null);

  const { machine1, machine2 } = useParams<{
    machine1: string;
    machine2?: string;
  }>();

  useEffect(() => {
    let socket1: WebSocket | null = null;
    let socket2: WebSocket | null = null;
    let messageSocket: WebSocket | null = null;

    if (machine1) {
      socket1 = new WebSocket(`ws://192.168.0.242:8080?token=${token}`);
      socket1.onopen = () => {
        socket1!.send(JSON.stringify({ machineId: machine1 }));
      };
      socket1.onmessage = (event) => {
        const { data } = JSON.parse(event.data);
        setMachine1Data({
          name: data.itemName,
          target: convertValue(data.targetSpeed),
          average: convertValue(data.averageSpeed),
          current: convertValue(data.actualSpeed),
          message: data.message,
          efficiency: convertValue(
            (
              (parseFloat(data.actualSpeed) / parseFloat(data.targetSpeed)) *
              100
            ).toString()
          ),
          color: renderColor(
            (
              (parseFloat(data.actualSpeed) / parseFloat(data.targetSpeed)) *
              100
            ).toString()
          ),
        });
      };
      socket1.onclose = () => {};
    }

    if (machine2) {
      socket2 = new WebSocket(`ws://192.168.0.242:8080?token=${token}`);
      socket2.onopen = () => {
        socket2!.send(JSON.stringify({ machineId: machine2 }));
      };
      socket2.onmessage = (event) => {
        debugger;
        const { data } = JSON.parse(event.data);
        setMachine2Data({
          name: data.itemName,
          target: convertValue(data.targetSpeed),
          average: convertValue(data.averageSpeed),
          current: convertValue(data.actualSpeed),
          message: data.message,
          efficiency: convertValue(
            (
              (parseFloat(data.actualSpeed) / parseFloat(data.targetSpeed)) *
              100
            ).toString()
          ),
          color: renderColor(
            (
              (parseFloat(data.actualSpeed) / parseFloat(data.targetSpeed)) *
              100
            ).toString()
          ),
        });
      };
      socket2.onclose = () => {};
    }

    // Mesajlar için WebSocket
    // messageSocket = new WebSocket(`ws://http://localhost:3002//messages`);
    // messageSocket.onopen = () => {
    //   console.log("Mesaj WebSocket bağlantısı kuruldu");
    // };
    // messageSocket.onmessage = (event) => {
    //   const newMessage = JSON.parse(event.data);
    //   setMessages((prevMessages) => [...prevMessages, newMessage]);
    // };
    // messageSocket.onclose = () => {
    //   console.log("Mesaj WebSocket bağlantısı kapatıldı");
    // };

    return () => {
      if (socket1) socket1.close();
      if (socket2) socket2.close();
      // if (messageSocket) messageSocket.close();
    };
  }, [machine1, machine2]);

  const checkMessage = () => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const active = messages.find(
      (msg) => currentTime >= msg.start && currentTime < msg.end
    );
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
    return "";
  };

  const convertValue = (value: string): string => {
    return value.includes(".") ? value.split(".")[0] : value;
  };

  return (
    <>
      <Header>
        {machine2 ? (
          <>
            <HeaderText>{machine1Data.name}</HeaderText>
            <HeaderText>{machine2Data.name}</HeaderText>
          </>
        ) : (
          <HeaderText>{machine1Data.name}</HeaderText>
        )}
      </Header>

      <Container textHeight={textHeight}>
        <Content>
          {machine2 ? (
            <>
              <LeftColumn bgColor={machine1Data.color}>
                <table>
                  <tbody>
                    <tr>
                      <td>HEDEF</td>
                      <td>{machine1Data.target + " m/s"}</td>
                    </tr>
                    <tr>
                      <td>ORT</td>
                      <td>{machine1Data.average + " m/s"}</td>
                    </tr>
                    <tr>
                      <td>ANLIK</td>
                      <td>{machine1Data.current + " m/s"}</td>
                    </tr>
                    <tr>
                      <td>VERİM</td>
                      <td>{"% " + machine1Data.efficiency}</td>
                    </tr>
                  </tbody>
                </table>
                <Popup isVisible={parseInt(machine1Data.efficiency) < 75}>
                  {machine1Data.message || "Sebep"}
                </Popup>
              </LeftColumn>

              <RightColumn bgColor={machine2Data.color}>
                <table>
                  <tbody>
                    <tr>
                      <td>HEDEF</td>
                      <td>{machine2Data.target + " m/s"}</td>
                    </tr>
                    <tr>
                      <td>ORT</td>
                      <td>{machine2Data.average + " m/s"}</td>
                    </tr>
                    <tr>
                      <td>ANLIK</td>
                      <td>{machine2Data.current + " m/s"}</td>
                    </tr>
                    <tr>
                      <td>VERİM</td>
                      <td>{"% " + machine2Data.efficiency}</td>
                    </tr>
                  </tbody>
                </table>
                <Popup isVisible={parseInt(machine2Data.efficiency) < 75}>
                  {machine2Data.message || "Sebep"}
                </Popup>
              </RightColumn>
            </>
          ) : (
            <RightColumn bgColor={machine1Data.color}>
              <table>
                <tbody>
                  <tr>
                    <td>HEDEF</td>
                    <td>{machine1Data.target + " m/s"}</td>
                  </tr>
                  <tr>
                    <td>ORT</td>
                    <td>{machine1Data.average + " m/s"}</td>
                  </tr>
                  <tr>
                    <td>ANLIK</td>
                    <td>{machine1Data.current + " m/s"}</td>
                  </tr>
                  <tr>
                    <td>VERİM</td>
                    <td>{"% " + machine1Data.efficiency}</td>
                  </tr>
                </tbody>
              </table>
              <Popup isVisible={parseInt(machine1Data.efficiency) < 75}>
                {machine1Data.message || "Sebep"}
              </Popup>
            </RightColumn>
          )}
        </Content>
      </Container>

      {activeMessage && (
        <>
          {activeMessage.type === "scrolling" && (
            <KayanYaziContainer textHeight={textHeight}>
              <KayanYaziText ref={textRef}>
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
      )}
    </>
  );
};

export default KayanYazi;
