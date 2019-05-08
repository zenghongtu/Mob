import React, { Component } from 'react';
import { Tag } from 'antd';

const PayTag = ({ color = '#f50' }) => {
  return <Tag color={color}>付费</Tag>;
};

export default PayTag;
