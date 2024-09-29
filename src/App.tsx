import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

// Kayan yazı animasyonu
const kayan = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
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

// Kayan yazı için stil bileşenleri
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

// Sayfanın ortasında iki sütun yapısı
const Container = styled.div<{ textHeight: number }>`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${(props) => props.textHeight + 20}px);
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

// Sol taraf: Yeşil alan
const LeftColumn = styled.div`
  flex: 1;
  background-color: #4caf50;
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

// Sağ taraf: Turuncu alan
const RightColumn = styled.div`
  flex: 1;
  background-color: #ff9800;
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

// Ortadaki siyah ayırıcı çizgi
const Divider = styled.div`
  width: 5px;
  background-color: black;
  z-index: 0;
`;

// Yanıp sönen kutu
// Yanıp sönen kutu
const FlashingBox = styled.div<{ isRight: boolean }>`
  background-color: #0044ff;
  padding: calc(20px + 1vw); /* Responsive padding */
  color: white;
  border-radius: 10px;
  animation: ${flash} 1.5s infinite;
  text-align: center;
  font-size: calc(2rem + 1vw); /* Responsive font-size */
  position: absolute;
  top: 50%;
  ${(props) =>
    props.isRight
      ? "left: 75%;"
      : "left: 25%;"} /* Sağa veya sola göre ayarlama */
  transform: translateX(-50%) translateY(-50%); /* Yatayda ve dikeyde tam ortalama */
  z-index: 2;
`;

const KayanYazi: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [textHeight, setTextHeight] = useState(0);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const messages = [
    {
      start: "11:10",
      end: "11:30",
      message: "SAAT 11:10-11:30 ARASINDA İŞ GÜVENLİĞİ TOPLANTISI",
    },
    {
      start: "13:15",
      end: "13:50",
      message: "SAAT 13:15-13:50 ARASINDA EĞİTİM",
    },
  ];

  const checkMessage = () => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const active = messages.find(
      (msg) => currentTime >= msg.start && currentTime <= msg.end
    );
    if (active) {
      setActiveMessage(active.message);
    } else {
      setActiveMessage(null);
    }
  };

  useEffect(() => {
    // Kayan yazı boyutunu ayarla
    if (textRef.current) {
      const height = textRef.current.getBoundingClientRect().height;
      setTextHeight(height);
    }

    // Zaman kontrolü için her dakika bir kez çalıştır
    const interval = setInterval(() => {
      checkMessage();
    }, 60000);

    // İlk kontrol
    checkMessage();

    return () => clearInterval(interval);
  }, []);

  // Eğer aktif bir mesaj yoksa kayan yazıyı gizle
  if (!activeMessage) {
    return null;
  }

  return (
    <>
      {/* Üstteki başlık */}
      <Header>
        <HeaderText>2,88 mm ALUMİNYUM TEL</HeaderText>
        <HeaderText>1,74 mm BAKIR İLETKEN</HeaderText>
      </Header>

      {/* İki sütunlu yapı */}
      <Container textHeight={textHeight}>
        <Content>
          <LeftColumn>
            <table>
              <tbody>
                <tr>
                  <td>HEDEF</td>
                  <td>6 m/sn</td>
                </tr>
                <tr>
                  <td>ORT</td>
                  <td>6 m/sn</td>
                </tr>
                <tr>
                  <td>ANLIK</td>
                  <td>5 m/sn</td>
                </tr>
                <tr>
                  <td>VERİM</td>
                  <td>%92</td>
                </tr>
              </tbody>
            </table>
            <FlashingBox isRight={false}>
              K-01 HIZ DÜŞÜK <br /> TEL KOPMASI - 7 dk
            </FlashingBox>
          </LeftColumn>

          <RightColumn>
            <table>
              <tbody>
                <tr>
                  <td>HEDEF</td>
                  <td>12 m/sn</td>
                </tr>
                <tr>
                  <td>ORT</td>
                  <td>3 m/sn</td>
                </tr>
                <tr>
                  <td>ANLIK</td>
                  <td>3 m/sn</td>
                </tr>
                <tr>
                  <td>VERİM</td>
                  <td>%68</td>
                </tr>
              </tbody>
            </table>
            <FlashingBox isRight={true}>
              K-02 HIZ DÜŞÜK <br /> TEL KOPMASI - 10 dk
            </FlashingBox>
          </RightColumn>
        </Content>
      </Container>

      {/* Kayan yazı */}
      <KayanYaziContainer textHeight={textHeight}>
        <KayanYaziText ref={textRef}>{activeMessage}</KayanYaziText>
      </KayanYaziContainer>
    </>
  );
};

export default KayanYazi;
