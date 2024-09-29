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
  width: calc(250px + 1vw); /* Popup genişliği dinamik hale getirildi */
  height: calc(150px + 1vw); /* Popup yüksekliği dinamik hale getirildi */
  background-color: blue;
  color: white;
  border-radius: 10px;
  font-size: calc(24px + 1vw); /* Popup fontu büyütüldü */
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
  color: "#cccccc", // Default gri renk
};

const KayanYazi: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [textHeight, setTextHeight] = useState(0);
  const [machine1Data, setMachine1Data] =
    useState<MachineDataType>(defaultMachineData);
  const [machine2Data, setMachine2Data] =
    useState<MachineDataType>(defaultMachineData);

  const { machine1, machine2 } = useParams<{
    machine1: string;
    machine2?: string;
  }>();

  useEffect(() => {
    let socket1: WebSocket | null = null;
    let socket2: WebSocket | null = null;

    // Eğer machine1 varsa WebSocket bağlantısı kurulur
    if (machine1) {
      socket1 = new WebSocket("ws://192.168.0.242:8080");
      socket1.onopen = () => {
        socket1!.send(JSON.stringify({ machineId: machine1 }));
      };
      socket1.onmessage = (event) => {
        const { data } = JSON.parse(event.data);
        // console.log("Machine 1 data:", data);
        setMachine1Data({
          name: data.itemName,
          target: convertValue(data.targetSpeed),
          average: convertValue(data.averageSpeed),
          current: convertValue(data.actualSpeed),
          message: data.message, // Message is added here
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

      socket1.onclose = () => {
        // console.log("WebSocket bağlantısı kapatıldı (Machine 1).");
      };
    }

    // Eğer machine2 varsa WebSocket bağlantısı kurulur
    if (machine2) {
      socket2 = new WebSocket("ws://192.168.0.242:8080");
      socket2.onopen = () => {
        socket2!.send(JSON.stringify({ machineId: machine2 }));
      };
      socket2.onmessage = (event) => {
        const { data } = JSON.parse(event.data);
        // console.log("Machine 2 data:", data);
        setMachine2Data({
          name: data.itemName,
          target: convertValue(data.targetSpeed),
          average: convertValue(data.averageSpeed),
          current: convertValue(data.actualSpeed),
          message: data.message, // Message is added here
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
      socket2.onclose = () => {
        // console.log("WebSocket bağlantısı kapatıldı (Machine 2).");
      };
    }

    return () => {
      // Cleanup on unmount
      if (socket1) socket1.close();
      if (socket2) socket2.close();
    };
  }, [machine1, machine2]);

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
    </>
  );
};

export default KayanYazi;
