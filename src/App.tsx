import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Divider } from "antd";
import GaugeChart from "react-gauge-chart";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Dummy data
const dummyScreens = [
  {
    machineName: "Machine 1",
    slideHeader: "Machine 1",
    workingSpeed: 70,
    targetPercentage: 100,
    actualSpeed: 80,
  },
  {
    machineName: "Machine 2",
    slideHeader: "Machine 2",
    workingSpeed: 60,
    targetPercentage: 100,
    actualSpeed: 65,
  },
];

// SliderItem Component
interface SliderItemProps {
  screen: any;
  border: string;
}

const SliderItem: React.FC<SliderItemProps> = ({ screen, border }) => {
  const productivity = Math.round(
    (screen.workingSpeed / screen.targetPercentage || 0) * 100
  );

  const color =
    productivity >= 80
      ? "#57CA22"
      : productivity > 0 && productivity < 80
      ? "#ef6c00"
      : "#FF1943";

  const items = [
    {
      title: "Target",
      description: `${Math.round(screen.targetPercentage) || 0} m/dk`,
    },
    {
      title: "Average",
      description: `${Math.round(screen.workingSpeed) || 0} m/dk`,
    },
    {
      title: "Current",
      description: `${Math.round(screen.actualSpeed) || 0} m/dk`,
    },
    {
      title: "Productivity",
      description: `%${productivity}`,
      color,
    },
  ];

  return (
    <Card style={{ borderLeft: border }}>
      <Typography.Title
        level={3}
        style={{ backgroundColor: "#FFA319", padding: "10px" }}
      >
        {screen.slideHeader}
      </Typography.Title>
      <Row gutter={16}>
        {items.map((item, index) => (
          <Col
            span={24}
            key={index}
            style={{ padding: "10px 0", color: item.color }}
          >
            <Typography.Text strong>{item.title}:</Typography.Text>{" "}
            <Typography.Text>{item.description}</Typography.Text>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

// StatisticCard Component
interface StatisticCardProps {
  actualSpeed: number;
  workingSpeed: number;
  productionSpeed: number;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  actualSpeed,
  workingSpeed,
  productionSpeed,
}) => {
  return (
    <Card>
      <Row gutter={16}>
        <Col span={8} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>{actualSpeed}</Typography.Title>
          <Typography.Text>Actual Speed</Typography.Text>
        </Col>
        <Divider type="vertical" />
        <Col span={8} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>{workingSpeed}</Typography.Title>
          <Typography.Text>Working Speed</Typography.Text>
        </Col>
        <Divider type="vertical" />
        <Col span={8} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>{productionSpeed}</Typography.Title>
          <Typography.Text>Production Speed</Typography.Text>
        </Col>
      </Row>
    </Card>
  );
};

// StatisticChart Component
interface StatisticChartProps {
  screen: any;
  percent: number;
  subTitle: string;
}

const StatisticChart: React.FC<StatisticChartProps> = ({
  screen,
  percent,
  subTitle,
}) => {
  const [currentPercent, setCurrentPercent] = useState(
    Math.round(percent) || 0
  );

  return (
    <Card>
      <Typography.Title level={3}>{screen.slideHeader}</Typography.Title>
      <GaugeChart
        arcPadding={0.1}
        cornerRadius={3}
        percent={currentPercent / 100}
        colors={["#57CA22", "#ef6c00"]}
      />
      <Divider />
      <Typography.Text>{subTitle}</Typography.Text>
    </Card>
  );
};

// Main StatisticList Component
const StatisticList: React.FC = () => {
  const [screens, setScreens] = useState<any[]>([]);

  useEffect(() => {
    // Using dummy data for demonstration. Replace with API call to get screens.
    setScreens(dummyScreens);

    const intervalId = setInterval(() => {
      // Simulate an API call to fetch updated screen data every 60 seconds.
      setScreens(dummyScreens); // You can fetch fresh data here
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {screens && screens.length > 0 ? (
        <Swiper spaceBetween={0} slidesPerView={1}>
          <SwiperSlide>
            <Row gutter={16}>
              {screens.map((screen) => (
                <Col span={8} key={screen.machineName}>
                  <SliderItem screen={screen} border="6px solid #000" />
                </Col>
              ))}
            </Row>
          </SwiperSlide>
        </Swiper>
      ) : null}
    </div>
  );
};

export default StatisticList;
