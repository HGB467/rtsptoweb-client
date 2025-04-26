import React from "react";
import { Card, Button, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ErrorCard = ({ title, message, onRetry }) => {
  return (
    <Card
      className="my-[50px] mx-auto text-center max-w-7xl min-w-3xl"
      cover={
        <CloseCircleOutlined className="text-[64px] text-[#ff4d4f] my-[20px]"
        />
      }
    >
      <Title level={4} className="text-[#ff4d4f]">
        {title || "Error Occurred"}
      </Title>
      <Text type="secondary">{message || "Something went wrong!"}</Text>
      <div className="mt-20">
        {onRetry && (
          <Button type="primary" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorCard;
