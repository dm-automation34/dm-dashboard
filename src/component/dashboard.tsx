import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useParams } from "react-router-dom";

// Kayan yazı animasyonu
const kayan = keyframes`
  0% {
    transform: translateX(100vw); // Start completely off-screen on the right
  }
  100% {
    transform: translateX(-100%); // Move all the way to the left
  }
`;

// Yanıp sönen kutu animasyonu
const flash = keyframes`    
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

// Stil bileşenleri
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

// Sabit yazı (sabit yazı için stil - en altta olacak şekilde ayarlandı)
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
  height: 50px; // Yükseklik sabit mesaj kutusu için ayarlandı
  background-color: lightblue;
  border-top: 5px solid black;
  padding: 10px 0;
  z-index: 10;
`;

// Yanıp sönen yazı (en altta olacak şekilde ayarlandı)
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
  height: 50px; // Yükseklik yanıp sönen mesaj kutusu için ayarlandı
  background-color: lightblue;
  border-top: 5px solid black;
  padding: 10px 0;
  z-index: 10;
  animation: ${flash} 1.5s infinite;
`;

// Sayfanın ortasında iki sütun yapısı
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

// Üstteki ince border ile metinleri taşıyan alan
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

// İçerik alanı: Sol ve sağ sütunlar
const Content = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 100vw;
`;

// Sol taraf (renk dinamik olarak uygulanır)
const LeftColumn = styled.div<{ bgColor: string }>`
  flex: 1;
  background-color: ${(props) => props.bgColor}; // Dinamik arka plan rengi
  display: flex;
  justify-content: center;
  align-items: normal;
  color: black;
  font-size: calc(4rem + 2vw);
  font-weight: bold;
  padding: 20px;
  z-index: 0;

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

// Sağ taraf (renk dinamik olarak uygulanır)
const RightColumn = styled.div<{ bgColor: string }>`
  flex: 1;
  background-color: ${(props) => props.bgColor}; // Dinamik arka plan rengi
  display: flex;
  justify-content: center;
  align-items: normal;
  color: black;
  font-size: calc(4rem + 2vw);
  font-weight: bold;
  padding: 20px;
  z-index: 0;

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

// Dummy JSON data with colors
const dummyData = {
  header: {
    left: "2,88 mm ALUMİNYUM TEL",
    right: "1,74 mm BAKIR İLETKEN",
  },
  leftColumn: {
    target: "6 m/sn",
    average: "6 m/sn",
    current: "5 m/sn",
    efficiency: "%92",
    color: "#4caf50", // Green color for left column
  },
  rightColumn: {
    target: "12 m/sn",
    average: "3 m/sn",
    current: "3 m/sn",
    efficiency: "%68",
    color: "#ff9800", // Orange color for right column
  },
};

// MessageType
interface MessageType {
  type: "scrolling" | "fixed" | "blinking";
  message: string;
  start: string;
  end: string;
}

const KayanYazi: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [textHeight, setTextHeight] = useState(0);
  const [activeMessage, setActiveMessage] = useState<MessageType | null>(null);

  // Extract parameters from the URL path instead of query params
  const { tvid, machine1, machine2 } = useParams<{
    tvid: string;
    machine1: string;
    machine2: string;
  }>();

  useEffect(() => {
    // Log the parameters from the URL
    console.log("TV ID:", tvid);
    console.log("Machine 1:", machine1);
    console.log("Machine 2:", machine2);
  }, [tvid, machine1, machine2]);

  // Example messages with different types
  const messages: MessageType[] = [
    {
      start: "14:57",
      end: "14:58",
      message: "SAAT 11:10-11:30 ARASINDA İŞ GÜVENLİĞİ TOPLANTISI",
      type: "scrolling",
    },
    {
      start: "14:58",
      end: "14:59",
      message: "SAAT 13:15-13:50 ARASINDA EĞİTİM",
      type: "fixed",
    },
    {
      start: "14:59",
      end: "15:00",
      message: "ACİL DURUM: BÖLGE BOŞALTILACAKTIR",
      type: "blinking",
    },
  ];

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
    return (60 - now.getSeconds()) * 1000; // How long until the next minute
  };

  useEffect(() => {
    // Kayan yazı boyutunu ayarla
    if (textRef.current) {
      const height = textRef.current.getBoundingClientRect().height;
      setTextHeight(height);
    }

    // First check and set immediate interval for the next minute
    checkMessage();

    const timeout = setTimeout(() => {
      checkMessage(); // Check exactly on the next minute
      const interval = setInterval(checkMessage, 60000); // Then check every minute
      return () => clearInterval(interval);
    }, getNextMinuteInterval());

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Üstteki başlık (from dummy data) */}
      <Header>
        <HeaderText>{dummyData.header.left}</HeaderText>
        <HeaderText>{dummyData.header.right}</HeaderText>
      </Header>

      {/* İki sütunlu yapı (from dummy data with dynamic colors) */}
      <Container textHeight={textHeight}>
        <Content>
          <LeftColumn bgColor={dummyData.leftColumn.color}>
            <table>
              <tbody>
                <tr>
                  <td>HEDEF</td>
                  <td>{dummyData.leftColumn.target}</td>
                </tr>
                <tr>
                  <td>ORT</td>
                  <td>{dummyData.leftColumn.average}</td>
                </tr>
                <tr>
                  <td>ANLIK</td>
                  <td>{dummyData.leftColumn.current}</td>
                </tr>
                <tr>
                  <td>VERİM</td>
                  <td>{dummyData.leftColumn.efficiency}</td>
                </tr>
              </tbody>
            </table>
          </LeftColumn>

          <RightColumn bgColor={dummyData.rightColumn.color}>
            <table>
              <tbody>
                <tr>
                  <td>HEDEF</td>
                  <td>{dummyData.rightColumn.target}</td>
                </tr>
                <tr>
                  <td>ORT</td>
                  <td>{dummyData.rightColumn.average}</td>
                </tr>
                <tr>
                  <td>ANLIK</td>
                  <td>{dummyData.rightColumn.current}</td>
                </tr>
                <tr>
                  <td>VERİM</td>
                  <td>{dummyData.rightColumn.efficiency}</td>
                </tr>
              </tbody>
            </table>
          </RightColumn>
        </Content>
      </Container>

      {/* Different Message Types */}
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
